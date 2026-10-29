import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../env.js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  if (env.SUPABASE_URL && (env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY)) {
    const key = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY!;
    supabaseClient = createClient(env.SUPABASE_URL, key, {
      auth: { persistSession: false },
    });
    return supabaseClient;
  }

  return null;
}

export const isSupabaseConfigured = (): boolean => getSupabase() !== null;
