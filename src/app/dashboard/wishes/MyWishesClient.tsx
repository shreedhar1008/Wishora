'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button, Tabs, EmptyState } from '@/components/ui';
import type { Wish } from '@/types';

interface MyWishDisplayItem extends Wish {
  emoji?: string;
  views?: number;
}

export default function MyWishesClient({ wishes }: { wishes: MyWishDisplayItem[] }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Wishes' },
    { id: 'published', label: 'Published' },
    { id: 'drafts', label: 'Drafts' },
  ];

  const filteredWishes = wishes.filter(wish => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published' && wish.isPublished) return true;
    if (activeTab === 'drafts' && !wish.isPublished) return true;
    return false;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-plum">My Wishes</h1>
        <p className="text-charcoal-muted mt-1">Manage all your created wishes here.</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="w-full sm:w-auto inline-flex overflow-x-auto" />

      {filteredWishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishes.map((wish) => (
            <Card key={wish.id} className="p-5 border-none shadow-soft bg-surface flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-lavender rounded-xl flex items-center justify-center text-2xl">
                  {wish.emoji || '✨'}
                </div>
                <Badge 
                  className={
                    wish.isPublished ? 'bg-emerald text-white' : 'bg-amber text-white'
                  }
                >
                  {wish.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
              
              <h3 className="text-lg font-bold text-charcoal mb-1 line-clamp-1">{wish.title || wish.recipientName}</h3>
              <p className="text-sm text-charcoal-muted mb-4">For {wish.recipientName}</p>
              
              <div className="flex justify-between items-center text-xs text-charcoal-muted mb-4">
                <span>{new Date(wish.createdAt).toLocaleDateString()}</span>
                {wish.isPublished && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {wish.views || 0}
                  </span>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-border-light flex justify-between gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {wish.isPublished && (
                  <Link href={`/w/${wish.publicToken}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full text-plum">View</Button>
                  </Link>
                )}
                {wish.isPublished && (
                  <Link href={`/create/${wish.templateSlug || 'birthday-balloon-blast'}/share?token=${wish.publicToken}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full text-coral hover:text-coral-dark hover:bg-coral/10">Share</Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-surface border-none shadow-soft">
          <EmptyState
            icon={<div className="text-6xl">✨</div>}
            title={`No ${activeTab === 'all' ? '' : activeTab} wishes found`}
            description="You haven&apos;t created any wishes in this category yet."
            action={
              <Link href="/create" passHref>
                <Button className="mt-4">Create a Wish</Button>
              </Link>
            }
          />
        </Card>
      )}
    </div>
  );
}
