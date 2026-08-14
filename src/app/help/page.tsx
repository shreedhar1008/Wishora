import { Metadata } from 'next';
import Link from 'next/link';
import { Input, Accordion, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Help Center | Wishora',
  description: 'Find answers to common questions about using Wishora.',
};

export default function HelpPage() {
  const faqs = [
    { id: '1', category: 'Getting Started', question: 'What is Wishora?', answer: 'Wishora is a platform for creating personalized, interactive digital wishes and greetings for your loved ones.' },
    { id: '2', category: 'Getting Started', question: 'Is Wishora free to use?', answer: 'Yes! All core features of Wishora are completely free to use.' },
    { id: '3', category: 'Getting Started', question: 'Do I need an account to create a wish?', answer: 'No, you can create a wish as a guest. However, creating an account allows you to save and manage your wishes.' },
    
    { id: '4', category: 'Creating Wishes', question: 'How do I add a photo to my wish?', answer: 'In the wish editor, click the "Add Media" button to upload photos from your device.' },
    { id: '5', category: 'Creating Wishes', question: 'Can I change the template after starting?', answer: 'Yes, you can switch templates anytime in the editor without losing your text content.' },
    { id: '6', category: 'Creating Wishes', question: 'Are there character limits for messages?', answer: 'Messages are limited to 2,000 characters to ensure they display beautifully across all devices.' },
    
    { id: '7', category: 'Sharing', question: 'How do I send my wish to someone?', answer: 'Once published, you will get a unique link that you can share via text, email, or social media.' },
    { id: '8', category: 'Sharing', question: 'Can I schedule a wish to be sent later?', answer: 'Currently, wishes are instantly available upon publishing. We recommend saving as a draft and publishing on the day.' },
    { id: '9', category: 'Sharing', question: 'Will the recipient need an account to view it?', answer: 'Not at all! Anyone with the link can view your wish instantly in their browser.' },
    
    { id: '10', category: 'Account', question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login screen to receive a reset link.' },
    { id: '11', category: 'Account', question: 'Can I delete a wish after publishing it?', answer: 'Yes, you can unpublish or permanently delete any wish from your dashboard.' },
    { id: '12', category: 'Account', question: 'How can I change my email address?', answer: 'You can update your account information in the Settings section of your dashboard.' },
    
    { id: '13', category: 'Privacy', question: 'Who can see my published wishes?', answer: 'Wishes are unlisted by default, meaning only people with the specific link can view them.' },
    { id: '14', category: 'Privacy', question: 'Is my data sold to third parties?', answer: 'No, we never sell your personal data or the content of your wishes to advertisers.' },
    { id: '15', category: 'Privacy', question: 'How do I delete my account permanently?', answer: 'You can delete your account and all associated data from the Settings page in your dashboard.' },
  ];

  const categories = ['Getting Started', 'Creating Wishes', 'Sharing', 'Account', 'Privacy'];

  return (
    <main className="min-h-screen bg-ivory pb-20 pt-32">
      <div className="max-w-4xl mx-auto px-6">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-plum mb-6">Help Center</h1>
          <div className="max-w-xl mx-auto relative">
            <Input 
              placeholder="Search for answers..." 
              className="pl-12 py-6 text-lg rounded-2xl shadow-soft"
            />
            <svg 
              className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        <div className="space-y-16">
          {categories.map(category => {
            const categoryFaqs = faqs.filter(faq => faq.category === category);
            return (
              <section key={category}>
                <h2 className="text-2xl font-bold text-plum mb-6">{category}</h2>
                <Accordion items={categoryFaqs} />
              </section>
            );
          })}
        </div>

        <Card className="mt-20 p-8 text-center bg-lavender border-none shadow-soft">
          <h3 className="text-xl font-bold text-plum mb-2">Still need help?</h3>
          <p className="text-charcoal-muted mb-6">We&apos;re here to assist you with any questions.</p>
          <Link href="/contact" className="inline-block bg-plum text-white px-6 py-3 rounded-xl font-semibold hover:bg-plum-light transition-colors">
            Contact Support
          </Link>
        </Card>
      </div>
    </main>
  );
}
