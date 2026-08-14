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
          <h2 className="text-3xl font-bold text-plum text-center mb-6">Meet the Developer</h2>
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center bg-surface p-8 rounded-3xl shadow-soft">
            <Avatar fallback="SS" size="lg" className="mb-6 h-32 w-32 text-4xl bg-coral text-white" />
            <h3 className="text-2xl font-bold text-charcoal mb-2">Shreedhar Shiragur</h3>
            <p className="text-lg text-plum font-medium mb-6">Creator & Full-Stack Developer</p>
            <p className="text-charcoal-muted mb-8 leading-relaxed">
              I built Wishora to bring more meaning and interaction to our digital greetings. As a sole developer, I poured my passion for beautifully crafted user experiences into every template and feature. Let's connect!
            </p>
            
            <div className="w-full border-t border-border-light pt-6">
              <h4 className="text-sm font-bold text-charcoal-muted uppercase tracking-wider mb-4">Connect & Follow</h4>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:shreedharshiragurr@gmail.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-lavender text-plum rounded-xl hover:bg-plum hover:text-white transition-colors font-medium">
                  Email
                </a>
                <a href="https://www.linkedin.com/in/shreedhar-shiragur/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-lavender text-plum rounded-xl hover:bg-plum hover:text-white transition-colors font-medium">
                  LinkedIn
                </a>
                <a href="https://www.instagram.com/man_of_million__hearts/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-lavender text-plum rounded-xl hover:bg-plum hover:text-white transition-colors font-medium">
                  Instagram
                </a>
                <a href="https://shreedharshiragur.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-lavender text-plum rounded-xl hover:bg-plum hover:text-white transition-colors font-medium">
                  Portfolio
                </a>
              </div>
            </div>
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
