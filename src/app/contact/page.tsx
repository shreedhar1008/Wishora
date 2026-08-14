import { Metadata } from 'next';
import { Button, Input, Textarea, Card, Accordion } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Contact Us | Wishora',
  description: 'Get in touch with the Wishora team.',
};

export default function ContactPage() {
  const faqs = [
    {
      id: '1',
      question: 'How fast do you respond?',
      answer: 'We typically respond to all inquiries within 24-48 business hours.',
    },
    {
      id: '2',
      question: 'Do you offer custom enterprise plans?',
      answer: 'Yes! Please reach out using the contact form and mention "Enterprise" in the subject line.',
    },
    {
      id: '3',
      question: 'I found a bug, where can I report it?',
      answer: 'You can use this form to report any issues. Please include as much detail as possible, including your device and browser.',
    },
  ];

  return (
    <main className="min-h-screen bg-ivory pb-20 pt-32">
      <div className="max-w-5xl mx-auto px-6">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-plum mb-4">Contact Us</h1>
          <p className="text-lg text-charcoal-muted max-w-2xl mx-auto">
            We&apos;d love to hear from you. Please fill out the form below or email us directly.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div>
            <Card className="p-8 shadow-soft border-none bg-surface">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">Name</label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">Email</label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-1">Subject</label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1">Message</label>
                  <Textarea id="message" placeholder="Write your message here..." rows={5} />
                </div>
                <Button className="w-full mt-2" size="lg">Send Message</Button>
              </form>
            </Card>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-plum mb-4">Direct Contact</h2>
              <p className="text-charcoal-muted mb-2">Prefer to email us directly?</p>
              <a href="mailto:hello@wishora.app" className="text-coral font-semibold text-lg hover:underline">
                hello@wishora.app
              </a>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-plum mb-6">Common Questions</h2>
              <Accordion items={faqs} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
