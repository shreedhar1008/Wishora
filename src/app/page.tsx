'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Button, Card, Badge, Accordion } from '@/components/ui';

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-plum-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-gold/10 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="gold" className="mb-6 text-sm px-4 py-1.5">
              ✨ No signup required
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-6 text-balance">
              Make someone&apos;s day{' '}
              <span className="gradient-text-plum">unforgettable</span>
            </h1>
            <p className="text-lg sm:text-xl text-charcoal-light leading-relaxed mb-8 max-w-xl">
              Create beautiful, animated, personalized wishes for birthdays, anniversaries, and every special occasion. Share the magic with a unique link.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create">
                <Button size="xl" variant="primary" className="w-full sm:w-auto">
                  ✨ Create a Wish
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Explore Templates
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Interactive Demo Card */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <HeroWishDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// HERO WISH DEMO CARD
// ============================================

function HeroWishDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative max-w-sm mx-auto lg:mx-0 lg:ml-auto">
      {/* Decorative sparkles */}
      <div className="absolute -top-4 -right-4 text-2xl animate-bounce-gentle">✨</div>
      <div className="absolute -bottom-3 -left-3 text-xl animate-sparkle">💫</div>

      <Card className="relative overflow-hidden border-2 border-plum-100" padding="none">
        {/* Card header gradient */}
        <div className="gradient-celebration p-6 pb-8">
          <div className="text-center">
            <span className="text-4xl mb-3 block">🎂</span>
            <p className="text-sm font-medium text-plum/70 mb-1">A special wish for</p>
            <h3 className="text-2xl font-bold text-plum">Emma</h3>
          </div>
        </div>

        {/* Card body */}
        <div className="p-6 -mt-4 bg-surface rounded-t-2xl relative">
          {!isOpen ? (
            <div className="text-center py-4">
              <button
                onClick={() => setIsOpen(true)}
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-plum text-white font-semibold text-lg shadow-glow-plum hover:shadow-elevated transition-all duration-300 active:scale-95"
              >
                <span>Tap to Open</span>
                <span className="text-xl group-hover:animate-wiggle">🎁</span>
              </button>
              <p className="text-xs text-charcoal-muted mt-3">Try it! It&apos;s interactive ✨</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-2"
            >
              <div className="text-3xl mb-3">🎉🎈🎂</div>
              <h4 className="text-xl font-bold text-plum mb-3">Happy Birthday, Emma!</h4>
              <p className="text-charcoal-light text-sm leading-relaxed mb-4">
                Today is a reminder of how much light you bring into the lives around you. I hope this year gives you many reasons to smile.
              </p>
              <p className="text-sm font-medium text-coral">— With love, Maya ❤️</p>
              <div className="flex justify-center gap-2 mt-4">
                {['❤️', '😍', '🎉', '🥹', '🤗'].map((emoji) => (
                  <button
                    key={emoji}
                    className="p-2 rounded-xl hover:bg-plum-50 transition-colors text-xl active:scale-90"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-charcoal-muted mt-3 hover:text-plum transition-colors"
              >
                Replay ↺
              </button>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// OCCASION SELECTOR
// ============================================

const OCCASIONS = [
  { slug: 'birthday', emoji: '🎂', label: 'Birthday', color: 'bg-coral/10 text-coral-dark' },
  { slug: 'anniversary', emoji: '💑', label: 'Anniversary', color: 'bg-rose/10 text-rose-dark' },
  { slug: 'wedding', emoji: '💒', label: 'Wedding', color: 'bg-gold/10 text-gold-dark' },
  { slug: 'love', emoji: '💕', label: 'Love', color: 'bg-rose/10 text-rose-dark' },
  { slug: 'congratulations', emoji: '🎉', label: 'Congrats', color: 'bg-emerald/10 text-emerald' },
  { slug: 'thank-you', emoji: '🙏', label: 'Thank You', color: 'bg-plum-50 text-plum' },
  { slug: 'friendship', emoji: '🤝', label: 'Friendship', color: 'bg-coral/10 text-coral-dark' },
  { slug: 'festival', emoji: '🎊', label: 'Festival', color: 'bg-gold/10 text-gold-dark' },
  { slug: 'mothers-day', emoji: '👩', label: "Mother's Day", color: 'bg-rose/10 text-rose-dark' },
  { slug: 'fathers-day', emoji: '👨', label: "Father's Day", color: 'bg-plum-50 text-plum' },
  { slug: 'new-year', emoji: '🎆', label: 'New Year', color: 'bg-gold/10 text-gold-dark' },
  { slug: 'get-well-soon', emoji: '🌻', label: 'Get Well', color: 'bg-emerald/10 text-emerald' },
];

function OccasionSelector() {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Every occasion deserves magic
          </h2>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            Choose an occasion and create a wish that truly captures the moment
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {OCCASIONS.map((occ) => (
            <Link
              key={occ.slug}
              href={`/create?occasion=${occ.slug}`}
              className="group"
            >
              <Card hover padding="sm" className="text-center !p-4 group-hover:border-plum-200">
                <span className="text-3xl sm:text-4xl block mb-2 group-hover:animate-bounce-gentle transition-transform">
                  {occ.emoji}
                </span>
                <span className="text-xs sm:text-sm font-medium text-charcoal-light group-hover:text-plum transition-colors">
                  {occ.label}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CHOOSE A FEELING SECTION
// ============================================

const FEELINGS = [
  { emoji: '😊', title: 'Make them smile', description: 'Brighten their day with joy and warmth', color: 'from-gold/20 to-coral/20' },
  { emoji: '🥹', title: 'Make them cry happy tears', description: 'Touch their heart with words that matter', color: 'from-rose/20 to-plum/20' },
  { emoji: '💕', title: 'Make them feel loved', description: 'Show how much they mean to you', color: 'from-rose/20 to-coral/20' },
  { emoji: '😂', title: 'Make them laugh', description: 'Add fun and playfulness to their day', color: 'from-gold/20 to-emerald/20' },
  { emoji: '🏆', title: 'Celebrate a milestone', description: 'Honor their achievements and growth', color: 'from-gold/20 to-plum/20' },
];

function FeelingSection() {
  return (
    <section className="py-20 bg-lavender/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Choose a feeling
          </h2>
          <p className="text-charcoal-light text-lg">
            What emotion do you want to create?
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {FEELINGS.map((feeling) => (
            <Link key={feeling.title} href="/create">
              <Card hover padding="md" className="text-center group h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feeling.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{feeling.emoji}</span>
                </div>
                <h3 className="font-semibold text-charcoal mb-2 text-sm">{feeling.title}</h3>
                <p className="text-xs text-charcoal-muted">{feeling.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURED TEMPLATES
// ============================================

const FEATURED_TEMPLATES = [
  { slug: 'birthday-balloon-blast', emoji: '🎈', title: 'Birthday Balloon Blast', occasion: 'Birthday', gradient: 'from-coral to-rose' },
  { slug: 'love-letter', emoji: '💌', title: 'Love Letter', occasion: 'Love', gradient: 'from-rose to-plum' },
  { slug: 'congratulations-confetti', emoji: '🎊', title: 'Congratulations Confetti', occasion: 'Congratulations', gradient: 'from-gold to-coral' },
  { slug: 'blow-the-candles', emoji: '🕯️', title: 'Blow the Candles', occasion: 'Birthday', gradient: 'from-coral-light to-gold' },
  { slug: 'our-story', emoji: '📖', title: 'Our Story', occasion: 'Anniversary', gradient: 'from-plum to-rose' },
  { slug: 'diwali-glow', emoji: '🪔', title: 'Diwali Glow', occasion: 'Festival', gradient: 'from-gold to-coral' },
];

function FeaturedTemplates() {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Popular templates
          </h2>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            Start with a stunning template and make it yours
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURED_TEMPLATES.map((tpl) => (
            <Link key={tpl.slug} href={`/create/${tpl.slug}`}>
              <Card hover padding="none" className="overflow-hidden group">
                <div className={`h-40 bg-gradient-to-br ${tpl.gradient} flex items-center justify-center relative`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{tpl.emoji}</span>
                  <Badge className="absolute top-3 right-3" variant="default">{tpl.occasion}</Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-charcoal mb-1">{tpl.title}</h3>
                  <p className="text-sm text-charcoal-muted">
                    Create a magical {tpl.occasion.toLowerCase()} wish →
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/templates">
            <Button variant="outline" size="lg">
              View All Templates →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS
// ============================================

const STEPS = [
  { step: '01', emoji: '🎨', title: 'Pick a template', description: 'Choose from 30+ beautiful templates for any occasion. Birthday, anniversary, wedding, or festival — we have you covered.' },
  { step: '02', emoji: '✏️', title: 'Personalize it', description: 'Add their name, your message, photos, music, and choose interactive elements. Make it truly theirs.' },
  { step: '03', emoji: '🔗', title: 'Share the magic', description: 'Get a unique link and share it via WhatsApp, Instagram, SMS, or email. Watch their reaction!' },
];

function HowItWorks() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            How it works
          </h2>
          <p className="text-charcoal-light text-lg">
            Create and share a magical wish in under 3 minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {STEPS.map((item) => (
            <div key={item.step} className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-plum text-white mb-6 mx-auto">
                <span className="text-3xl">{item.emoji}</span>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold text-charcoal text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-3">{item.title}</h3>
              <p className="text-charcoal-light text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// INTERACTIVE EXPERIENCE SHOWCASE
// ============================================

const INTERACTIONS_SHOWCASE = [
  { emoji: '🎈', title: 'Balloon Popping', description: 'Tap balloons to pop them and reveal surprises' },
  { emoji: '🕯️', title: 'Candle Blowing', description: 'Interactive birthday candles to blow out' },
  { emoji: '🎁', title: 'Gift Opening', description: 'Unwrap a virtual gift with a tap' },
  { emoji: '💌', title: 'Love Letter', description: 'Open an animated envelope to read a heartfelt message' },
  { emoji: '📸', title: 'Photo Memories', description: 'Swipeable gallery of cherished moments' },
  { emoji: '🎯', title: 'Quizzes & Polls', description: 'Fun interactive games to play together' },
];

function InteractiveShowcase() {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="coral" className="mb-4 px-4 py-1.5">Interactive ✨</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            More than just a message
          </h2>
          <p className="text-charcoal-light text-lg max-w-2xl mx-auto">
            Add interactive elements that make your wish come alive
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {INTERACTIONS_SHOWCASE.map((item) => (
            <Card key={item.title} hover padding="lg" className="text-center group">
              <div className="w-16 h-16 rounded-2xl bg-plum-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-plum-100 transition-colors">
                <span className="text-3xl">{item.emoji}</span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
              <p className="text-sm text-charcoal-muted">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SOCIAL PROOF / TESTIMONIALS
// ============================================

const TESTIMONIALS = [
  {
    name: 'Sofia M.',
    avatar: 'S',
    role: 'Sent a birthday wish',
    quote: "My friend literally called me in tears! She said it was the most beautiful birthday surprise she'd ever received. Way better than a plain WhatsApp message.",
    rating: 5,
  },
  {
    name: 'Aarav K.',
    avatar: 'A',
    role: 'Sent an anniversary wish',
    quote: 'I used the Our Story template for our anniversary. My wife was so moved by the timeline of our memories. The animations made it feel so special.',
    rating: 5,
  },
  {
    name: 'Daniel P.',
    avatar: 'D',
    role: 'Received a congratulations wish',
    quote: 'Someone sent me a Wishora link and I was blown away. The confetti, the personal message, the interactions — it felt like opening a real gift!',
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="py-20 bg-lavender/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Loved by wish-makers worldwide
          </h2>
          <p className="text-charcoal-light text-lg">
            See what people are saying about their Wishora experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-plum flex items-center justify-center text-white font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">{t.name}</p>
                  <p className="text-xs text-charcoal-muted">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-charcoal-light leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ SECTION
// ============================================

const FAQ_ITEMS = [
  { id: 'faq-1', question: 'Do I need to create an account?', answer: 'No! You can create and share wishes without signing up. An account is optional and gives you a dashboard to manage all your wishes, track views, and see reactions.' },
  { id: 'faq-2', question: 'Is Wishora free to use?', answer: 'Yes! All features are completely free. We believe everyone should be able to create beautiful wishes without any cost.' },
  { id: 'faq-3', question: 'How do I share my wish?', answer: 'After creating your wish, you get a unique link. Share it via WhatsApp, Instagram, SMS, email, or any messaging app. You can also share a QR code.' },
  { id: 'faq-4', question: 'Can the recipient interact with the wish?', answer: 'Absolutely! Depending on the template, recipients can pop balloons, blow candles, open gifts, play quizzes, vote in polls, and more. They can also send reactions and replies.' },
  { id: 'faq-5', question: 'Are my wishes private?', answer: 'By default, all wishes are private and only accessible to people with the direct link. You can optionally make a wish public on our Explore page.' },
  { id: 'faq-6', question: 'Can I edit a wish after publishing?', answer: 'Yes! You can edit your wish at any time. If you created it without an account, make sure to save your creator management link.' },
  { id: 'faq-7', question: 'Do wishes expire?', answer: 'You can choose an expiry: 24 hours, 7 days, 30 days, or never. By default, wishes don\'t expire.' },
];

function FAQSection() {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Questions? We&apos;ve got answers
          </h2>
        </div>
        <Accordion items={FAQ_ITEMS} />
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA
// ============================================

function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-plum opacity-95" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl opacity-20">✨</div>
        <div className="absolute top-20 right-20 text-3xl opacity-20">🎉</div>
        <div className="absolute bottom-10 left-1/4 text-3xl opacity-20">💕</div>
        <div className="absolute bottom-20 right-1/3 text-4xl opacity-20">🎁</div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Ready to make someone&apos;s day?
        </h2>
        <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
          Turn your simple wish into a magical moment. It takes less than 3 minutes and it&apos;s completely free.
        </p>
        <Link href="/create">
          <Button size="xl" variant="gold" className="text-lg px-12">
            ✨ Create Your First Wish
          </Button>
        </Link>
        <p className="text-sm text-white/50 mt-4">Free forever • No signup required • Share instantly</p>
      </div>
    </section>
  );
}

// ============================================
// HOMEPAGE
// ============================================

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OccasionSelector />
      <FeelingSection />
      <FeaturedTemplates />
      <HowItWorks />
      <InteractiveShowcase />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
