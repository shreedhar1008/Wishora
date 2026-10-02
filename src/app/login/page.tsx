'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { signIn, signInWithMagicLink, signInWithOAuth, quickDemoLogin } from '@/lib/auth';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/dashboard';
  const errorParam = searchParams?.get('error');
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [error, setError] = useState(errorParam === 'auth_callback_failed' ? 'Authentication failed. Please try again.' : '');
  const [mode, setMode] = useState<'password' | 'magic'>('password');

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      window.location.href = redirect;
    }
  }, [isAuthenticated, isAuthLoading, redirect]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return;
      }

      // Fast, guaranteed redirect with cookies passed to server
      window.location.href = redirect;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'admin' | 'demo' = 'demo') => {
    setIsLoading(true);
    setError('');
    try {
      await quickDemoLogin(role);
      window.location.href = redirect;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`;
      const result = await signInWithMagicLink(email, callbackUrl);

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return;
      }

      setIsMagicLinkSent(true);
      setIsLoading(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send magic link';
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`;
      const result = await signInWithOAuth('google', callbackUrl);
      if (result.error) {
        if (result.error.message?.includes('provider is not enabled') || result.error.message?.includes('validation_failed') || result.error.message?.includes('requires a configured')) {
          setError('Google Sign-In is not enabled yet in your Supabase dashboard (Authentication > Providers > Google). You can log in using Email & Password or Instant Quick Login below.');
        } else {
          setError(result.error.message);
        }
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign in failed';
      setError(msg);
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
          <Link href={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-medium text-coral hover:text-coral-dark transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-elevated sm:rounded-3xl sm:px-10 bg-surface border-none">
          {/* Quick Demo Access Box */}
          <div className="mb-6 p-4 bg-plum-50/80 border border-plum-200 rounded-2xl text-center shadow-soft">
            <p className="text-xs font-semibold text-plum uppercase tracking-wider mb-2.5">
              ⚡ Instant 1-Click Access
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => handleQuickDemoLogin('demo')}
                className="w-full text-xs font-semibold border-plum-300 text-plum hover:bg-plum hover:text-white transition-all"
              >
                ✨ Demo Creator
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => handleQuickDemoLogin('admin')}
                className="w-full text-xs font-semibold border-plum-300 text-plum hover:bg-plum hover:text-white transition-all"
              >
                👑 Admin User
              </Button>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left">
              <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="mb-6">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-border-light bg-surface hover:bg-surface-hover hover:border-plum/30 transition-all font-medium text-charcoal shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-charcoal-muted">Or continue with</span>
            </div>
          </div>

          {/* Mode toggle */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              {/* Quick fill presets */}
              <div className="flex flex-wrap gap-1.5 items-center text-xs text-charcoal-muted">
                <span>Quick fill:</span>
                <button
                  type="button"
                  onClick={() => { setEmail('demo@wishora.app'); setPassword('demo123456'); }}
                  className="px-2 py-0.5 rounded-lg bg-surface-hover hover:bg-plum-100 hover:text-plum transition-colors font-mono text-[11px]"
                >
                  demo@wishora.app
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('shreedharshiragurr@gmail.com'); setPassword('admin123456'); }}
                  className="px-2 py-0.5 rounded-lg bg-surface-hover hover:bg-plum-100 hover:text-plum transition-colors font-mono text-[11px]"
                >
                  admin email
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-border-light text-plum focus:ring-plum"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-charcoal-muted">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('magic')}
                  className="text-sm font-medium text-plum hover:text-plum-light"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
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
                  disabled={isLoading}
                />
              </div>

              <p className="text-xs text-charcoal-muted">
                We&apos;ll send you a magic link to sign in — no password needed! ✨
              </p>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
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
