import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import AdminClientView from './AdminClientView';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isSupabase = isSupabaseConfigured();
  
  if (isSupabase) {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Safety check - middleware should have caught this
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      redirect('/dashboard');
    }
  }
  
  // Real stats could be fetched from DB here. 
  // We'll pass some mock or aggregated data to the client view for now.
  const stats = {
    templatesCount: 16, // From templates definitions
    publishedTemplates: 16,
    demoWishesCount: 5, // We could run a query to count all wishes if we had it
    reportsCount: 0,
  };

  return (
    <AdminClientView 
      isSupabaseConfigured={isSupabase} 
      stats={stats} 
    />
  );
}
