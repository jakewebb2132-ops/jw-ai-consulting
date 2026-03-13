import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Proposal, ContentBlock, PricingItem } from '../types/proposal';
import { generateDefaultProposal } from '../utils/defaultProposal';

interface ProposalState {
  proposal: Proposal | null;
  proposals: Proposal[];
  activeBlockId: string | null;
  lastLocalSave: Date | null;
  
  // Supabase Sync States
  isSaving: boolean;
  saveError: string | null;
  
  // Actions
  initializeProposal: (proposal: Proposal) => void;
  saveProposal: () => Promise<void>;
  updateProposalDetails: (updates: Partial<Pick<Proposal, 'title' | 'status' | 'expirationDate' | 'clientId' | 'companyLogo' | 'companyName'>>) => void;
  setActiveBlockId: (id: string | null) => void;
  clearDraft: () => void;
  
  // Blocks
  addBlock: (block: Omit<ContentBlock, 'orderIndex'>) => void;
  updateBlock: (id: string, updates: Partial<Omit<ContentBlock, 'id' | 'type'>>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (newOrder: ContentBlock[]) => void;
  
  // Pricing
  addPricingItem: (item: PricingItem) => void;
  updatePricingItem: (id: string, updates: Partial<Omit<PricingItem, 'id'>>) => void;
  removePricingItem: (id: string) => void;
  
  // Fetching
  fetchProposal: (id: string) => Promise<void>;
  fetchAllProposals: () => Promise<void>;
}

const calculateTotalValue = (pricing: PricingItem[]): number => {
  return pricing.reduce((total, item) => {
    if (!item.isOptional) {
      return total + (item.quantity * item.unitPrice);
    }
    return total;
  }, 0);
};

export const useProposalStore = create<ProposalState>()(
  persist(
    (set, get) => ({
  proposal: generateDefaultProposal(),
  proposals: [],
  activeBlockId: null,
  lastLocalSave: null,
  isSaving: false,
  saveError: null,

  setActiveBlockId: (id) => set({ activeBlockId: id }),

  initializeProposal: (proposal) => set({ proposal, lastLocalSave: new Date() }),

  clearDraft: () => set({ proposal: generateDefaultProposal(), lastLocalSave: null }),

  saveProposal: async () => {
    const { proposal } = get();
    if (!proposal) return;
    
    set({ isSaving: true, saveError: null });
    
    try {
      // Dynamic import to avoid SSR/Vite issues if called early
      const { supabase } = await import('../lib/supabase');
      
      const payload = {
        id: proposal.id,
        title: proposal.title || 'Untitled Proposal',
        status: proposal.status,
        client_id: proposal.clientId,
        blocks: proposal.blocks,
        pricing: proposal.pricing,
        total_value: proposal.totalValue,
        company_name: proposal.companyName,
        company_logo: proposal.companyLogo,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('proposals')
        .upsert(payload, { onConflict: 'id' });
        
      if (error) throw error;
      // On successful DB save, also update the local save timestamp
      set({ lastLocalSave: new Date() });
      
    } catch (err: any) {
      console.error('Failed to save to Supabase:', err);
      set({ saveError: err.message });
    } finally {
      set({ isSaving: false });
    }
  },

  updateProposalDetails: (updates) => set((state) => {
    if (!state.proposal) return state;
    return {
      proposal: {
        ...state.proposal,
        ...updates,
        updatedAt: new Date(),
      },
      lastLocalSave: new Date(),
    };
  }),

  // ** Blocks Engine **
  addBlock: (block) => set((state) => {
    if (!state.proposal) return state;
    
    // Assign orderIndex to the very end
    const lastIndex = state.proposal.blocks.reduce((max, b) => Math.max(max, b.orderIndex), -1);
    
    const newBlock: ContentBlock = {
      ...block,
      orderIndex: lastIndex + 1,
    };

    return {
      proposal: {
        ...state.proposal,
        blocks: [...state.proposal.blocks, newBlock].sort((a, b) => a.orderIndex - b.orderIndex),
        updatedAt: new Date(),
      },
      lastLocalSave: new Date(),
    };
  }),

  updateBlock: (id, updates) => set((state) => {
    if (!state.proposal) return state;

    const updatedBlocks = state.proposal.blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    );

    return {
      proposal: {
        ...state.proposal,
        blocks: updatedBlocks,
        updatedAt: new Date(),
      },
      lastLocalSave: new Date(),
    };
  }),

  removeBlock: (id) => set((state) => {
    if (!state.proposal) return state;

    const remainingBlocks = state.proposal.blocks.filter(block => block.id !== id);
    
    // Recalculate order indices to stay sequential after a removal
    const recalcedBlocks = remainingBlocks
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((block, i) => ({ ...block, orderIndex: i }));

    return {
      proposal: {
        ...state.proposal,
        blocks: recalcedBlocks,
        updatedAt: new Date(),
      },
      lastLocalSave: new Date(),
    };
  }),

  reorderBlocks: (newOrder) => set((state) => {
    if (!state.proposal) return state;
    
    // Assuming newOrder is passed from the framer-motion Reorder group
    // which has visually sorted them. We just update their orderIndex to match their array index.
    const reorderedBlocks = newOrder.map((block, index) => ({
      ...block,
      orderIndex: index,
    }));

    return {
      proposal: {
        ...state.proposal,
        blocks: reorderedBlocks,
        updatedAt: new Date(),
      }
    };
  }),

  // ** Pricing Engine **
  addPricingItem: (item) => set((state) => {
    if (!state.proposal) return state;

    const newPricing = [...state.proposal.pricing, item];

    return {
      proposal: {
        ...state.proposal,
        pricing: newPricing,
        totalValue: calculateTotalValue(newPricing),
        updatedAt: new Date(),
      }
    };
  }),

  updatePricingItem: (id, updates) => set((state) => {
    if (!state.proposal) return state;

    const newPricing = state.proposal.pricing.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );

    return {
      proposal: {
        ...state.proposal,
        pricing: newPricing,
        totalValue: calculateTotalValue(newPricing),
        updatedAt: new Date(),
      }
    };
  }),

  removePricingItem: (id) => set((state) => {
    if (!state.proposal) return state;

    const newPricing = state.proposal.pricing.filter(item => item.id !== id);

    return {
      proposal: {
        ...state.proposal,
        pricing: newPricing,
        totalValue: calculateTotalValue(newPricing),
        updatedAt: new Date(),
      },
      lastLocalSave: new Date(),
    };
  }),

  fetchProposal: async (id: string) => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        set({ 
          proposal: {
            id: data.id,
            title: data.title,
            status: data.status,
            clientId: data.client_id,
            blocks: data.blocks,
            pricing: data.pricing,
            totalValue: data.total_value,
            viewCount: data.view_count || 0,
            companyName: data.company_name || 'Untitled Company',
            companyLogo: data.company_logo || null,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          },
          lastLocalSave: new Date()
        });
      }
    } catch (err) {
      console.error('Error fetching proposal:', err);
    }
  },

  fetchAllProposals: async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        const mappedProposals: Proposal[] = data.map(p => ({
            id: p.id,
            title: p.title,
            status: p.status,
            clientId: p.client_id,
            blocks: p.blocks,
            pricing: p.pricing,
            totalValue: p.total_value,
            viewCount: p.view_count || 0,
            companyName: p.company_name || 'Untitled Company',
            companyLogo: p.company_logo || null,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at),
        }));
        set({ proposals: mappedProposals });
      }
    } catch (err) {
      console.error('Error fetching all proposals:', err);
    }
  },
}),
    {
      name: 'jw-proposal-draft',
      storage: createJSONStorage(() => localStorage),
      // Only persist the proposal data, not transient UI state
      partialize: (state) => ({ proposal: state.proposal, lastLocalSave: state.lastLocalSave }),
    }
  )
);
