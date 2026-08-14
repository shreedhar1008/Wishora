'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, Badge } from '@/components/ui';

interface ExploreWishItem {
  id: string;
  token: string;
  emoji: string;
  occasion: string;
  recipient: string;
  date: string;
  title: string;
}

const DEFAULT_SAMPLE_WISHES: ExploreWishItem[] = [
  { id: '1', token: 'demo-emma-bday', emoji: '🎂', occasion: 'Birthday', recipient: 'Emma', date: '2 days ago', title: 'Happy Birthday Emma!' },
  { id: '2', token: 'demo-aarav-maya', emoji: '💑', occasion: 'Anniversary', recipient: 'Aarav & Maya', date: '5 days ago', title: 'Happy Anniversary my love' },
  { id: '3', token: 'demo-dan-success', emoji: '🎉', occasion: 'Congratulations', recipient: 'Daniel', date: '1 week ago', title: 'Way to go, Daniel!' },
  { id: '4', token: 'demo-mom-thanks', emoji: '🌸', occasion: 'Thank You', recipient: 'Mom', date: '12 hours ago', title: 'To the best Mom ever' },
  { id: '5', token: 'demo-diwali-2026', emoji: '🪔', occasion: 'Festival', recipient: 'Family', date: '2 days ago', title: 'Happy Diwali!' },
  { id: '6', token: 'demo-emma-bday', emoji: '🎈', occasion: 'Birthday', recipient: 'Sarah', date: '3 days ago', title: 'Happy 30th Birthday!' },
];

const CATEGORIES = [
  'All', 
  'Birthday', 
  'Anniversary', 
  'Wedding', 
  'Love', 
  'Congratulations', 
  'Thank You', 
  'Friendship', 
  'Festival', 
];

export default function ExploreClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [wishesList, setWishesList] = useState<ExploreWishItem[]>(DEFAULT_SAMPLE_WISHES);

  useEffect(() => {
    fetch('/api/wishes?limit=20')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.wishes) && data.wishes.length > 0) {
          const fetchedItems: ExploreWishItem[] = data.wishes.map((w: { id?: string; publicToken: string; occasion?: string; recipientName?: string; title?: string }) => ({
            id: w.id || w.publicToken,
            token: w.publicToken,
            emoji: '✨',
            occasion: (w.occasion ? w.occasion.charAt(0).toUpperCase() + w.occasion.slice(1) : 'Special'),
            recipient: w.recipientName || 'Special Someone',
            date: 'Recent',
            title: w.title || `Wish for ${w.recipientName || 'You'}`,
          }));

          // Merge fetched wishes with samples
          const merged = [...fetchedItems, ...DEFAULT_SAMPLE_WISHES];
          // Remove duplicates by token
          const unique = merged.filter((item, index, self) => 
            index === self.findIndex((t) => t.token === item.token)
          );
          setWishesList(unique);
        }
      })
      .catch(() => {
        // Fallback to default sample wishes
      });
  }, []);

  const filteredWishes = wishesList.filter((wish) => {
    if (activeCategory === 'All') return true;
    return wish.occasion.toLowerCase() === activeCategory.toLowerCase();
  });

  const visibleWishes = filteredWishes.slice(0, visibleCount);
  const hasMore = visibleWishes.length < filteredWishes.length;

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(6);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

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
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`cursor-pointer px-4 py-2 text-sm rounded-full whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-plum text-white border border-plum'
                    : 'bg-surface text-charcoal-muted hover:bg-surface-hover border border-border-light'
                }`}
              >
                {cat}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select className="bg-surface border border-border-light text-charcoal text-sm rounded-xl focus:ring-plum focus:border-plum block w-full md:w-auto p-2.5 shadow-soft">
              <option>Most Recent</option>
              <option>Most Viewed</option>
              <option>Trending</option>
            </select>
          </div>
        </div>

        {visibleWishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {visibleWishes.map((wish) => (
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
        ) : (
          <div className="text-center py-20">
            <span className="text-4xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-charcoal mb-2">No wishes found</h3>
            <p className="text-charcoal-muted">There are currently no public wishes in the {activeCategory} category.</p>
          </div>
        )}

        {hasMore && (
          <div className="text-center">
            <Button variant="outline" size="lg" onClick={handleLoadMore}>
              Load More Wishes
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
