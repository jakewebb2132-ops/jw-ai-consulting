import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Setup the initial auth listener immediately upon store creation
  supabase.auth.getSession().then(({ data: { session } }) => {
    set({ session, user: session?.user ?? null, isInitialized: true });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    set({ session, user: session?.user ?? null, isInitialized: true });
  });

  return {
    session: null,
    user: null,
    isInitialized: false,
    setSession: (session) => set({ session }),
    setUser: (user) => set({ user }),
    signOut: async () => {
      await supabase.auth.signOut();
      set({ session: null, user: null });
    },
  };
});
