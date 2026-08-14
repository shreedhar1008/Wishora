'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, Badge } from '@/components/ui';

const SAMPLE_WISHES = [
  { id: '1', token: 'demo-bday-1', emoji: '🎂', occasion: 'Birthday', recipient: 'Sarah', date: '2 days ago', title: 'Happy 30th Birthday!' },
  { id: '2', token: 'demo-anniv-1', emoji: '🥂', occasion: 'Anniversary', recipient: 'Michael', date: '1 week ago', title: 'Happy Anniversary my love' },
  { id: '3', token: 'demo-grad-1', emoji: '🎓', occasion: 'Graduation', recipient: 'Emily', date: '3 weeks ago', title: 'Congratulations on graduating!' },
  { id: '4', token: 'demo-thanks-1', emoji: '🙏', occasion: 'Thank You', recipient: 'David', date: '1 month ago', title: 'Thanks for everything' },
  { id: '5', token: 'demo-newbaby-1', emoji: '👶', occasion: 'New Baby', recipient: 'Jessica', date: '2 months ago', title: 'Welcome to the world' },
  { id: '6', token: 'demo-wedding-1', emoji: '💍', occasion: 'Wedding', recipient: 'Alex', date: '3 months ago', title: 'Happy Wedding Day' },
  { id: '7', token: 'demo-bday-2', emoji: '🎈', occasion: 'Birthday', recipient: 'John', date: '4 months ago', title: 'A special birthday wish' },
  { id: '8', token: 'demo-thanks-2', emoji: '💌', occasion: 'Thank You', recipient: 'Mom & Dad', date: '5 months ago', title: 'For all your support' },
  { id: '9', token: 'demo-anniv-2', emoji: '❤️', occasion: 'Anniversary', recipient: 'Priya', date: '6 months ago', title: '10 beautiful years' },
  { id: '10', token: 'demo-love-1', emoji: '💖', occasion: 'Love', recipient: 'Chris', date: '1 day ago', title: 'Just thinking of you' },
  { id: '11', token: 'demo-congrats-1', emoji: '🎉', occasion: 'Congrats', recipient: 'Amanda', date: '4 days ago', title: 'So proud of your new job!' },
  { id: '12', token: 'demo-friend-1', emoji: '🤝', occasion: 'Friendship', recipient: 'Mark', date: '1 week ago', title: 'Best friends forever' },
  { id: '13', token: 'demo-festival-1', emoji: '🎇', occasion: 'Festival', recipient: 'Family', date: '2 weeks ago', title: 'Happy Diwali everyone!' },
  { id: '14', token: 'demo-mothersday-1', emoji: '🌸', occasion: 'Mother\'s Day', recipient: 'Mom', date: '3 months ago', title: 'To the best mom' },
  { id: '15', token: 'demo-fathersday-1', emoji: '👔', occasion: 'Father\'s Day', recipient: 'Dad', date: '2 months ago', title: 'Happy Father\'s Day!' },
  { id: '16', token: 'demo-newyear-1', emoji: '🎆', occasion: 'New Year', recipient: 'Everyone', date: '8 months ago', title: 'Happy New Year 2026!' },
  { id: '17', token: 'demo-getwell-1', emoji: '🌻', occasion: 'Get Well', recipient: 'Sam', date: '5 days ago', title: 'Wishing you a speedy recovery' },
];

const CATEGORIES = [
  'All', 
  'Birthday', 
  'Anniversary', 
  'Wedding', 
  'Love', 
  'Congrats', 
  'Thank You', 
  'Friendship', 
  'Festival', 
  'Mother\'s Day', 
  'Father\'s Day', 
  'New Year', 
  'Get Well'
];
export default function ExploreClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredWishes = SAMPLE_WISHES.filter((wish) => {
    if (activeCategory === 'All') return true;
    return wish.occasion === activeCategory;
  });

  const visibleWishes = filteredWishes.slice(0, visibleCount);
  const hasMore = visibleWishes.length < filteredWishes.length;

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(6); // Reset visible count when changing categories
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
