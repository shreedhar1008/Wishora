import React from 'react';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { getDataAdapter } from '@/lib/db';
import AdminClientView from './AdminClientView';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isSupabase = isSupabaseConfigured();
  
  if (isSupabase) {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Safety check - middleware should have caught this
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      redirect('/dashboard');
    }
  }

  const db = await getDataAdapter();
  
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
