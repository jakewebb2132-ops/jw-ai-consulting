import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface LeadSummary {
  id: string;
  company: string | null;
  job_title: string | null;
  score: number;
  first_seen_at: string;
  last_seen_at: string;
  total_signals: number;
  channels: string[] | null;
  campaigns: string[] | null;
  last_page: string | null;
  in_outreach_queue: boolean | null;
}

interface CAPIState {
  leads: LeadSummary[];
  isLoading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
}

export const useCAPIStore = create<CAPIState>((set) => ({
  leads: [],
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('lead_activity_summary')
        .select('*');

      if (error) throw error;
      set({ leads: (data as LeadSummary[]) ?? [] });
    } catch (err: any) {
      console.error('Error fetching CAPI leads:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
