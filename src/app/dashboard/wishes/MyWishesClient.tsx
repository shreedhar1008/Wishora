'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button, Tabs, EmptyState } from '@/components/ui';
import type { Wish, WishReply, WishReaction } from '@/types';

interface MyWishDisplayItem extends Wish {
  emoji?: string;
  views?: number;
  replies?: WishReply[];
  reactions?: WishReaction[];
}

export default function MyWishesClient({ wishes }: { wishes: MyWishDisplayItem[] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedWishForReplies, setSelectedWishForReplies] = useState<MyWishDisplayItem | null>(null);

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
        <p className="text-charcoal-muted mt-1">Manage your wishes and view replies and reactions from recipients.</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="w-full sm:w-auto inline-flex overflow-x-auto" />

      {filteredWishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishes.map((wish) => {
            const repliesCount = wish.replies?.length || 0;
            const reactionsCount = wish.reactions?.length || 0;

            return (
              <Card key={wish.id} className="p-5 border-none shadow-soft bg-surface flex flex-col group hover:shadow-elevated transition-shadow">
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
                <p className="text-sm text-charcoal-muted mb-3">For {wish.recipientName}</p>
                
                {/* Stats summary row */}
                <div className="flex items-center justify-between text-xs text-charcoal-muted mb-4 p-2.5 bg-surface-hover rounded-xl">
                  <span>👀 {wish.views || 0} views</span>
                  <button
                    onClick={() => setSelectedWishForReplies(wish)}
                    className="hover:text-plum font-medium transition-colors cursor-pointer"
                  >
                    💌 {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
                  </button>
                  <span>❤️ {reactionsCount} {reactionsCount === 1 ? 'reaction' : 'reactions'}</span>
                </div>

                <div className="mt-auto pt-3 border-t border-border-light flex flex-wrap items-center gap-2">
                  {wish.isPublished && (
                    <Link href={`/w/${wish.publicToken}`} className="flex-1 min-w-[70px]">
                      <Button variant="ghost" size="sm" className="w-full text-plum">View</Button>
                    </Link>
                  )}
                  {wish.isPublished && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWishForReplies(wish)}
                      className="flex-1 min-w-[100px] text-xs font-semibold text-plum"
                    >
                      💌 Replies ({repliesCount})
                    </Button>
                  )}
                  {wish.isPublished && (
                    <Link href={`/create/${wish.templateSlug || 'birthday-balloon-blast'}/share?token=${wish.publicToken}`} className="flex-1 min-w-[70px]">
                      <Button variant="ghost" size="sm" className="w-full text-coral hover:text-coral-dark hover:bg-coral/10">Share</Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
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

      {/* Recipient Replies Modal */}
      {selectedWishForReplies && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 shadow-elevated border border-border-light max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-border-light">
              <div>
                <h3 className="text-lg font-bold text-plum">
                  Replies & Feedback
                </h3>
                <p className="text-xs text-charcoal-muted">
                  For: {selectedWishForReplies.title || selectedWishForReplies.recipientName}
                </p>
              </div>
              <button
                onClick={() => setSelectedWishForReplies(null)}
                className="text-charcoal-muted hover:text-charcoal p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Replies List */}
            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {selectedWishForReplies.replies && selectedWishForReplies.replies.length > 0 ? (
                selectedWishForReplies.replies.map((reply) => (
                  <div key={reply.id} className="p-4 bg-lavender/30 rounded-2xl border border-lavender">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-sm text-charcoal">{reply.displayName}</span>
                      <span className="text-[11px] text-charcoal-muted">
                        {new Date(reply.createdAt).toLocaleDateString()} at {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                      {reply.body}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-charcoal-muted">
                  <span className="text-4xl block mb-2">📬</span>
                  <p className="text-sm font-medium">No replies for this wish yet</p>
                  <p className="text-xs mt-1">When {selectedWishForReplies.recipientName} writes a reply from their wish page, it will show up here!</p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-border-light flex justify-between items-center">
              <Link href={`/w/${selectedWishForReplies.publicToken}`} target="_blank">
                <span className="text-xs font-semibold text-plum hover:underline">
                  Open wish page ↗
                </span>
              </Link>
              <Button size="sm" onClick={() => setSelectedWishForReplies(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
