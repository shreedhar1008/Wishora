'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Card, Badge } from '@/components/ui';
import { TEMPLATES } from '@/lib/templates/definitions';

const OCCASIONS = [
  { slug: 'birthday', emoji: '🎂', label: 'Birthday' },
  { slug: 'anniversary', emoji: '💑', label: 'Anniversary' },
  { slug: 'wedding', emoji: '💒', label: 'Wedding' },
  { slug: 'love', emoji: '💕', label: 'Love' },
  { slug: 'friendship', emoji: '🤝', label: 'Friendship' },
  { slug: 'congratulations', emoji: '🎉', label: 'Congratulations' },
  { slug: 'thank-you', emoji: '🙏', label: 'Thank You' },
  { slug: 'festival', emoji: '🎊', label: 'Festival' },
  { slug: 'other', emoji: '✨', label: 'Other' },
];

function CreatePageContent() {
  const searchParams = useSearchParams();
  const preSelectedOccasion = searchParams?.get('occasion') || '';
  const [selectedOccasion, setSelectedOccasion] = React.useState(preSelectedOccasion);

  const filteredTemplates = React.useMemo(() => {
    if (!selectedOccasion) return TEMPLATES.filter((t) => t.isPublished).slice(0, 12);
    return TEMPLATES.filter((t) => t.isPublished && t.occasion === selectedOccasion);
  }, [selectedOccasion]);

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
          <Badge variant="gold" className="mt-4">No signup required</Badge>
        </div>

        {/* Step 1: Choose Occasion */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-charcoal mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full gradient-plum text-white text-sm flex items-center justify-center font-bold">1</span>
            What&apos;s the occasion?
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
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
                <Link key={tpl.id} href={`/create/${tpl.slug}`}>
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
