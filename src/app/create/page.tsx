'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Card, Badge } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { TEMPLATES } from '@/lib/templates/definitions';

const OCCASIONS = [
  { slug: 'birthday', emoji: '🎂', label: 'Birthday' },
  { slug: 'anniversary', emoji: '💑', label: 'Anniversary' },
  { slug: 'wedding', emoji: '💒', label: 'Wedding' },
  { slug: 'love', emoji: '💕', label: 'Love' },
  { slug: 'congratulations', emoji: '🎉', label: 'Congrats' },
  { slug: 'thank-you', emoji: '🙏', label: 'Thank You' },
  { slug: 'friendship', emoji: '🤝', label: 'Friendship' },
  { slug: 'festival', emoji: '🎊', label: 'Festival' },
  { slug: 'mothers-day', emoji: '👩', label: "Mother's Day" },
  { slug: 'fathers-day', emoji: '👨', label: "Father's Day" },
  { slug: 'new-year', emoji: '🎆', label: 'New Year' },
  { slug: 'get-well-soon', emoji: '🌻', label: 'Get Well' },
];

function CreatePageContent() {
  const searchParams = useSearchParams();
  const preSelectedOccasion = searchParams?.get('occasion') || '';
  const [selectedOccasion, setSelectedOccasion] = React.useState(preSelectedOccasion);
  const { isAuthenticated, isLoading } = useAuth();

  const filteredTemplates = React.useMemo(() => {
    if (!selectedOccasion) return TEMPLATES.filter((t) => t.isPublished).slice(0, 12);
    const target = selectedOccasion.toLowerCase();

    return TEMPLATES.filter((t) => {
      if (!t.isPublished) return false;
      const occ = t.occasion.toLowerCase();
      if (occ === target) return true;
      if (t.tags && t.tags.some((tag) => tag.toLowerCase() === target)) return true;
      if (t.category && t.category.toLowerCase() === target) return true;

      // Handle aliases
      if (target === 'congratulations' && (occ === 'celebration' || t.tags.includes('congratulations'))) return true;
      if (target === 'celebration' && (occ === 'congratulations' || t.tags.includes('celebration'))) return true;
      if (target === 'love' && (occ === 'romance' || occ === 'love')) return true;
      if (target === 'mothers-day' && (t.slug.includes('mom') || t.tags.includes('mothers-day') || t.tags.includes('mom'))) return true;
      if (target === 'fathers-day' && (t.slug.includes('dad') || t.tags.includes('fathers-day') || t.tags.includes('dad'))) return true;
      if (target === 'new-year' && (occ === 'new-year' || t.slug.includes('new-year'))) return true;
      if (target === 'thank-you' && (occ === 'thank-you' || t.slug.startsWith('thank-you'))) return true;
      if (target === 'friendship' && (occ === 'friendship' || t.category === 'fun')) return true;

      return false;
    });
  }, [selectedOccasion]);

  const currentRedirect = selectedOccasion ? `/create?occasion=${selectedOccasion}` : '/create';

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-3">
            Create a Wish ✨
          </h1>
          <p className="text-lg text-charcoal-light">
            Choose an occasion, pick a template, and make it magical
          </p>
        </div>

        {/* Friendly tip if not authenticated */}
        {!isLoading && !isAuthenticated && (
          <div className="mb-10 p-5 bg-plum-50/60 border border-plum-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft animate-fade-in max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-sm font-semibold text-plum">Create as guest or sign in</p>
                <p className="text-xs text-charcoal-muted">You can customize and share any wish instantly! Sign in anytime to track views and manage replies.</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/login?redirect=${encodeURIComponent(currentRedirect)}`}>
                <Button size="sm" variant="outline">
                  Log in
                </Button>
              </Link>
              <Link href={`/signup?redirect=${encodeURIComponent(currentRedirect)}`}>
                <Button size="sm" variant="primary">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Step 1: Choose Occasion */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full gradient-plum text-white text-sm flex items-center justify-center font-bold">1</span>
            What&apos;s the occasion?
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {OCCASIONS.map((occ) => (
              <button
                key={occ.slug}
                onClick={() => setSelectedOccasion(selectedOccasion === occ.slug ? '' : occ.slug)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                  selectedOccasion === occ.slug
                    ? 'border-plum bg-plum-50 shadow-soft'
                    : 'border-border-light bg-surface hover:border-plum-200 hover:bg-plum-50/50'
                }`}
              >
                <span className="text-3xl block mb-2">{occ.emoji}</span>
                <span className="text-sm font-medium text-charcoal">{occ.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Choose Template */}
        <div>
          <h2 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full gradient-plum text-white text-sm flex items-center justify-center font-bold">2</span>
            Pick a template
          </h2>

          {filteredTemplates.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTemplates.map((tpl) => (
                <Link
                  key={tpl.id}
                  href={`/create/${tpl.slug}`}
                >
                  <Card hover padding="none" className="overflow-hidden group h-full">
                    <div
                      className="h-36 flex items-center justify-center relative"
                      style={{ background: tpl.previewGradient }}
                    >
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {tpl.emoji}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-charcoal mb-1 group-hover:text-plum transition-colors text-sm">
                        {tpl.title}
                      </h3>
                      <p className="text-xs text-charcoal-muted line-clamp-2">{tpl.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">🎨</span>
              <p className="text-charcoal-muted">No templates found for this occasion yet</p>
            </div>
          )}
        </div>

        {/* Browse all */}
        <div className="text-center mt-10">
          <Link href="/templates">
            <Button variant="ghost">Browse all templates →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">Loading...</div>}>
      <CreatePageContent />
    </React.Suspense>
  );
}
