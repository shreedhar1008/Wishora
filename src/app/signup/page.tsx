'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { signUp, signInWithOAuth, quickDemoLogin } from '@/lib/auth';

function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/dashboard';
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      window.location.href = redirect;
    }
  }, [isAuthenticated, isAuthLoading, redirect]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signUp(email, password, name);

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return;
      }

      // If session is immediately created
      if (result.data?.session || result.data?.user) {
        window.location.href = redirect;
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed';
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
      setError(err instanceof Error ? err.message : 'Demo access failed');
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`;
      const result = await signInWithOAuth('google', callbackUrl);
      if (result.error) {
        if (result.error.message?.includes('provider is not enabled') || result.error.message?.includes('validation_failed') || result.error.message?.includes('requires a configured')) {
          setError('Google Sign-In is not enabled yet in your Supabase dashboard (Authentication > Providers > Google). You can create an account using Email & Password or Instant Quick Access below.');
        } else {
          setError(result.error.message);
        }
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign up failed';
      setError(msg);
      setIsLoading(false);
    }
  };

  // Success screen — check your email
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold tracking-tight text-charcoal">Account created!</h2>
          <p className="mt-4 text-charcoal-muted max-w-sm mx-auto">
            We sent a confirmation email to <strong className="text-charcoal">{email}</strong>.
            Please check your inbox and click the link to verify your account.
          </p>
          <div className="mt-8 space-y-3">
            <Link href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}>
              <Button size="lg" className="w-full max-w-xs mx-auto">Go to Login</Button>
            </Link>
          </div>
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
        <h2 className="text-3xl font-bold tracking-tight text-charcoal">Create your account</h2>
        <p className="mt-2 text-charcoal-muted">
          Already have an account?{' '}
          <Link href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-medium text-coral hover:text-coral-dark transition-colors">
            Log in
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
              onClick={handleGoogleSignUp}
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
              <span className="bg-surface px-2 text-charcoal-muted">Or sign up with email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-charcoal mb-1.5">
                Email address
              </label>
              <Input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-charcoal mb-1.5">
                Password
              </label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <p className="mt-1.5 text-xs text-charcoal-muted">Minimum 6 characters</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-charcoal-muted">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-plum hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-plum hover:underline">Privacy Policy</Link>.
          </p>
        </Card>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">Loading...</div>}>
      <SignupForm />
    </React.Suspense>
  );
}
