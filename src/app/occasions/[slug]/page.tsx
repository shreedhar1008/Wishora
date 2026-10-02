import { OCCASIONS } from '@/lib/templates/occasions';
import { TEMPLATES } from '@/lib/templates/definitions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export function generateStaticParams() {
  return OCCASIONS.map((occasion) => ({
    slug: occasion.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const occasion = OCCASIONS.find((o) => o.slug === unwrappedParams.slug);
  
  if (!occasion) {
    return {
      title: 'Occasion Not Found',
    };
  }

  return {
    title: occasion.seoTitle || `${occasion.title} Wishes | Wishora`,
    description: occasion.seoDescription || occasion.description,
  };
}

function getFaqs(occasionSlug: string, occasionTitle: string) {
  return [
    {
      question: `How do I create a ${occasionTitle.toLowerCase()} wish?`,
      answer: `Select a template below, fill in the details like recipient name and message, add any photos, and publish your wish. You'll get a unique link to share.`,
    },
    {
      question: `Can I add photos to my ${occasionTitle.toLowerCase()} wish?`,
      answer: `Yes! You can upload photos or select from our library of beautiful illustrations to make your wish more personal.`,
    },
    {
      question: `Is the wish link private?`,
      answer: `By default, wishes are accessible only via the unique link. You can optionally add a password for extra security.`,
    },
    {
      question: `Can the recipient reply to the wish?`,
      answer: `Yes, recipients can leave reactions and reply to your wish directly on the wish page.`,
    },
  ];
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = await params;
  const occasion = OCCASIONS.find((o) => o.slug === unwrappedParams.slug);

  if (!occasion) {
    notFound();
  }

  const target = occasion.slug.toLowerCase();
  const recommendedTemplates = Object.values(TEMPLATES).filter((t) => {
    const occ = t.occasion.toLowerCase();
    if (occ === target) return true;
    if (t.tags && t.tags.some((tag) => tag.toLowerCase() === target)) return true;
    if (t.category && t.category.toLowerCase() === target) return true;
    if (target === 'love' && (occ === 'romance' || occ === 'love')) return true;
    if (target === 'romance' && (occ === 'romance' || occ === 'love')) return true;
    if (target === 'congratulations' && (occ === 'celebration' || t.tags.includes('congratulations'))) return true;
    if (target === 'celebration' && (occ === 'congratulations' || t.tags.includes('celebration'))) return true;
    if (target === 'mothers-day' && (t.slug.includes('mom') || t.tags.includes('mothers-day'))) return true;
    if (target === 'fathers-day' && (t.slug.includes('dad') || t.tags.includes('fathers-day'))) return true;
    if (target === 'new-year' && (occ === 'new-year' || t.slug.includes('new-year'))) return true;
    if (target === 'thank-you' && (occ === 'thank-you' || t.slug.startsWith('thank-you'))) return true;
    if (target === 'friendship' && (occ === 'friendship' || t.category === 'fun')) return true;
    return false;
  }).slice(0, 6);

  const faqs = getFaqs(occasion.slug, occasion.title);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-6xl mb-6">{occasion.emoji}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-plum mb-6">{occasion.title}</h1>
        <p className="text-xl text-charcoal/80 mb-8">{occasion.description}</p>
        <Link href={`/create?occasion=${occasion.slug}`}>
          <Button size="lg" className="rounded-xl text-lg px-8">
            Create a {occasion.title} Wish
          </Button>
        </Link>
      </div>

      {occasion.exampleMessages && occasion.exampleMessages.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-plum text-center mb-10">Example Messages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {occasion.exampleMessages.slice(0, 3).map((message, i) => (
              <Card key={i} className="rounded-2xl shadow-soft bg-ivory border-none p-6">
                <p className="text-charcoal italic font-medium">&quot;{message}&quot;</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {recommendedTemplates.length > 0 && (
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-plum text-center mb-10">Recommended Templates</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendedTemplates.map((template) => (
              <Card key={template.id} padding="none" className="rounded-2xl shadow-soft overflow-hidden border-none flex flex-col h-full">
                <div
                  className="h-48 flex items-center justify-center"
                  style={{ background: template.previewGradient || 'linear-gradient(135deg, hsl(320, 60%, 30%), hsl(340, 65%, 55%))' }}
                >
                  <span className="text-5xl">{template.emoji}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-plum mb-2">{template.title}</h3>
                    <p className="text-charcoal/80 text-sm">{template.description}</p>
                  </div>
                  <Link href={`/create/${template.slug}`}>
                    <Button variant="outline" className="w-full rounded-xl border-plum text-plum hover:bg-plum hover:text-white">
                      Use Template
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-plum text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-lavender pb-6">
              <h3 className="text-xl font-bold text-charcoal mb-2">{faq.question}</h3>
              <p className="text-charcoal/80">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
