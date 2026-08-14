import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// Environment helpers
// ─────────────────────────────────────────────

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return !!url && !!anonKey && !url.includes('placeholder') && !url.includes('your-project');
}

export function isSupabaseAdminConfigured(): boolean {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return isSupabaseConfigured() && !!serviceRoleKey && !serviceRoleKey.includes('placeholder');
}

// ─────────────────────────────────────────────
// Client Singletons / Factories
// ─────────────────────────────────────────────

let browserClientInstance: SupabaseClient | null = null;
let adminClientInstance: SupabaseClient | null = null;

/**
 * Browser client for Client Components.
 * Uses `@supabase/ssr` to manage cookies in the browser.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    const { url, anonKey } = getSupabaseConfig();
    return createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder');
  }

  if (browserClientInstance) {
    return browserClientInstance;
  }

  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    throw new Error('Supabase URL and Anon Key must be configured to create a browser client');
  }

  browserClientInstance = createBrowserClient(url, anonKey);
  return browserClientInstance;
}

/**
 * Service-role admin client for secure server tasks (bypasses RLS).
 * Only runs on the server.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  const { url } = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase URL and Service Role Key or Anon Key must be configured');
  }

  adminClientInstance = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClientInstance;
}
