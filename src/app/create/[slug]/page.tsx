'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea, Card, Badge } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { TEMPLATES } from '@/lib/templates/definitions';

const composeSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  senderName: z.string().optional(),
  title: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  isPublic: z.boolean(),
  allowReactions: z.boolean(),
  allowReplies: z.boolean(),
});

type ComposeValues = z.infer<typeof composeSchema>;

const TONES = [
  { value: 'heartfelt', label: '💖 Heartfelt', desc: 'Warm & meaningful' },
  { value: 'funny', label: '😂 Humorous', desc: 'Fun & lighthearted' },
  { value: 'romantic', label: '🌹 Romantic', desc: 'Loving & sweet' },
  { value: 'poetic', label: '✨ Poetic', desc: 'Lyrical & dreamy' },
  { value: 'short', label: '⚡ Short & Sweet', desc: 'Crisp & catchy' },
  { value: 'inspirational', label: '🌟 Inspiring', desc: 'Uplifting & bold' },
];

const RELATIONSHIPS = [
  'Best Friend',
  'Partner / Spouse',
  'Family Member',
  'Mom',
  'Dad',
  'Sibling',
  'Colleague',
  'Friend',
];

export default function CreateSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  const template = useMemo(() => TEMPLATES.find((t) => t.slug === slug), [slug]);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // AI Generator state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTone, setAiTone] = useState<'heartfelt' | 'funny' | 'poetic' | 'short' | 'romantic' | 'inspirational'>('heartfelt');
  const [aiRelationship, setAiRelationship] = useState('Best Friend');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ComposeValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      message: template?.defaultMessage || '',
      isPublic: false,
      allowReactions: true,
      allowReplies: true,
    }
  });

  const recipientNameValue = watch('recipientName');
  const senderNameValue = watch('senderName');

  if (!template) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-6xl mb-6">😢</div>
        <h2 className="text-3xl font-bold tracking-tight text-charcoal mb-4">Template not found</h2>
        <p className="text-charcoal-muted mb-8">The template you are looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.push('/create')}>Browse Templates</Button>
      </div>
    );
  }

  if (!isAuthLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-md w-full bg-surface p-8 rounded-3xl shadow-elevated border border-border-light text-center animate-fade-in">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Sign in to customize wish</h2>
          <p className="text-sm text-charcoal-muted mb-6">
            Please log in or create a free account to compose, customize, and publish your wish using the <span className="font-semibold text-plum">{template.title}</span> template.
          </p>
          <div className="space-y-3">
            <Link href={`/login?redirect=${encodeURIComponent(`/create/${slug}`)}`} className="w-full block">
              <Button size="lg" className="w-full">Log In to Continue</Button>
            </Link>
            <Link href={`/signup?redirect=${encodeURIComponent(`/create/${slug}`)}`} className="w-full block">
              <Button size="lg" variant="outline" className="w-full">Create Free Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateAiMessage = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: recipientNameValue || 'Friend',
          senderName: senderNameValue,
          occasion: template.occasion,
          relationship: aiRelationship,
          tone: aiTone,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate with AI');
      const data = await res.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        setAiSuggestions(data.suggestions);
      }
    } catch {
      // Fallback local generator if network fails
      const name = recipientNameValue || 'Friend';
      const fallback = `Happy ${template.occasion}, ${name}! Wishing you endless happiness, joy, and wonderful moments. ✨`;
      setAiSuggestions([fallback]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const applyAiSuggestion = (msg: string) => {
    setValue('message', msg, { shouldValidate: true });
    setShowAiModal(false);
  };

  const onSubmit = async (data: ComposeValues) => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        templateId: template.id,
        templateSlug: template.slug,
        occasion: template.occasion,
        recipientName: data.recipientName,
        senderName: data.senderName,
        title: data.title,
        message: data.message,
        isPublic: data.isPublic,
        isPublished: true,
        settings: {
          allowReactions: data.allowReactions,
          allowReplies: data.allowReplies,
        }
      };

      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create wish');
      }

      const createdWish = await res.json();

      // Cache locally for guest resilience & instant viewing
      try {
        const stored = JSON.parse(localStorage.getItem('wishora-published-wishes') || '[]');
        stored.unshift(createdWish);
        localStorage.setItem('wishora-published-wishes', JSON.stringify(stored.slice(0, 20)));
      } catch {
        // localStorage not available
      }

      router.push(`/create/${template.slug}/share?token=${createdWish.publicToken}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Compose your Wish</h1>
          <p className="text-charcoal-muted">Customizing: <span className="font-semibold text-plum">{template.title} {template.emoji}</span></p>
        </div>

        <Card className="p-8 border-none shadow-elevated">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Who is this for? *</label>
                <Input
                  {...register('recipientName')}
                  placeholder="Recipient's Name (e.g. Emma)"
                  error={errors.recipientName?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Who is it from?</label>
                <Input
                  {...register('senderName')}
                  placeholder="Your Name (Optional)"
                  error={errors.senderName?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Title (Optional)</label>
              <Input
                {...register('title')}
                placeholder="e.g. Happy Birthday!"
                error={errors.title?.message}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-charcoal">Your Message *</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowAiModal(!showAiModal);
                    if (!aiSuggestions.length) {
                      handleGenerateAiMessage();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum hover:text-plum-light transition-colors bg-plum-50 hover:bg-plum-100 px-3 py-1 rounded-full border border-plum-200"
                >
                  <span>✨ Magic AI Wish Generator</span>
                </button>
              </div>

              {/* AI Wish Assistant Card */}
              {showAiModal && (
                <div className="mb-4 p-5 bg-surface-raised rounded-2xl border-2 border-plum-200 shadow-soft animate-slide-down">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🪄</span>
                      <h4 className="text-sm font-bold text-plum">AI Message Assistant</h4>
                    </div>
                    <Badge variant="gold">Instant Generator</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal-muted mb-1">Relationship</label>
                      <select
                        value={aiRelationship}
                        onChange={(e) => setAiRelationship(e.target.value)}
                        className="w-full text-xs rounded-xl border border-border-light bg-surface px-3 py-2 text-charcoal"
                      >
                        {RELATIONSHIPS.map((rel) => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-charcoal-muted mb-1">Tone</label>
                      <select
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value as 'heartfelt' | 'funny' | 'poetic' | 'short' | 'romantic' | 'inspirational')}
                        className="w-full text-xs rounded-xl border border-border-light bg-surface px-3 py-2 text-charcoal"
                      >
                        {TONES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label} ({t.desc})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full mb-3"
                    onClick={handleGenerateAiMessage}
                    isLoading={isGeneratingAi}
                  >
                    ✨ Generate Suggestions for {recipientNameValue || 'Recipient'}
                  </Button>

                  {aiSuggestions.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-xs font-semibold text-charcoal-muted">Click a suggestion to use it:</p>
                      {aiSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          onClick={() => applyAiSuggestion(suggestion)}
                          className="p-3 bg-surface hover:bg-plum-50 rounded-xl border border-border-light hover:border-plum text-xs text-charcoal cursor-pointer transition-all duration-200 shadow-soft"
                        >
                          <p className="line-clamp-3">{suggestion}</p>
                          <span className="text-[10px] font-bold text-plum mt-1 block">Click to apply →</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Textarea
                {...register('message')}
                placeholder="Write your heartfelt message or use the AI Assistant..."
                rows={5}
                error={errors.message?.message}
              />
            </div>

            <div className="pt-6 border-t border-border-light space-y-4">
              <h3 className="text-lg font-semibold text-charcoal">Settings</h3>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isPublic"
                    type="checkbox"
                    className="w-4 h-4 text-plum bg-surface border-border-light rounded focus:ring-plum"
                    {...register('isPublic')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isPublic" className="font-medium text-charcoal">Make this wish public</label>
                  <p className="text-charcoal-muted">Allow this wish to be featured on the Explore page.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowReactions"
                    type="checkbox"
                    className="w-4 h-4 text-plum bg-surface border-border-light rounded focus:ring-plum"
                    {...register('allowReactions')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowReactions" className="font-medium text-charcoal">Allow Reactions</label>
                  <p className="text-charcoal-muted">Let the recipient send emoji reactions.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowReplies"
                    type="checkbox"
                    className="w-4 h-4 text-plum bg-surface border-border-light rounded focus:ring-plum"
                    {...register('allowReplies')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowReplies" className="font-medium text-charcoal">Allow Replies</label>
                  <p className="text-charcoal-muted">Let the recipient write a reply message to you.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={isSubmitting}
              >
                Create Wish ✨
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
