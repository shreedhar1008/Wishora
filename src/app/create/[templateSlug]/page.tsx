'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Input, Textarea, Badge, ProgressBar, Dialog } from '@/components/ui';
import { TEMPLATES } from '@/lib/templates/definitions';
import { generateToken } from '@/lib/utils';
import type { WishSettings, InteractionType, AnimationIntensity, ThemeStyle } from '@/types';

// ---- Types ----
interface EditorState {
  recipientName: string;
  senderName: string;
  message: string;
  title: string;
  relationship: string;
  occasionDate: string;
  age: string;
  theme: ThemeStyle;
  animationIntensity: AnimationIntensity;
  enabledInteractions: InteractionType[];
  visibility: 'private' | 'public';
  expiryOption: '24h' | '7d' | '30d' | 'never';
  password: string;
  listOnExplore: boolean;
}

const STEPS = [
  { id: 1, label: 'Personalize', emoji: '✏️' },
  { id: 2, label: 'Customize', emoji: '🎨' },
  { id: 3, label: 'Interactions', emoji: '🎮' },
  { id: 4, label: 'Privacy', emoji: '🔒' },
  { id: 5, label: 'Preview & Publish', emoji: '🚀' },
];

const THEMES: { value: ThemeStyle; label: string; emoji: string }[] = [
  { value: 'elegant', label: 'Elegant', emoji: '✨' },
  { value: 'playful', label: 'Playful', emoji: '🎈' },
  { value: 'romantic', label: 'Romantic', emoji: '💕' },
  { value: 'festive', label: 'Festive', emoji: '🎊' },
  { value: 'minimal', label: 'Minimal', emoji: '🤍' },
  { value: 'bold', label: 'Bold', emoji: '🔥' },
];

const INTERACTION_OPTIONS: { value: InteractionType; label: string; emoji: string; description: string }[] = [
  { value: 'confetti', label: 'Confetti Burst', emoji: '🎊', description: 'Colorful confetti celebration' },
  { value: 'balloon-pop', label: 'Balloon Pop', emoji: '🎈', description: 'Interactive balloon popping' },
  { value: 'candle-blow', label: 'Candle Blowing', emoji: '🕯️', description: 'Blow out birthday candles' },
  { value: 'gift-box', label: 'Gift Box', emoji: '🎁', description: 'Unwrap a virtual gift' },
  { value: 'envelope', label: 'Love Letter', emoji: '💌', description: 'Open an animated envelope' },
  { value: 'blooming-roses', label: 'Blooming Roses', emoji: '🌹', description: 'Watch roses bloom beautifully' },
  { value: 'countdown', label: 'Countdown', emoji: '⏰', description: 'Countdown to a special date' },
  { value: 'scratch-reveal', label: 'Scratch Card', emoji: '🎟️', description: 'Scratch to reveal message' },
  { value: 'memory-gallery', label: 'Photo Gallery', emoji: '📸', description: 'Swipeable photo memories' },
  { value: 'quiz', label: 'Fun Quiz', emoji: '🎯', description: 'A quiz about your relationship' },
  { value: 'poll', label: 'Poll', emoji: '📊', description: 'Fun poll for friends' },
];

const MESSAGE_SUGGESTIONS = [
  "Today is a reminder of how much light you bring into the lives around you. I hope this year gives you many reasons to smile.",
  "Every moment with you is a gift I'll treasure forever. Here's to making more beautiful memories together.",
  "You deserve all the happiness in the world. This is just a small way to tell you how much you mean to me.",
  "I may not say it enough, but you are one of the most important people in my life. Thank you for everything.",
  "Here's to the beautiful soul that you are — may today be filled with love, laughter, and everything that makes you happy.",
];

