import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDataAdapter } from '@/lib/db';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase';
import { TEMPLATES } from '@/lib/templates/definitions';
import MyWishesClient from './MyWishesClient';

export const metadata: Metadata = {
  title: 'My Wishes | Wishora',
  description: 'Manage all your created wishes.',
};

export const dynamic = 'force-dynamic';

export default async function MyWishesPage() {
  let userId = 'demo_user';

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    } else {
      redirect('/login');
    }
  }

  const db = await getDataAdapter();
  const rawWishes = await db.getWishesByOwner(userId);

  const wishesWithStats = await Promise.all(
    rawWishes.map(async (wish) => {
      const stats = await db.getWishStats(wish.id);
      const template = TEMPLATES.find(t => t.id === wish.templateId || t.slug === wish.templateSlug);
      return {
        ...wish,
        emoji: template?.emoji || '✨',
        views: stats.views
      };
    })
  );

  return <MyWishesClient wishes={wishesWithStats} />;
}
