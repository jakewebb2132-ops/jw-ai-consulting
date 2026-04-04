import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface VisitorLead {
  id: string;
  visitor_id: string;
  full_name: string;
  job_title: string;
  company_name: string;
  company_domain: string;
  linkedin_url: string;
  profile_image_url: string;
  ip_address: string;
  last_page_viewed: string;
  visit_count: number;
  intent_score: number;
  last_seen: string;
  created_at: string;
}

interface VisitorState {
  leads: VisitorLead[];
  isLoading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  subscribeToLeads: () => () => void;
}

export const useVisitorStore = create<VisitorState>((set) => ({
  leads: [],
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('visitor_leads')
        .select('*')
        .order('last_seen', { ascending: false });
      
      if (error) throw error;
      if (data) {
        set({ leads: data as VisitorLead[] });
      }
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  subscribeToLeads: () => {
    const channel = supabase
      .channel('public:visitor_leads')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'visitor_leads' 
      }, () => {
        // Simple strategy: refetch on any change
        useVisitorStore.getState().fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}));
