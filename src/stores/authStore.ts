import { create } from 'zustand';
import { supabase, type Profile, type Organization } from '../lib/supabase';

interface AuthState {
  isLoading: boolean;
  profile: Profile | null;
  organization: Organization | null;
  setProfile: (profile: Profile | null) => void;
  setOrganization: (org: Organization | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, orgName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: true,
  profile: null,
  organization: null,

  setProfile: (profile) => set({ profile }),
  setOrganization: (organization) => set({ organization }),

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await get().loadUserData();
  },

  signUp: async (email: string, password: string, fullName: string, orgName: string) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw signUpError;

    const user = authData.user;
    if (!user) throw new Error('No user returned from sign up');

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: orgName, plan: 'free' })
      .select()
      .single();
    
    if (orgError) throw orgError;

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        organization_id: org.id,
        full_name: fullName,
        role: 'admin'
      });

    if (profileError) throw profileError;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ profile: null, organization: null });
  },

  loadUserData: async () => {
    try {
      set({ isLoading: true });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ profile: null, organization: null, isLoading: false });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        set({ profile });

        const { data: org } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .single();

        if (org) {
          set({ organization: org });
        }
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    useAuthStore.getState().loadUserData();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ profile: null, organization: null });
  }
});