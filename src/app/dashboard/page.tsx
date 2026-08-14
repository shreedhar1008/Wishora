import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button, Card, Badge } from '@/components/ui';
import { getDataAdapter } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { TEMPLATES } from '@/lib/templates/definitions';

export const metadata: Metadata = {
  title: 'Dashboard | Wishora',
  description: 'Manage your wishes and account.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let userId = 'demo_user';
  let userName = 'Creator';

  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Creator';
    } else {
      redirect('/login');
    }
  }

  const db = getDataAdapter();
  
  // Fetch real data
  const dashboardStats = await db.getDashboardStats(userId);
  const wishes = await db.getWishesByOwner(userId);
  
  // Get recent wishes with their individual stats & replies
  const recentWishes = await Promise.all(
    wishes.slice(0, 3).map(async (wish) => {
      const stats = await db.getWishStats(wish.id);
      const template = TEMPLATES.find(t => t.id === wish.templateId || t.slug === wish.templateSlug);
      return {
        ...wish,
        emoji: template?.emoji || '✨',
        views: stats.views,
        reactionsCount: stats.reactions,
        repliesCount: stats.replies,
      };
    })
  );

  // Fetch all recent replies across all user's wishes
  const recentReplies = (
    await Promise.all(
      wishes.map(async (wish) => {
        const reps = await db.getReplies(wish.id);
        return reps.map((r) => ({
          ...r,
          wishTitle: wish.title || `Wish for ${wish.recipientName}`,
          recipientName: wish.recipientName,
          publicToken: wish.publicToken,
        }));
      })
    )
  )
    .flat()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    { label: 'Total Wishes', value: dashboardStats.totalWishes.toString(), emoji: '🪄' },
    { label: 'Total Views', value: dashboardStats.totalViews.toString(), emoji: '👀' },
    { label: 'Reactions', value: dashboardStats.totalReactions.toString(), emoji: '❤️' },
    { label: 'Replies', value: dashboardStats.totalReplies.toString(), emoji: '💌' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-plum">Welcome back, {userName}! 👋</h1>
          <p className="text-charcoal-muted mt-1">Here&apos;s what&apos;s happening with your wishes and replies.</p>
        </div>
        <Link href="/create">
          <Button size="lg" className="w-full sm:w-auto">✨ Create New Wish</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 border-none shadow-soft bg-surface">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-charcoal-muted">{stat.label}</p>
              <span className="text-xl">{stat.emoji}</span>
            </div>
            <p className="text-3xl font-bold text-plum">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Recipient Replies Feed */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💌</span>
            <h2 className="text-xl font-bold text-charcoal">Recipient Replies</h2>
          </div>
          <Link href="/dashboard/wishes" className="text-sm font-medium text-coral hover:text-coral-dark">
            Manage Wishes →
          </Link>
        </div>

        {recentReplies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {recentReplies.map((reply) => (
              <Card key={reply.id} className="p-5 border-none shadow-soft bg-surface flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-charcoal text-sm">{reply.displayName}</span>
                      <span className="text-xs text-charcoal-muted block">
                        Replied to &quot;{reply.wishTitle}&quot;
                      </span>
                    </div>
                    <Badge variant="gold">💌 New Reply</Badge>
                  </div>
                  <p className="text-sm text-charcoal/90 mt-3 p-3 bg-lavender/40 rounded-xl leading-relaxed italic">
                    &quot;{reply.body}&quot;
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-border-light text-xs text-charcoal-muted">
                  <span>{new Date(reply.createdAt).toLocaleString()}</span>
                  <Link href={`/w/${reply.publicToken}`} className="text-plum font-semibold hover:underline">
                    View Wish →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center bg-surface border-none shadow-soft mb-8">
            <p className="text-sm text-charcoal-muted">
              No replies yet! When recipients open your wish link and write a reply, their messages will appear here instantly.
            </p>
          </Card>
        )}
      </div>

      {/* Recent Wishes List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-charcoal">Recent Wishes</h2>
          <Link href="/dashboard/wishes" className="text-sm font-medium text-coral hover:text-coral-dark">
            View all →
          </Link>
        </div>

        {recentWishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentWishes.map((wish) => (
              <Card key={wish.id} className="p-5 border-none shadow-soft bg-surface hover:shadow-elevated transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-lavender rounded-xl flex items-center justify-center text-2xl">
                    {wish.emoji}
                  </div>
                  <Badge variant="default" className={wish.status === 'published' ? 'bg-emerald text-white' : 'bg-surface-hover text-charcoal-muted'}>
                    {wish.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-1 line-clamp-1">{wish.title || wish.recipientName}</h3>
                <p className="text-xs text-charcoal-muted mb-4">For {wish.recipientName}</p>

                <div className="flex items-center gap-3 text-xs text-charcoal-muted mt-auto pt-4 border-t border-border-light">
                  <span>👀 {wish.views || 0} views</span>
                  <span>❤️ {wish.reactionsCount || 0}</span>
                  <span>💌 {wish.repliesCount || 0}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed">
            <div className="text-4xl mb-4">🪄</div>
            <h3 className="text-lg font-medium text-charcoal mb-2">No wishes yet</h3>
            <p className="text-charcoal-muted mb-6">Create your first wish to start sharing the magic.</p>
            <Link href="/create">
              <Button>Create your first wish</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
