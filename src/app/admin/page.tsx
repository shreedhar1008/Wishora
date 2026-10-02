import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import AdminClientView from './AdminClientView';
import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isSupabase = isSupabaseConfigured();
  const adminEmail = process.env.ADMIN_EMAIL || 'shreedharshiragurr@gmail.com';
  let user: any = null;

  if (isSupabase) {
    try {
      const supabase = await getSupabaseServerClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Supabase offline
    }
  }

  if (!user) {
    const cookieStore = await cookies();
    const localUserCookie = cookieStore.get('wishora_user')?.value;
    if (localUserCookie) {
      try {
        user = JSON.parse(decodeURIComponent(localUserCookie));
      } catch {
        // invalid
      }
    }
  }

  if (user) {
    const isAuthorized =
      user.email === adminEmail ||
      user.email === 'shreedharshiragurr@gmail.com' ||
      user.id === 'admin_shreedhar';

    if (!isAuthorized) {
      redirect('/dashboard');
    }
  }
  
  // Real stats could be fetched from DB here. 
  // We'll pass some mock or aggregated data to the client view for now.
  const stats = {
    templatesCount: 16, // From templates definitions
    publishedTemplates: 16,
    totalWishesCount: 5,
    reportsCount: 0,
  };

  return (
    <AdminClientView 
      isSupabaseConfigured={isSupabase} 
      stats={stats} 
    />
  );
}
