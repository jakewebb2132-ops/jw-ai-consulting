import { create } from 'zustand';

export interface BoardroomInteraction {
  id: string;
  created_at: string;
  question: string;
  mode: string;
  advisors: string[];
  visitor_id?: string;
}

interface InteractionState {
  interactions: BoardroomInteraction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchInteractions: () => Promise<void>;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  interactions: [],
  isLoading: false,
  error: null,

  fetchInteractions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('boardroom_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      if (data) {
        set({ interactions: data as BoardroomInteraction[] });
      }
    } catch (err: any) {
      console.error('Error fetching interactions:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
