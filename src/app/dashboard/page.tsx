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

  const db = await getDataAdapter();
  
  // Fetch real data
  const dashboardStats = await db.getDashboardStats(userId);
  const wishes = await db.getWishesByOwner(userId);
  
  // Get top 3 recent wishes with their individual stats
  const recentWishes = await Promise.all(
    wishes.slice(0, 3).map(async (wish) => {
      const stats = await db.getWishStats(wish.id);
      const template = TEMPLATES.find(t => t.id === wish.templateId || t.slug === wish.templateSlug);
      return {
        ...wish,
        emoji: template?.emoji || '✨',
        views: stats.views
      };
    })
  );

  const stats = [
    { label: 'Total Wishes', value: dashboardStats.totalWishes.toString() },
    { label: 'Published', value: wishes.filter(w => w.isPublished).length.toString() },
    { label: 'Total Views', value: dashboardStats.totalViews.toString() },
    { label: 'Reactions', value: dashboardStats.totalReactions.toString() },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-plum">Welcome back, {userName}! 👋</h1>
          <p className="text-charcoal-muted mt-1">Here&apos;s what&apos;s happening with your wishes.</p>
        </div>
        <Link href="/create">
          <Button size="lg" className="w-full sm:w-auto">✨ Create New Wish</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 border-none shadow-soft bg-surface">
            <p className="text-sm font-medium text-charcoal-muted mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-plum">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
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
                <div className="flex justify-between items-center mt-auto pt-4 text-xs text-charcoal-muted">
                  <span>{new Date(wish.createdAt).toLocaleDateString()}</span>
                  {wish.status === 'published' && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {wish.views}
                    </span>
                  )}
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
