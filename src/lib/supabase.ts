import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// Environment helpers
// ─────────────────────────────────────────────

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  return key;
}

function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  return key;
}

// ─────────────────────────────────────────────
// Browser Client (for client components)
// ─────────────────────────────────────────────

let browserClient: SupabaseClient | null = null;

/**
 * Returns a Supabase client for use in browser / client components.
 * Uses the anon key and respects RLS policies.
 * Singleton — safe to call multiple times.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient(
    getSupabaseUrl(),
    getSupabaseAnonKey()
  );

  return browserClient;
}

// ─────────────────────────────────────────────
// Server Client (for API routes / Server Components)
// ─────────────────────────────────────────────

/**
 * Returns a Supabase client for server-side usage.
 * Uses the anon key — respects RLS and user sessions.
 * Create a new instance per request (no singleton for server).
 */
export function getSupabaseServerClient(): SupabaseClient {
  return createClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Returns a Supabase admin client with the service role key.
 * BYPASSES RLS — use only in trusted server-side contexts (API routes, webhooks).
 */
export function getSupabaseAdminClient(): SupabaseClient {
  return createClient(
    getSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
