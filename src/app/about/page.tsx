import { Metadata } from 'next';
import Link from 'next/link';
import { Button, Avatar, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About | Wishora',
  description: 'Learn about Wishora, our mission, and the team behind digital, memorable wishes.',
};

export default function AboutPage() {
  const values = [
    { title: 'Creativity', desc: 'Providing expressive templates for everyone.' },
    { title: 'Inclusivity', desc: 'Building experiences accessible to all.' },
    { title: 'Privacy', desc: 'Your data is yours. We respect your boundaries.' },
    { title: 'Joy', desc: 'Focusing on what matters most: human connection.' },
  ];

  const team = [
    { name: 'Alex Rivera', role: 'Founder & CEO', initials: 'AR' },
    { name: 'Sam Taylor', role: 'Head of Design', initials: 'ST' },
    { name: 'Jordan Lee', role: 'Lead Engineer', initials: 'JL' },
  ];

  return (
    <main className="min-h-screen bg-ivory pb-20 pt-32">
      <div className="max-w-5xl mx-auto px-6">
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-bold text-plum mb-6 tracking-tight">About Wishora</h1>
          <p className="text-xl md:text-2xl text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
            Making digital wishes deeply personal, beautifully interactive, and truly memorable.
          </p>
        </section>

        <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-plum">Our Story</h2>
            <p className="text-lg text-charcoal leading-relaxed">
              We started Wishora because we noticed a gap in how we celebrate each other online. Text messages feel fleeting, and generic e-cards lack soul.
            </p>
            <p className="text-lg text-charcoal leading-relaxed">
              We wanted to build a space where digital greetings could hold the same weight and warmth as a handwritten letter, paired with the interactive magic of the web.
            </p>
          </div>
          <div className="bg-lavender rounded-3xl p-8 aspect-square flex items-center justify-center">
            <div className="text-6xl">✨</div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-plum text-center mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="p-6 bg-surface border-none shadow-soft text-center h-full">
                <h3 className="text-xl font-bold text-coral mb-3">{v.title}</h3>
                <p className="text-charcoal-muted">{v.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-plum text-center mb-12">Meet the Team</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center max-w-3xl mx-auto">
            {team.map((t) => (
              <div key={t.name} className="flex flex-col items-center">
                <Avatar fallback={t.initials} size="lg" className="mb-4 h-24 w-24 text-2xl bg-coral text-white" />
                <h3 className="text-xl font-bold text-charcoal">{t.name}</h3>
                <p className="text-charcoal-muted">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center bg-plum text-white rounded-3xl p-12 shadow-soft">
          <h2 className="text-3xl font-bold mb-6">Ready to spread some joy?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-lg mx-auto">Join thousands of others who are making their digital greetings special.</p>
          <Link href="/create">
            <Button variant="secondary" size="lg" className="bg-coral hover:bg-coral-dark">
              Create a Wish
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
