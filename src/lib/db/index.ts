import { DataAdapter } from './adapter';
import { DemoDataAdapter } from '../demo/data';

// Singleton instance of the demo adapter to maintain state
let demoAdapterInstance: DemoDataAdapter | null = null;

export function getDataAdapter(): DataAdapter {
  // In a real application, we would check for Supabase credentials:
  // if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  //   return new SupabaseAdapter();
  // }
  
  // For now, always return the demo adapter
  if (!demoAdapterInstance) {
    demoAdapterInstance = new DemoDataAdapter();
  }
  
  return demoAdapterInstance;
}
