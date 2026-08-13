import { Metadata } from 'next';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Sign Up | Wishora',
  description: 'Create a new Wishora account.',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block text-3xl font-bold text-plum mb-6">
          Wishora
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-charcoal">Create your account</h2>
        <p className="mt-2 text-charcoal-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-coral hover:text-coral-dark transition-colors">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-elevated sm:rounded-3xl sm:px-10 bg-surface border-none">
          <div className="bg-amber/10 border border-amber/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 text-center font-medium">
              Demo mode: Authentication requires Supabase configuration. This form is non-functional.
            </p>
          </div>

          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal">
                Full Name
              </label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button type="button" className="w-full" size="lg">
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-surface px-2 text-charcoal-muted">Or</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/create">
                <Button variant="ghost" className="w-full">
                  Continue without account
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
