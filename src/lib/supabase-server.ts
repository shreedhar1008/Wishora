import { createServerClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getSupabaseConfig, isSupabaseConfigured } from './supabase';

/**
 * Server client for Server Components, Server Actions, and Route Handlers.
 * Uses `@supabase/ssr` with async Next.js 16 cookies.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    throw new Error('Supabase URL and Anon Key must be configured to create a server client');
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Can happen in Server Components where setting cookies is read-only
        }
      },
    },
  });
}

export { isSupabaseConfigured };
