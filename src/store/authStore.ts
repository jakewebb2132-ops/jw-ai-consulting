import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isDeveloperSession: boolean;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setDeveloperSession: (isDev: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Check localStorage for an existing developer session on startup
  const savedDevSession = localStorage.getItem('jw-dev-session') === 'true';

  if (!isSupabaseConfigured) {
    // If Supabase is not configured, set initialized to true so the login page can be used
    setTimeout(() => {
      set({ isInitialized: true, isDeveloperSession: savedDevSession });
    }, 0);
  } else {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, isInitialized: true, isDeveloperSession: savedDevSession });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isInitialized: true });
    });
  }

  return {
    session: null,
    user: null,
    isDeveloperSession: false,
    isInitialized: false,
    setSession: (session) => set({ session }),
    setUser: (user) => set({ user }),
    setDeveloperSession: (isDev) => {
      localStorage.setItem('jw-dev-session', isDev.toString());
      set({ isDeveloperSession: isDev });
    },
    signOut: async () => {
      localStorage.removeItem('jw-dev-session');
      await supabase.auth.signOut();
      set({ session: null, user: null, isDeveloperSession: false });
    },
  };
});
