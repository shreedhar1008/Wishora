import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
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
  let user: any = null;

  if (isSupabaseConfigured()) {
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
        // invalid cookie
      }
    }
  }

  if (!user) {
    redirect('/login?redirect=/dashboard/wishes');
  }

  const userId = user.id;
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
