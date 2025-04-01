import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  organization_id: string;
  full_name: string;
  role: 'admin' | 'member';
  created_at: string;
};

export type Organization = {
  id: string;
  name: string;
  plan: string;
  created_at: string;
};