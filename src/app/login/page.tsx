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

          {/* OAuth Buttons */}
          {!isDemoMode && (
            <>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuth('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 border-border-light bg-surface hover:bg-surface-hover transition-all duration-200 font-medium text-charcoal disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-light" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-surface px-4 text-charcoal-muted">or</span>
                </div>
              </div>
            </>
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

          {/* Continue without account */}
          <div className="mt-6 text-center">
            <Link href="/create">
              <Button variant="ghost" className="w-full">
                Continue without account
              </Button>
            </Link>
          </div>
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
