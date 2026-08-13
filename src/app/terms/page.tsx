import { Metadata } from 'next';
import { Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Terms of Service | Wishora',
  description: 'Terms and conditions for using Wishora.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ivory pb-20 pt-32">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-plum mb-4">Terms of Service</h1>
        <p className="text-charcoal-muted mb-12">Last Updated: October 15, 2024</p>

        <Card className="p-8 md:p-12 shadow-soft border-none bg-surface prose prose-plum max-w-none">
          <p className="text-lg leading-relaxed text-charcoal mb-8">
            Welcome to Wishora. By accessing or using our platform, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            By creating an account or using Wishora, you agree to these Terms. If you do not agree with any part of these terms, you may not use our services.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">2. Use of Service</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            You must be at least 13 years old to use Wishora. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">3. User Content</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            You retain all rights to the content you create and upload to Wishora. By posting content, you grant us a license to host, display, and distribute it for the sole purpose of providing the service.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">4. Prohibited Conduct</h2>
          <p className="mb-4 text-charcoal leading-relaxed">
            You agree not to use Wishora to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-charcoal space-y-2">
            <li>Upload harmful, abusive, harassing, or explicit content.</li>
            <li>Impersonate any person or entity.</li>
            <li>Distribute spam or malicious code.</li>
            <li>Violate any applicable laws or regulations.</li>
          </ul>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">5. Intellectual Property</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            The Wishora platform, including its original content, features, and functionality, is owned by Wishora and is protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">6. Limitation of Liability</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            In no event shall Wishora, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">7. Termination</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            We may terminate or suspend your account immediately, without prior notice, for any reason, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">8. Changes to Terms</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or prominent notice on our platform.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">9. Contact Us</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            If you have any questions about these Terms, please contact us at:
            <br />
            <a href="mailto:legal@wishora.app" className="text-coral hover:underline mt-2 inline-block">legal@wishora.app</a>
          </p>
        </Card>
      </div>
    </main>
  );
}
