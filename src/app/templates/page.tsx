'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Card, Badge, Input } from '@/components/ui';
import { TEMPLATES } from '@/lib/templates/definitions';
import type { Template } from '@/types';

const OCCASION_FILTERS: { value: string; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '✨' },
  { value: 'birthday', label: 'Birthday', emoji: '🎂' },
  { value: 'anniversary', label: 'Anniversary', emoji: '💑' },
  { value: 'wedding', label: 'Wedding', emoji: '💒' },
  { value: 'love', label: 'Love', emoji: '💕' },
  { value: 'congratulations', label: 'Congrats', emoji: '🎉' },
  { value: 'thank-you', label: 'Thank You', emoji: '🙏' },
  { value: 'friendship', label: 'Friendship', emoji: '🤝' },
  { value: 'festival', label: 'Festival', emoji: '🎊' },
  { value: 'mothers-day', label: "Mother's Day", emoji: '👩' },
  { value: 'fathers-day', label: "Father's Day", emoji: '👨' },
  { value: 'new-year', label: 'New Year', emoji: '🎆' },
  { value: 'get-well-soon', label: 'Get Well', emoji: '🌻' },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'A-Z' },
];

function TemplatesPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState('');
  const [activeOccasion, setActiveOccasion] = React.useState(searchParams?.get('occasion') || 'all');
  const [sortBy, setSortBy] = React.useState('popular');

  const filteredTemplates = React.useMemo(() => {
    let result = [...TEMPLATES].filter((t) => t.isPublished);

    if (activeOccasion !== 'all') {
      const target = activeOccasion.toLowerCase();
      result = result.filter((t) => {
        const occ = t.occasion.toLowerCase();
        if (occ === target) return true;
        if (t.tags && t.tags.some((tag) => tag.toLowerCase() === target)) return true;
        if (t.category && t.category.toLowerCase() === target) return true;

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
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [activeOccasion, search, sortBy]);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="bg-gradient-to-b from-plum-50 to-ivory py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-4">
            Template Gallery
          </h1>
          <p className="text-lg text-charcoal-light max-w-2xl mx-auto mb-8">
            Browse 30+ beautiful templates for every occasion. Each one is customizable and interactive.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-center"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {OCCASION_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveOccasion(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeOccasion === filter.value
                    ? 'bg-plum text-white shadow-soft'
                    : 'bg-surface text-charcoal-light hover:bg-plum-50 border border-border-light'
                }`}
              >
                <span className="mr-1.5">{filter.emoji}</span>
                {filter.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-charcoal"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-charcoal-muted mb-6">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
        </p>

        {/* Template Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-lg font-semibold text-charcoal mb-2">No templates found</h3>
            <p className="text-charcoal-muted mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => { setSearch(''); setActiveOccasion('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <Link href={`/create/${template.slug}`}>
      <Card hover padding="none" className="overflow-hidden group h-full">
        {/* Preview */}
        <div
          className="h-44 flex items-center justify-center relative"
          style={{ background: template.previewGradient }}
        >
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {template.emoji}
          </span>
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="default">{template.occasion}</Badge>
          </div>
          {template.isPremium && (
            <Badge variant="gold" className="absolute top-3 right-3">Premium</Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-semibold text-charcoal mb-1.5 group-hover:text-plum transition-colors">
            {template.title}
          </h3>
          <p className="text-sm text-charcoal-muted line-clamp-2 mb-3">{template.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {template.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-charcoal-muted bg-ivory px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-plum font-medium">Use →</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function TemplatesPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">Loading...</div>}>
      <TemplatesPageContent />
    </React.Suspense>
  );
}
