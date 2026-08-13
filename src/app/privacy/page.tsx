import { Metadata } from 'next';
import { Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Privacy Policy | Wishora',
  description: 'How Wishora collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ivory pb-20 pt-32">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-plum mb-4">Privacy Policy</h1>
        <p className="text-charcoal-muted mb-12">Last Updated: October 15, 2024</p>

        <Card className="p-8 md:p-12 shadow-soft border-none bg-surface prose prose-plum max-w-none">
          <p className="text-lg leading-relaxed text-charcoal mb-8">
            At Wishora, we believe that your privacy is a fundamental right. This policy outlines how we collect, use, and protect your information when you use our services.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">1. Information We Collect</h2>
          <p className="mb-4 text-charcoal leading-relaxed">
            We only collect information that is necessary to provide our services to you:
          </p>
          <ul className="list-disc pl-6 mb-6 text-charcoal space-y-2">
            <li><strong>Account Information:</strong> Name, email address, and authentication credentials when you create an account.</li>
            <li><strong>Content:</strong> Text, images, and other media you upload when creating a wish.</li>
            <li><strong>Usage Data:</strong> Basic analytics about how you interact with our platform to help us improve.</li>
          </ul>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">2. How We Use Information</h2>
          <p className="mb-4 text-charcoal leading-relaxed">
            Your information is used strictly to enhance your experience:
          </p>
          <ul className="list-disc pl-6 mb-6 text-charcoal space-y-2">
            <li>To provide and maintain the Wishora service.</li>
            <li>To notify you about changes to our platform.</li>
            <li>To provide customer support.</li>
            <li>To monitor the usage of the service to detect and prevent technical issues.</li>
          </ul>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">3. Data Sharing</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            We do not sell your personal data to third parties. We only share information with trusted service providers necessary for operating our platform (e.g., cloud hosting, email delivery) who are bound by strict confidentiality agreements.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">4. Data Security</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            The security of your data is important to us. We implement industry-standard security measures, including encryption and secure server infrastructure, to protect your personal information against unauthorized access or alteration.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">5. Your User Rights</h2>
          <p className="mb-4 text-charcoal leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-charcoal space-y-2">
            <li>Access the personal information we hold about you.</li>
            <li>Request corrections to your personal information.</li>
            <li>Request the deletion of your account and all associated data.</li>
            <li>Export your data in a portable format.</li>
          </ul>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">6. Cookies</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            We use essential cookies to keep you logged in and functional cookies to remember your preferences. We do not use third-party tracking cookies for advertising purposes.
          </p>

          <h2 className="text-2xl font-bold text-plum mt-10 mb-4">7. Contact Us</h2>
          <p className="mb-6 text-charcoal leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href="mailto:privacy@wishora.app" className="text-coral hover:underline mt-2 inline-block">privacy@wishora.app</a>
          </p>
        </Card>
      </div>
    </main>
  );
}
