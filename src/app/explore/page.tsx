import { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, Badge, Input } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Explore | Wishora',
  description: 'Explore public wishes created by the Wishora community.',
};

export default function ExplorePage() {
  const sampleWishes = [
    { id: '1', token: 'demo-bday-1', emoji: '🎂', occasion: 'Birthday', recipient: 'Sarah', date: '2 days ago', title: 'Happy 30th Birthday!' },
    { id: '2', token: 'demo-anniv-1', emoji: '🥂', occasion: 'Anniversary', recipient: 'Michael', date: '1 week ago', title: 'Happy Anniversary my love' },
    { id: '3', token: 'demo-grad-1', emoji: '🎓', occasion: 'Graduation', recipient: 'Emily', date: '3 weeks ago', title: 'Congratulations on graduating!' },
    { id: '4', token: 'demo-thanks-1', emoji: '🙏', occasion: 'Thank You', recipient: 'David', date: '1 month ago', title: 'Thanks for everything' },
    { id: '5', token: 'demo-newbaby-1', emoji: '👶', occasion: 'New Baby', recipient: 'Jessica', date: '2 months ago', title: 'Welcome to the world' },
    { id: '6', token: 'demo-wedding-1', emoji: '💍', occasion: 'Wedding', recipient: 'Alex', date: '3 months ago', title: 'Happy Wedding Day' },
  ];

  return (
    <main className="min-h-screen bg-ivory pb-20 pt-32">
      <div className="max-w-6xl mx-auto px-6">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-plum mb-4">Explore Wishes</h1>
          <p className="text-lg text-charcoal-muted max-w-2xl mx-auto">
            Discover beautiful digital wishes created by the Wishora community.
          </p>
        </section>

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <Badge className="bg-plum text-white cursor-pointer px-4 py-2 text-sm rounded-full">All</Badge>
            <Badge className="bg-surface text-charcoal-muted hover:bg-surface-hover cursor-pointer px-4 py-2 text-sm rounded-full border border-border-light">Birthday</Badge>
            <Badge className="bg-surface text-charcoal-muted hover:bg-surface-hover cursor-pointer px-4 py-2 text-sm rounded-full border border-border-light">Anniversary</Badge>
            <Badge className="bg-surface text-charcoal-muted hover:bg-surface-hover cursor-pointer px-4 py-2 text-sm rounded-full border border-border-light">Thank You</Badge>
            <Badge className="bg-surface text-charcoal-muted hover:bg-surface-hover cursor-pointer px-4 py-2 text-sm rounded-full border border-border-light">Graduation</Badge>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select className="bg-surface border border-border-light text-charcoal text-sm rounded-xl focus:ring-plum focus:border-plum block w-full md:w-auto p-2.5 shadow-soft">
              <option>Most Recent</option>
              <option>Most Viewed</option>
              <option>Trending</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sampleWishes.map((wish) => (
            <Link href={`/w/${wish.token}`} key={wish.id} className="group">
              <Card className="h-full hover:shadow-elevated transition-shadow duration-300 border-none bg-surface overflow-hidden flex flex-col">
                <div className="h-32 bg-lavender flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                  {wish.emoji}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="default" className="bg-plum-50 text-plum font-semibold">
                      {wish.occasion}
                    </Badge>
                    <span className="text-xs text-charcoal-muted">{wish.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-1 line-clamp-1 group-hover:text-plum transition-colors">
                    {wish.title}
                  </h3>
                  <p className="text-sm text-charcoal-muted mt-auto pt-4">
                    For <span className="font-semibold text-charcoal">{wish.recipient}</span>
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Wishes
          </Button>
        </div>
      </div>
    </main>
  );
}
