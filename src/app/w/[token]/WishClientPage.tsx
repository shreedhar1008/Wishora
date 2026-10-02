'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { TEMPLATES } from '@/lib/templates/definitions';
import { REACTION_EMOJIS } from '@/lib/utils';
import {
  ConfettiLayer,
  BalloonPop,
  CandleInteraction,
  GiftBoxReveal,
  EnvelopeReveal,
  BloomingRoses,
  CountdownTimer,
  SparkleBackground,
  HeartAnimation,
} from '@/components/interactions';
import type { Wish, InteractionType, Template } from '@/types';

// ---- Rich Demo Wishes (fallback dictionary) ----
const DEMO_WISHES: Record<string, Partial<Wish> & { template?: Template }> = {
  demo_emma_birthday: {
    id: 'demo1',
    publicToken: 'demo-emma-bday',
    templateSlug: 'birthday-balloon-blast',
    occasion: 'birthday',
    recipientName: 'Emma',
    senderName: 'Maya',
    message: "Today is a reminder of how much light you bring into the lives around you. I hope this year gives you many reasons to smile. You deserve all the happiness in the world, and I'm so grateful to have you in my life. Here's to another amazing year! 🎂✨",
    relationship: 'Best Friend',
    settings: {
      theme: 'playful',
      animationIntensity: 'vibrant',
      enabledInteractions: ['confetti', 'balloon-pop'] as InteractionType[],
    },
    status: 'published',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  'demo-emma-bday': {
    id: 'demo1',
    publicToken: 'demo-emma-bday',
    templateSlug: 'birthday-balloon-blast',
    occasion: 'birthday',
    recipientName: 'Emma',
    senderName: 'Maya',
    message: "Today is a reminder of how much light you bring into the lives around you. I hope this year gives you many reasons to smile. You deserve all the happiness in the world, and I'm so grateful to have you in my life. Here's to another amazing year! 🎂✨",
    relationship: 'Best Friend',
    settings: {
      theme: 'playful',
      animationIntensity: 'vibrant',
      enabledInteractions: ['confetti', 'balloon-pop'] as InteractionType[],
    },
    status: 'published',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  'demo-bday-1': {
    id: 'demo_bday_1',
    publicToken: 'demo-bday-1',
    templateSlug: 'birthday-balloon-blast',
    occasion: 'birthday',
    recipientName: 'Sarah',
    senderName: 'Alex',
    title: 'Happy 30th Birthday!',
    message: "Wishing you the happiest 30th birthday! May this decade bring you bold adventures, boundless happiness, and dreams come true! 🎂✨",
    status: 'published',
    visibility: 'public',
    settings: {
      enabledInteractions: ['confetti', 'balloon-pop'] as InteractionType[],
    },
  },
  demo_aarav_anniversary: {
    id: 'demo2',
    publicToken: 'demo-aarav-maya',
    templateSlug: 'our-story',
    occasion: 'anniversary',
    recipientName: 'Aarav & Maya',
    senderName: 'With love',
    message: "Every moment with you is a chapter in the most beautiful story ever written. From the first hello to a thousand sunsets together, every day with you feels like a new adventure. Happy Anniversary to the love of my life. 💕",
    relationship: 'Partner',
    settings: {
      theme: 'romantic',
      animationIntensity: 'moderate',
      enabledInteractions: ['envelope', 'blooming-roses'] as InteractionType[],
    },
    status: 'published',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  'demo-aarav-maya': {
    id: 'demo2',
    publicToken: 'demo-aarav-maya',
    templateSlug: 'our-story',
    occasion: 'anniversary',
    recipientName: 'Aarav & Maya',
    senderName: 'With love',
    message: "Every moment with you is a chapter in the most beautiful story ever written. From the first hello to a thousand sunsets together, every day with you feels like a new adventure. Happy Anniversary to the love of my life. 💕",
    relationship: 'Partner',
    settings: {
      theme: 'romantic',
      animationIntensity: 'moderate',
      enabledInteractions: ['envelope', 'blooming-roses'] as InteractionType[],
    },
    status: 'published',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  'demo-anniv-1': {
    id: 'demo_anniv_1',
    publicToken: 'demo-anniv-1',
    templateSlug: 'our-story',
    occasion: 'anniversary',
    recipientName: 'Michael',
    senderName: 'Elena',
    title: 'Happy Anniversary my love',
    message: "Celebrating another year of shared dreams, laughter, and unbreakable love. Happy Anniversary! 💕",
    status: 'published',
    visibility: 'public',
    settings: {
      enabledInteractions: ['envelope', 'blooming-roses'] as InteractionType[],
    },
  },
  demo_daniel_congrats: {
    id: 'demo3',
    publicToken: 'demo-dan-success',
    templateSlug: 'congratulations-confetti',
    occasion: 'congratulations',
    recipientName: 'Daniel',
    senderName: 'Sofia',
    message: "You did it! All those late nights and hard work have paid off. I'm so incredibly proud of you. This is just the beginning of amazing things to come. The world better get ready! 🎉🏆",
    relationship: 'Friend',
    settings: {
      theme: 'festive',
      animationIntensity: 'vibrant',
      enabledInteractions: ['confetti', 'gift-box'] as InteractionType[],
    },
    status: 'published',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  'demo-dan-success': {
    id: 'demo3',
    publicToken: 'demo-dan-success',
    templateSlug: 'congratulations-confetti',
    occasion: 'congratulations',
    recipientName: 'Daniel',
    senderName: 'Sofia',
    message: "You did it! All those late nights and hard work have paid off. I'm so incredibly proud of you. This is just the beginning of amazing things to come. The world better get ready! 🎉🏆",
    relationship: 'Friend',
    settings: {
      theme: 'festive',
      animationIntensity: 'vibrant',
      enabledInteractions: ['confetti', 'gift-box'] as InteractionType[],
    },
    status: 'published',
    visibility: 'public',
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  'demo-mom-thanks': {
    id: 'demo4',
    publicToken: 'demo-mom-thanks',
    templateSlug: 'thank-you-mom',
    occasion: 'thank-you',
    recipientName: 'Mom',
    senderName: 'Chloe',
    title: 'To the best Mom ever',
    message: "Thank you for your endless love, patience, and guidance. You are the best mom in the world and I appreciate everything you do for us every single day. 🌸",
    status: 'published',
    visibility: 'public',
    settings: {
      enabledInteractions: ['blooming-roses', 'envelope'] as InteractionType[],
    },
  },
  'demo-diwali-2026': {
    id: 'demo5',
    publicToken: 'demo-diwali-2026',
    templateSlug: 'diwali-glow',
    occasion: 'festival',
    recipientName: 'Family',
    senderName: 'The Sharma Family',
    title: 'Happy Diwali!',
    message: "May the festival of lights bring joy, prosperity, and happiness to your home. Wishing you and your family a sparkling Diwali! 🪔✨",
    status: 'published',
    visibility: 'public',
    settings: {
      enabledInteractions: ['confetti', 'gift-box'] as InteractionType[],
    },
  },
};

type WishPhase = 'loading' | 'intro' | 'interaction' | 'message' | 'reactions';

export default function WishClientPage({ token, serverWish }: { token: string, serverWish?: Partial<Wish> | null }) {
  const shouldReduceMotion = useReducedMotion();

  const [wish, setWish] = React.useState<(Partial<Wish> & { template?: Template }) | null>(() => {
    if (serverWish) return serverWish;
    if (DEMO_WISHES[token]) return DEMO_WISHES[token];
    return null;
  });

  const [template, setTemplate] = React.useState<Template | null>(() => {
    if (serverWish) {
      return TEMPLATES.find((t) => t.id === serverWish.templateId || t.slug === serverWish.templateSlug) || null;
    }
    if (DEMO_WISHES[token]) {
      const demo = DEMO_WISHES[token];
      return TEMPLATES.find((t) => t.slug === demo.templateSlug || t.id === demo.templateId) || null;
    }
    return null;
  });

  const [phase, setPhase] = React.useState<WishPhase>('loading');
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [showHearts, setShowHearts] = React.useState(false);
  const [selectedReactions, setSelectedReactions] = React.useState<Set<string>>(new Set());
  const [replyName, setReplyName] = React.useState('');
  const [replyMessage, setReplyMessage] = React.useState('');
  const [replySent, setReplySent] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);

  // Load wish if not in state yet
  React.useEffect(() => {
    if (wish) {
      const timer = setTimeout(() => setPhase('intro'), 1000);
      return () => clearTimeout(timer);
    }

    // Fetch from API in case server rendering missed it
    fetch(`/api/wishes/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: Record<string, unknown> & { publicToken?: string; templateId?: string; templateSlug?: string }) => {
        if (data && data.publicToken) {
          setWish(data as unknown as Partial<Wish>);
          const tpl = TEMPLATES.find((t) => t.id === data.templateId || t.slug === data.templateSlug) || null;
          setTemplate(tpl);
          setPhase('intro');
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        // Check localStorage for demo wishes
        try {
          const stored = JSON.parse(localStorage.getItem('wishora-published-wishes') || '[]');
          const found = stored.find((w: Partial<Wish>) => w.publicToken === token);
          if (found) {
            const tpl = TEMPLATES.find((t) => t.slug === found.templateSlug) || found.template || null;
            setWish(found);
            setTemplate(tpl);
            setPhase('intro');
          } else {
            setNotFound(true);
          }
        } catch {
          setNotFound(true);
        }
      });
  }, [token, wish]);

  // Track view
  React.useEffect(() => {
    if (token) {
      const viewKey = `wishora-viewed-${token}`;
      if (typeof window !== 'undefined' && !sessionStorage.getItem(viewKey)) {
        sessionStorage.setItem(viewKey, 'true');
        fetch(`/api/wishes/${token}/views`, { method: 'POST' }).catch(() => {});
      }
    }
  }, [token]);

  const handleOpen = () => {
    setPhase('interaction');
    if (!shouldReduceMotion) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    // Auto-progress to message after interaction
    setTimeout(() => setPhase('message'), 2200);
  };

  const handleInteractionComplete = () => {
    setPhase('message');
  };

  const handleReaction = async (type: string) => {
    setSelectedReactions((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });

    if (!shouldReduceMotion) {
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
    }

    try {
      await fetch(`/api/wishes/${token}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: type }),
      });
    } catch {
      // Non-blocking UI
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setReplySent(true);

    try {
      await fetch(`/api/wishes/${token}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: replyName.trim() || 'Anonymous',
          body: replyMessage.trim(),
        }),
      });
    } catch {
      // Non-blocking UI
    }
  };

  const handleReplay = () => {
    setPhase('intro');
    setShowConfetti(false);
    setShowHearts(false);
  };

  // ---- Not Found ----
  if (notFound) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <Card className="text-center max-w-md w-full">
          <span className="text-5xl block mb-4">😔</span>
          <h1 className="text-2xl font-bold text-charcoal mb-2">Wish Not Found</h1>
          <p className="text-charcoal-muted mb-6">
            This wish may have been deleted, expired, or the link might be incorrect.
          </p>
          <Link href="/">
            <Button variant="primary">Go to Wishora →</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ---- Loading Phase ----
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: template?.colorPalette?.background || 'hsl(40, 40%, 97%)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="animate-pulse-soft">
              <circle cx="16" cy="16" r="14" fill="url(#loadGrad)" />
              <path d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z" fill="white" opacity="0.9" />
              <defs>
                <linearGradient id="loadGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="hsl(320, 60%, 30%)" />
                  <stop offset="100%" stopColor="hsl(340, 65%, 55%)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-sm text-charcoal-muted mt-4 animate-pulse-soft">Preparing your surprise...</p>
        </motion.div>
      </div>
    );
  }

  const bgColor = template?.colorPalette?.background || '#FFF8F5';
  const primaryColor = template?.colorPalette?.primary || 'hsl(320, 60%, 30%)';
  const interactions = wish?.settings?.enabledInteractions || template?.interactiveModules || [];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: bgColor }}>
      {/* Sparkle Background */}
      <SparkleBackground color={primaryColor} density="low" />

      {/* Confetti */}
      <ConfettiLayer trigger={showConfetti} />

      {/* Hearts */}
      <HeartAnimation trigger={showHearts} />

      <AnimatePresence mode="wait">
        {/* ---- INTRO PHASE ---- */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="text-center max-w-sm w-full">
              <motion.div
                initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
              >
                <span className="text-6xl block mb-6">{template?.emoji || '✨'}</span>

                <p className="text-sm font-medium mb-2" style={{ color: primaryColor, opacity: 0.7 }}>
                  {wish?.senderName ? `From ${wish.senderName}` : 'Someone special'}
                </p>

                <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: primaryColor }}>
                  Hey {wish?.recipientName || 'You'}! 💝
                </h1>

                <p className="text-charcoal-muted mb-8">
                  You&apos;ve received a special surprise
                </p>

                <button
                  onClick={handleOpen}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-elevated hover:shadow-glow-plum transition-all duration-300 active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, hsl(340, 65%, 55%))` }}
                >
                  <span>Tap to Open</span>
                  <span className="text-2xl group-hover:animate-wiggle">🎁</span>
                </button>

                <p className="text-xs text-charcoal-muted mt-4 opacity-60">
                  Powered by Wishora ✨
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ---- INTERACTION PHASE ---- */}
        {phase === 'interaction' && (
          <motion.div
            key="interaction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full">
              {(interactions.includes('balloon-pop') || interactions.includes('balloons')) && (
                <BalloonPop onAllPopped={handleInteractionComplete} />
              )}
              {interactions.includes('candle-blow') && (
                <CandleInteraction
                  recipientName={wish?.recipientName || 'You'}
                  onBlown={handleInteractionComplete}
                />
              )}
              {(interactions.includes('gift-box') || interactions.includes('button')) && (
                <GiftBoxReveal>
                  <div className="text-center p-4">
                    <span className="text-4xl block mb-2">🎉</span>
                    <p className="text-lg font-bold" style={{ color: primaryColor }}>
                      Surprise!
                    </p>
                    <Button variant="ghost" onClick={handleInteractionComplete} className="mt-3">
                      Continue →
                    </Button>
                  </div>
                </GiftBoxReveal>
              )}
              {interactions.includes('envelope') && (
                <EnvelopeReveal
                  message={wish?.message || ''}
                  senderName={wish?.senderName || ''}
                  recipientName={wish?.recipientName || ''}
                />
              )}
              {interactions.includes('blooming-roses') && (
                <BloomingRoses message={wish?.title || 'For you'} />
              )}
              {/* Auto-advance if no specific interaction */}
              {!interactions.includes('balloon-pop') &&
                !interactions.includes('balloons') &&
                !interactions.includes('candle-blow') &&
                !interactions.includes('gift-box') &&
                !interactions.includes('button') &&
                !interactions.includes('envelope') &&
                !interactions.includes('blooming-roses') && (
                <div className="text-center">
                  <span className="text-6xl block mb-4 animate-bounce-gentle">🎉</span>
                  <Button variant="ghost" onClick={handleInteractionComplete} className="mt-3">
                    Tap to see wish →
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ---- MESSAGE PHASE (Main Content) ---- */}
        {(phase === 'message' || phase === 'reactions') && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen py-12 px-4"
          >
            <div className="max-w-lg mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.span
                  className="text-5xl block mb-4"
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {template?.emoji || '✨'}
                </motion.span>

                {wish?.title && (
                  <h2 className="text-lg font-bold mb-2" style={{ color: primaryColor }}>
                    {wish.title}
                  </h2>
                )}

                <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-1">
                  {wish?.occasion === 'birthday' && `Happy Birthday, ${wish?.recipientName}! 🎂`}
                  {wish?.occasion === 'anniversary' && `Happy Anniversary, ${wish?.recipientName}! 💕`}
                  {wish?.occasion === 'congratulations' && `Congratulations, ${wish?.recipientName}! 🎉`}
                  {wish?.occasion === 'love' && `Dear ${wish?.recipientName} 💝`}
                  {wish?.occasion === 'wedding' && `Congratulations, ${wish?.recipientName}! 💒`}
                  {wish?.occasion === 'thank-you' && `Thank You, ${wish?.recipientName}! 🙏`}
                  {wish?.occasion === 'friendship' && `To My Friend, ${wish?.recipientName}! 🤝`}
                  {wish?.occasion === 'festival' && `Happy Celebrations, ${wish?.recipientName}! 🎊`}
                  {wish?.occasion === 'mothers-day' && `Happy Mother's Day, ${wish?.recipientName}! 👩`}
                  {wish?.occasion === 'fathers-day' && `Happy Father's Day, ${wish?.recipientName}! 👨`}
                  {wish?.occasion === 'new-year' && `Happy New Year, ${wish?.recipientName}! 🎆`}
                  {wish?.occasion === 'get-well-soon' && `Get Well Soon, ${wish?.recipientName}! 🌻`}
                  {(!wish?.occasion || !['birthday', 'anniversary', 'congratulations', 'love', 'wedding', 'thank-you', 'friendship', 'festival', 'mothers-day', 'fathers-day', 'new-year', 'get-well-soon'].includes(wish.occasion)) && `Dear ${wish?.recipientName || 'You'} ✨`}
                </h1>
              </div>

              {/* Message Card */}
              <Card padding="lg" className="mb-8 border-2" style={{ borderColor: `${primaryColor}20` }}>
                <p className="text-charcoal leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                  {wish?.message}
                </p>
                {wish?.senderName && (
                  <p className="mt-6 text-sm font-semibold" style={{ color: primaryColor }}>
                    — With love, {wish.senderName} ❤️
                  </p>
                )}
              </Card>

              {/* Countdown if enabled */}
              {interactions.includes('countdown') && wish?.settings?.countdownDate && (
                <div className="mb-8">
                  <CountdownTimer targetDate={wish.settings.countdownDate} title="Counting down to..." />
                </div>
              )}

              {/* Reaction Bar */}
              <Card padding="md" className="mb-6">
                <p className="text-sm font-medium text-charcoal mb-4 text-center">
                  How did this make you feel?
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {Object.entries(REACTION_EMOJIS).map(([key, { emoji, label }]) => (
                    <button
                      key={key}
                      onClick={() => handleReaction(key)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
                        selectedReactions.has(key)
                          ? 'bg-plum-50 scale-110 shadow-soft'
                          : 'hover:bg-ivory active:scale-95'
                      }`}
                      aria-label={`React with ${label}`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-xs text-charcoal-muted">{label}</span>
                    </button>
                  ))}
                </div>
                {selectedReactions.size > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-emerald mt-3 font-medium"
                  >
                    ✓ Reaction sent!
                  </motion.p>
                )}
              </Card>

              {/* Reply Form */}
              <Card padding="md" className="mb-8">
                <p className="text-sm font-medium text-charcoal mb-4">
                  Send a reply to {wish?.senderName || 'the sender'}
                </p>
                {!replySent ? (
                  <div className="space-y-3">
                    <input
                      placeholder="Your name"
                      value={replyName}
                      onChange={(e) => setReplyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-charcoal text-sm placeholder:text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-plum/30"
                    />
                    <textarea
                      placeholder="Write a reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-charcoal text-sm placeholder:text-charcoal-muted resize-none focus:outline-none focus:ring-2 focus:ring-plum/30"
                    />
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      onClick={handleReply}
                      disabled={!replyMessage.trim()}
                    >
                      Send Reply 💌
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <span className="text-3xl block mb-2">💌</span>
                    <p className="text-emerald font-medium">Reply sent successfully!</p>
                    <p className="text-xs text-charcoal-muted mt-1">
                      {wish?.senderName || 'The sender'} will see your message
                    </p>
                  </motion.div>
                )}
              </Card>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleReplay}>
                  ↺ Replay
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
                      if (navigator.share) {
                        navigator.share({
                          title: 'A magical wish from Wishora',
                          url: window.location.href,
                        }).catch(() => {});
                      } else if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }
                  }}
                >
                  📤 Share
                </Button>
              </div>

              {/* Wishora Branding */}
              <div className="text-center mt-12 pb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-charcoal-muted hover:text-plum transition-colors">
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.15" />
                    <path d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z" fill="currentColor" opacity="0.3" />
                  </svg>
                  <span className="text-xs font-medium">Made with Wishora</span>
                </Link>
                <p className="text-xs text-charcoal-muted mt-2">
                  <Link href="/create" className="hover:text-plum transition-colors">Create your own wish →</Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