export default function WishEditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateSlug = params?.templateSlug as string;
  const template = TEMPLATES.find((t) => t.slug === templateSlug);

  const [step, setStep] = React.useState(1);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishedToken, setPublishedToken] = React.useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [creatorToken, setCreatorToken] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<EditorState>({
    recipientName: '',
    senderName: '',
    message: template?.defaultMessage || '',
    title: '',
    relationship: '',
    occasionDate: '',
    age: '',
    theme: 'elegant',
    animationIntensity: 'moderate',
    enabledInteractions: template?.interactiveModules?.slice(0, 2) as InteractionType[] || ['confetti'],
    visibility: 'private',
    expiryOption: 'never',
    password: '',
    listOnExplore: false,
  });

  // Autosave to localStorage
  React.useEffect(() => {
    const key = `wishora-draft-${templateSlug}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch { /* ignore */ }
    }
  }, [templateSlug]);

  React.useEffect(() => {
    const key = `wishora-draft-${templateSlug}`;
    const timeout = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(form));
    }, 500);
    return () => clearTimeout(timeout);
  }, [form, templateSlug]);

  // Warn before leaving with unsaved changes
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.recipientName || form.message !== template?.defaultMessage) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form, template]);

  const updateForm = (field: keyof EditorState, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInteraction = (interaction: InteractionType) => {
    setForm((prev) => ({
      ...prev,
      enabledInteractions: prev.enabledInteractions.includes(interaction)
        ? prev.enabledInteractions.filter((i) => i !== interaction)
        : [...prev.enabledInteractions, interaction],
    }));
  };

  const handlePublish = async () => {
    if (!form.recipientName.trim()) {
      setStep(1);
      return;
    }

    setIsPublishing(true);

    // Simulate publish delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const token = generateToken(16);
    const manageToken = generateToken(20);

    // Store wish in localStorage for demo mode
    const wish = {
      id: generateToken(8),
      publicToken: token,
      creatorManageToken: manageToken,
      templateSlug,
      occasion: template?.occasion || 'other',
      title: form.title || `${template?.title} for ${form.recipientName}`,
      recipientName: form.recipientName,
      senderName: form.senderName,
      message: form.message,
      relationship: form.relationship,
      settings: {
        theme: form.theme,
        animationIntensity: form.animationIntensity,
        enabledInteractions: form.enabledInteractions,
      },
      status: 'published',
      visibility: form.visibility,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      template: template,
    };

    // Save to localStorage
    const wishes = JSON.parse(localStorage.getItem('wishora-published-wishes') || '[]');
    wishes.push(wish);
    localStorage.setItem('wishora-published-wishes', JSON.stringify(wishes));

    // Clear draft
    localStorage.removeItem(`wishora-draft-${templateSlug}`);

    setPublishedToken(token);
    setCreatorToken(manageToken);
    setIsPublishing(false);
    setShowShareDialog(true);
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Card className="text-center max-w-md mx-auto">
          <span className="text-5xl block mb-4">😕</span>
          <h2 className="text-xl font-bold text-charcoal mb-2">Template not found</h2>
          <p className="text-charcoal-muted mb-6">The template you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/create')}>Browse Templates</Button>
        </Card>
      </div>
    );
  }

  const canPublish = form.recipientName.trim().length > 0 && form.message.trim().length > 0;

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{template.emoji}</span>
            <div>
              <h1 className="text-xl font-bold text-charcoal">{template.title}</h1>
              <p className="text-sm text-charcoal-muted">Create your wish</p>
            </div>
          </div>
          <Badge variant="gold">Autosaved ✓</Badge>
        </div>

        {/* Progress */}
        <ProgressBar value={step} max={STEPS.length} className="mb-2" />
        <div className="flex justify-between mb-8">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`text-xs font-medium transition-colors ${
                step === s.id ? 'text-plum' : step > s.id ? 'text-emerald' : 'text-charcoal-muted'
              }`}
            >
              <span className="hidden sm:inline">{s.emoji} {s.label}</span>
              <span className="sm:hidden">{s.emoji}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-3">
            <Card padding="lg">
              {/* Step 1: Personalize */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-charcoal">✏️ Personalize your wish</h2>

                  <Input
                    label="Recipient's Name *"
                    placeholder="Who is this wish for?"
                    value={form.recipientName}
                    onChange={(e) => updateForm('recipientName', e.target.value)}
                    error={!form.recipientName.trim() && step > 1 ? 'Required' : undefined}
                  />

                  <Input
                    label="Your Name"
                    placeholder="Who is this from?"
                    value={form.senderName}
                    onChange={(e) => updateForm('senderName', e.target.value)}
                  />

                  <Input
                    label="Relationship"
                    placeholder="e.g., Best friend, Partner, Mom"
                    value={form.relationship}
                    onChange={(e) => updateForm('relationship', e.target.value)}
                  />

                  <Textarea
                    label="Your Message *"
                    placeholder="Write something heartfelt..."
                    value={form.message}
                    onChange={(e) => updateForm('message', e.target.value)}
                    rows={6}
                    charCount
                    maxChars={1000}
                    error={!form.message.trim() && step > 1 ? 'Required' : undefined}
                  />

                  {/* Message suggestions */}
                  <div>
                    <p className="text-sm font-medium text-charcoal mb-3">💡 Need inspiration?</p>
                    <div className="space-y-2">
                      {MESSAGE_SUGGESTIONS.slice(0, 3).map((msg, i) => (
                        <button
                          key={i}
                          onClick={() => updateForm('message', msg)}
                          className="w-full text-left p-3 rounded-xl border border-border-light text-sm text-charcoal-light hover:bg-plum-50 hover:border-plum-200 transition-all"
                        >
                          &ldquo;{msg.slice(0, 80)}...&rdquo;
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-charcoal-muted mt-2">These are suggestions — feel free to edit!</p>
                  </div>

                  <Input
                    label="Optional Title"
                    placeholder="e.g., Happy Birthday!"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Occasion Date"
                      type="date"
                      value={form.occasionDate}
                      onChange={(e) => updateForm('occasionDate', e.target.value)}
                    />
                    <Input
                      label="Age / Milestone"
                      placeholder="e.g., 25"
                      value={form.age}
                      onChange={(e) => updateForm('age', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Customize */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-charcoal">🎨 Customize appearance</h2>

                  <div>
                    <p className="text-sm font-medium text-charcoal mb-3">Theme Style</p>
                    <div className="grid grid-cols-3 gap-3">
                      {THEMES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => updateForm('theme', t.value)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            form.theme === t.value
                              ? 'border-plum bg-plum-50'
                              : 'border-border-light hover:border-plum-200'
                          }`}
                        >
                          <span className="text-2xl block mb-1">{t.emoji}</span>
                          <span className="text-sm font-medium">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-charcoal mb-3">Animation Intensity</p>
                    <div className="flex gap-3">
                      {(['subtle', 'moderate', 'vibrant'] as AnimationIntensity[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => updateForm('animationIntensity', level)}
                          className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                            form.animationIntensity === level
                              ? 'border-plum bg-plum-50 text-plum'
                              : 'border-border-light text-charcoal-light hover:border-plum-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Interactions */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-charcoal">🎮 Add interactions</h2>
                  <p className="text-sm text-charcoal-muted">
                    Choose interactive elements for the recipient to enjoy
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {INTERACTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => toggleInteraction(opt.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          form.enabledInteractions.includes(opt.value)
                            ? 'border-plum bg-plum-50'
                            : 'border-border-light hover:border-plum-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{opt.emoji}</span>
                          <div>
                            <p className="text-sm font-semibold text-charcoal">{opt.label}</p>
                            <p className="text-xs text-charcoal-muted">{opt.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Privacy */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-charcoal">🔒 Privacy & sharing</h2>

                  <div>
                    <p className="text-sm font-medium text-charcoal mb-3">Visibility</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateForm('visibility', 'private')}
                        className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                          form.visibility === 'private'
                            ? 'border-plum bg-plum-50'
                            : 'border-border-light hover:border-plum-200'
                        }`}
                      >
                        <span className="text-2xl block mb-1">🔒</span>
                        <span className="text-sm font-semibold block">Private</span>
                        <span className="text-xs text-charcoal-muted">Only people with the link</span>
                      </button>
                      <button
                        onClick={() => { updateForm('visibility', 'public'); updateForm('listOnExplore', true); }}
                        className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                          form.visibility === 'public'
                            ? 'border-plum bg-plum-50'
                            : 'border-border-light hover:border-plum-200'
                        }`}
                      >
                        <span className="text-2xl block mb-1">🌍</span>
                        <span className="text-sm font-semibold block">Public</span>
                        <span className="text-xs text-charcoal-muted">Listed on Explore page</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-charcoal mb-3">Link Expiry</p>
                    <div className="grid grid-cols-4 gap-2">
                      {([['24h', '24 Hours'], ['7d', '7 Days'], ['30d', '30 Days'], ['never', 'Never']] as const).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => updateForm('expiryOption', val)}
                          className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            form.expiryOption === val
                              ? 'border-plum bg-plum-50 text-plum'
                              : 'border-border-light text-charcoal-light hover:border-plum-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Password Protection (optional)"
                    type="password"
                    placeholder="Leave empty for no password"
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    helperText="Recipients will need this password to view the wish"
                  />
                </div>
              )}

              {/* Step 5: Preview & Publish */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-charcoal">🚀 Preview & Publish</h2>

                  <Card className="bg-plum-50/50 border-plum-200">
                    <h3 className="font-semibold text-charcoal mb-4">Wish Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">Template</span>
                        <span className="font-medium">{template.emoji} {template.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">For</span>
                        <span className="font-medium">{form.recipientName || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">From</span>
                        <span className="font-medium">{form.senderName || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">Theme</span>
                        <span className="font-medium capitalize">{form.theme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">Interactions</span>
                        <span className="font-medium">{form.enabledInteractions.length} selected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">Visibility</span>
                        <Badge variant={form.visibility === 'private' ? 'default' : 'coral'}>
                          {form.visibility === 'private' ? '🔒 Private' : '🌍 Public'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">Expires</span>
                        <span className="font-medium">{form.expiryOption === 'never' ? 'Never' : form.expiryOption}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Message preview */}
                  <div className="p-6 rounded-2xl bg-surface border border-border-light">
                    <p className="text-sm text-charcoal-muted mb-2">Message preview:</p>
                    <p className="text-charcoal leading-relaxed whitespace-pre-wrap">{form.message}</p>
                    {form.senderName && (
                      <p className="text-sm font-medium text-coral mt-4">— {form.senderName}</p>
                    )}
                  </div>

                  {!canPublish && (
                    <div className="p-4 rounded-xl bg-amber/10 border border-amber/30">
                      <p className="text-sm text-amber font-medium">⚠️ Please fill in the recipient name and message before publishing.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border-light">
                <Button
                  variant="ghost"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  ← Back
                </Button>

                {step < 5 ? (
                  <Button
                    variant="primary"
                    onClick={() => setStep(Math.min(5, step + 1))}
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handlePublish}
                    isLoading={isPublishing}
                    disabled={!canPublish || isPublishing}
                  >
                    ✨ Publish Wish
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-24">
              <p className="text-sm font-medium text-charcoal mb-3">Live Preview</p>
              <Card padding="none" className="overflow-hidden">
                <div
                  className="h-32 flex items-center justify-center"
                  style={{ background: template.previewGradient }}
                >
                  <span className="text-5xl">{template.emoji}</span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-charcoal-muted mb-1">A special wish for</p>
                  <h3 className="text-lg font-bold text-plum mb-3">
                    {form.recipientName || 'Recipient'}
                  </h3>
                  <p className="text-sm text-charcoal-light leading-relaxed line-clamp-4">
                    {form.message || 'Your message will appear here...'}
                  </p>
                  {form.senderName && (
                    <p className="text-sm font-medium text-coral mt-3">— {form.senderName}</p>
                  )}

                  {form.enabledInteractions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border-light">
                      <p className="text-xs text-charcoal-muted mb-2">Interactions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.enabledInteractions.map((i) => {
                          const opt = INTERACTION_OPTIONS.find((o) => o.value === i);
                          return (
                            <Badge key={i} variant="default" className="text-xs">
                              {opt?.emoji} {opt?.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        title="🎉 Wish Published!"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-5xl block mb-3">🎊</span>
            <p className="text-charcoal-light">
              Your wish for <strong>{form.recipientName}</strong> is live!
            </p>
          </div>

          {/* Share URL */}
          <div>
            <label className="text-sm font-medium text-charcoal block mb-2">Share this link:</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/w/${publishedToken}`}
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-ivory text-sm text-charcoal"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant="primary"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/w/${publishedToken}`);
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                const url = `${window.location.origin}/w/${publishedToken}`;
                const text = `${form.senderName || 'Someone'} made a special wish for you! ✨`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
              }}
            >
              💬 WhatsApp
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                const url = `${window.location.origin}/w/${publishedToken}`;
                const subject = `A special wish for ${form.recipientName}`;
                window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(url)}`, '_blank');
              }}
            >
              📧 Email
            </Button>
          </div>

          {/* Web Share API */}
          {'share' in (typeof navigator !== 'undefined' ? navigator : {}) && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                navigator.share({
                  title: `A wish for ${form.recipientName}`,
                  text: `${form.senderName || 'Someone'} made a special wish for you! ✨`,
                  url: `${window.location.origin}/w/${publishedToken}`,
                });
              }}
            >
              📤 Share via...
            </Button>
          )}

          {/* Creator link warning */}
          <div className="p-4 rounded-xl bg-amber/10 border border-amber/30">
            <p className="text-sm font-medium text-amber mb-1">⚠️ Save your creator link</p>
            <p className="text-xs text-charcoal-muted">
              Without an account, this is how you manage your wish. Bookmark it!
            </p>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setShowShareDialog(false);
              router.push(`/w/${publishedToken}`);
            }}
          >
            View Published Wish →
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
