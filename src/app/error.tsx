'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h2 className="text-3xl font-bold tracking-tight text-charcoal mb-4">Something went wrong!</h2>
      <p className="text-charcoal-muted mb-8 max-w-md mx-auto">
        We've hit a slight bump in the road. Don't worry, our magical creatures are working on fixing it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => reset()} variant="primary">
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline">
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
