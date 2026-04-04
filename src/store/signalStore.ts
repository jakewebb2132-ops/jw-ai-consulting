import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface LinkedInSignal {
  id: string;
  type: 'profile_view' | 'post_interaction';
  person_name: string;
  person_title: string;
  person_company: string;
  person_image: string;
  interaction_text: string;
  linkedin_url: string;
  timestamp: string;
  created_at: string;
}

interface SignalState {
  signals: LinkedInSignal[];
  isLoading: boolean;
  error: string | null;
  fetchSignals: () => Promise<void>;
  subscribeToSignals: () => () => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  isLoading: false,
  error: null,

  fetchSignals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      if (data) {
        set({ signals: data as LinkedInSignal[] });
      }
    } catch (err: any) {
      console.error('Error fetching signals:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  subscribeToSignals: () => {
    const channel = supabase
      .channel('public:signals')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'signals' 
      }, (payload) => {
        const newSignal = payload.new as LinkedInSignal;
        set((state) => ({
          signals: [newSignal, ...state.signals].slice(0, 50)
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}));
