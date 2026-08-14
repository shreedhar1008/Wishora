import { SupabaseClient } from '@supabase/supabase-js';
import { DataAdapter } from './adapter';
import { DemoDataAdapter } from '../demo/data';
import { SupabaseAdapter } from './supabase-adapter';
import { isSupabaseConfigured } from '../supabase';

// ─────────────────────────────────────────────
// Adapter Factory
// ─────────────────────────────────────────────
// Automatically returns the SupabaseAdapter when Supabase env vars are set,
// otherwise falls back to the in-memory DemoDataAdapter.

let demoAdapterInstance: DemoDataAdapter | null = null;
let supabaseAdapterInstance: SupabaseAdapter | null = null;

export function getDataAdapter(client?: SupabaseClient): DataAdapter {
  // Production mode: use Supabase
  if (isSupabaseConfigured()) {
    if (client) {
      return new SupabaseAdapter(client);
    }
    if (!supabaseAdapterInstance) {
      supabaseAdapterInstance = new SupabaseAdapter();
    }
    return supabaseAdapterInstance;
  }

  // Demo mode: use in-memory store
  if (!demoAdapterInstance) {
    demoAdapterInstance = new DemoDataAdapter();
  }
  return demoAdapterInstance;
}

/**
 * Returns true if the app is running in demo mode (no Supabase configured).
 */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}
