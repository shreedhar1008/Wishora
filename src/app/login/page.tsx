'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { signIn, signInWithMagicLink, signInWithOAuth } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/dashboard';
  const errorParam = searchParams?.get('error');
  const { isDemoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [error, setError] = useState(errorParam === 'auth_callback_failed' ? 'Authentication failed. Please try again.' : '');
  const [mode, setMode] = useState<'password' | 'magic'>('password');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    router.push(redirect);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    const result = await signInWithMagicLink(email);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    setIsMagicLinkSent(true);
    setIsLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError('');
    const result = await signInWithOAuth(provider);
    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
    }
  };

  if (isMagicLinkSent) {
    return (
      <main className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="text-6xl mb-6">✉️</div>
          <h2 className="text-3xl font-bold tracking-tight text-charcoal">Check your email</h2>
          <p className="mt-4 text-charcoal-muted max-w-sm mx-auto">
            We sent a magic link to <strong className="text-charcoal">{email}</strong>. 
            Click the link in the email to sign in.
          </p>
          <button 
            onClick={() => setIsMagicLinkSent(false)} 
            className="mt-6 text-sm font-medium text-coral hover:text-coral-dark transition-colors"
          >
            ← Back to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block text-3xl font-bold text-plum mb-6">
          Wishora
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-charcoal">Welcome back</h2>
        <p className="mt-2 text-charcoal-muted">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-coral hover:text-coral-dark transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-elevated sm:rounded-3xl sm:px-10 bg-surface border-none">
          {/* Demo mode banner */}
          {isDemoMode && (
            <div className="bg-amber/10 border border-amber/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 text-center font-medium">
                🔧 Demo mode — Set Supabase credentials in <code className="bg-amber/10 px-1.5 py-0.5 rounded text-xs">.env.local</code> to enable authentication
              </p>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-700 text-center font-medium">{error}</p>
            </div>
          )}



          {/* Mode toggle */}
          {!isDemoMode && (
            <div className="flex rounded-2xl bg-surface-hover p-1 mb-6">
              <button
                onClick={() => setMode('password')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  mode === 'password'
                    ? 'bg-surface shadow-soft text-charcoal'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Password
              </button>
              <button
                onClick={() => setMode('magic')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  mode === 'magic'
                    ? 'bg-surface shadow-soft text-charcoal'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Magic Link ✨
              </button>
            </div>
          )}

          {/* Password Login Form */}
          {mode === 'password' && (
            <form className="space-y-5" onSubmit={handlePasswordLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isDemoMode || isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isDemoMode || isLoading}
                />
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
                <Link href="/login?mode=magic" className="text-sm font-medium text-plum hover:text-plum-light">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isDemoMode || isLoading}>
                {isLoading ? 'Signing in…' : 'Log in'}
              </Button>
            </form>
          )}

          {/* Magic Link Form */}
          {mode === 'magic' && (
            <form className="space-y-5" onSubmit={handleMagicLink}>
              <div>
                <label htmlFor="magic-email" className="block text-sm font-medium text-charcoal mb-1.5">
                  Email address
                </label>
                <Input
                  id="magic-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isDemoMode || isLoading}
                />
              </div>

              <p className="text-xs text-charcoal-muted">
                We&apos;ll send you a magic link to sign in — no password needed! ✨
              </p>

              <Button type="submit" className="w-full" size="lg" disabled={isDemoMode || isLoading}>
                {isLoading ? 'Sending…' : 'Send Magic Link'}
              </Button>
            </form>
          )}


        </Card>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
