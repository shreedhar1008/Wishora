import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-8xl mb-6 font-bold text-plum opacity-50">404</div>
      <h2 className="text-3xl font-bold tracking-tight text-charcoal mb-4">Page not found</h2>
      <p className="text-charcoal-muted mb-8 max-w-md mx-auto">
        Oops! It looks like this magical wish has disappeared into thin air, or the page you're looking for doesn't exist.
      </p>
      <Link href="/">
        <Button size="lg">Return Home ✨</Button>
      </Link>
    </div>
  );
}
