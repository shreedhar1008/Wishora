'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Tabs, EmptyState } from '@/components/ui';

export default function MyWishesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Wishes' },
    { id: 'published', label: 'Published' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'archived', label: 'Archived' },
  ];

  const wishes = [
    { id: '1', emoji: '🎂', title: 'Happy 30th Birthday!', recipient: 'Sarah', status: 'published', date: '2 days ago', views: 45 },
    { id: '2', emoji: '🎓', title: 'Graduation Congrats', recipient: 'Mike', status: 'draft', date: '1 week ago', views: 0 },
    { id: '3', emoji: '🥂', title: 'Happy Anniversary', recipient: 'Emily & John', status: 'published', date: '2 weeks ago', views: 112 },
    { id: '4', emoji: '👶', title: 'Welcome Baby!', recipient: 'Jessica', status: 'archived', date: '6 months ago', views: 89 },
  ];

  const filteredWishes = wishes.filter(wish => activeTab === 'all' || wish.status === activeTab);

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
                  {wish.emoji}
                </div>
                <Badge 
                  className={
                    wish.status === 'published' ? 'bg-emerald text-white' : 
                    wish.status === 'draft' ? 'bg-amber text-white' : 
                    'bg-surface-hover text-charcoal-muted'
                  }
                >
                  {wish.status.charAt(0).toUpperCase() + wish.status.slice(1)}
                </Badge>
              </div>
              
              <h3 className="text-lg font-bold text-charcoal mb-1 line-clamp-1">{wish.title}</h3>
              <p className="text-sm text-charcoal-muted mb-4">For {wish.recipient}</p>
              
              <div className="flex justify-between items-center text-xs text-charcoal-muted mb-4">
                <span>{wish.date}</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {wish.views}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-border-light flex justify-between gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="flex-1">Edit</Button>
                <Button variant="ghost" size="sm" className="flex-1 text-coral hover:text-coral-dark hover:bg-coral/10">Share</Button>
                <Button variant="ghost" size="sm" className="flex-1 text-red hover:text-red hover:bg-red/10">Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-surface border-none shadow-soft">
          <EmptyState
            icon={<div className="text-6xl">✨</div>}
            title={`No ${activeTab === 'all' ? '' : activeTab} wishes found`}
            description="You haven't created any wishes in this category yet."
            action={
              <Button className="mt-4" onClick={() => window.location.href = '/create'}>
                Create a Wish
              </Button>
            }
          />
        </Card>
      )}
    </div>
  );
}
