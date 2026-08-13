import { Metadata } from 'next';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Log In | Wishora',
  description: 'Log in to your Wishora account.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block text-3xl font-bold text-plum mb-6">
          Wishora
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-charcoal">Welcome back</h2>
        <p className="mt-2 text-charcoal-muted">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-coral hover:text-coral-dark transition-colors">
            Sign up
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
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-light text-plum focus:ring-plum"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-charcoal-muted">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-plum hover:text-plum-light">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button type="button" className="w-full" size="lg">
                Log in
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
