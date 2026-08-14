import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDataAdapter } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { TEMPLATES } from '@/lib/templates/definitions';
import MyWishesClient from './MyWishesClient';

export const metadata: Metadata = {
  title: 'My Wishes | Wishora',
  description: 'Manage all your created wishes and view recipient replies.',
};

export const dynamic = 'force-dynamic';

export default async function MyWishesPage() {
  let userId = 'demo_user';

  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    } else {
      redirect('/login');
    }
  }

  const db = getDataAdapter();
  const rawWishes = await db.getWishesByOwner(userId);

  const wishesWithStats = await Promise.all(
    rawWishes.map(async (wish) => {
      const [stats, repliesList, reactionsList] = await Promise.all([
        db.getWishStats(wish.id),
        db.getReplies(wish.id),
        db.getReactions(wish.id),
      ]);

      const template = TEMPLATES.find(t => t.id === wish.templateId || t.slug === wish.templateSlug);

      return {
        ...wish,
        emoji: template?.emoji || '✨',
        views: stats.views,
        replies: repliesList,
        reactions: reactionsList,
      };
    })
  );

  return <MyWishesClient wishes={wishesWithStats} />;
}
