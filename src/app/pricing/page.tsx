import { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, Badge, Accordion } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Pricing | Wishora',
  description: 'Simple, transparent pricing. Create beautiful digital wishes for free.',
};

export default function PricingPage() {
  const faqs = [
    {
      id: '1',
      question: 'Is Wishora really free?',
      answer: 'Yes! All of our core features, including templates, photo uploads, and sharing, are 100% free forever.',
    },
    {
      id: '2',
      question: 'What will the Premium tier include?',
      answer: 'Premium will eventually include advanced features like video uploads, custom domains for your wishes, and removing the Wishora watermark. But right now, we are focused on making the free experience perfect.',
    },
    {
      id: '3',
      question: 'Do I need a credit card to sign up?',
      answer: 'No credit card is required to sign up or use Wishora.',
    },
  ];

  return (
    <main className="min-h-screen bg-ivory pb-20 pt-32">
      <div className="max-w-5xl mx-auto px-6">
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-plum mb-6 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-xl text-charcoal-muted max-w-2xl mx-auto">
            Spread joy without worrying about the cost. Everything you need to create meaningful wishes is completely free.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
          <Card className="p-8 border-2 border-plum bg-surface shadow-elevated relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 bg-plum text-white px-4 py-1 text-sm font-bold rounded-bl-xl">
              CURRENT
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Free Plan</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-plum">$0</span>
              <span className="text-charcoal-muted ml-2">forever</span>
            </div>
            <p className="text-charcoal-muted mb-8">Everything you need to create and share beautiful interactive wishes.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited wishes', 'All premium templates', 'Photo uploads', 'Interactive animations', 'Instant sharing', 'Dashboard analytics'].map(feature => (
                <li key={feature} className="flex items-center text-charcoal">
                  <svg className="w-5 h-5 text-emerald mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/create" className="w-full">
              <Button size="lg" className="w-full">Start Creating for Free</Button>
            </Link>
          </Card>

          <Card className="p-8 border border-border-light bg-surface/50 opacity-90 relative flex flex-col">
            <Badge className="absolute top-6 right-6 bg-gold text-charcoal font-bold">Coming Soon</Badge>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Premium</h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-charcoal-muted">TBA</span>
            </div>
            <p className="text-charcoal-muted mb-8">Advanced features for power users and special occasions.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Video uploads', 'Custom domains (yourname.com)', 'No Wishora branding', 'Advanced analytics', 'Scheduled sending', 'Priority support'].map(feature => (
                <li key={feature} className="flex items-center text-charcoal-muted">
                  <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Button size="lg" variant="outline" className="w-full" disabled>Join Waitlist</Button>
          </Card>
        </div>

        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-plum mb-10">Frequently Asked Questions</h2>
          <div className="text-left">
            <Accordion items={faqs} />
          </div>
        </section>
      </div>
    </main>
  );
}
