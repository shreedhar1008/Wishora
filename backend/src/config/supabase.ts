import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  const url = ENV.SUPABASE_URL;
  // Use service role key if available for full server access, otherwise anon key
  const key = ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('⚠️ Supabase credentials missing in backend environment variables.');
  }

  supabaseClient = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(ENV.SUPABASE_URL && (ENV.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_ANON_KEY));
}
