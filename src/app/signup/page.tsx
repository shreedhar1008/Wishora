'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { signUp, signInWithOAuth } from '@/lib/auth';

export default function SignupPage() {
  const { isDemoMode } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await signUp(email, password, name);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
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
            <Link href="/login">
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
          <Link href="/login" className="font-medium text-coral hover:text-coral-dark transition-colors">
            Log in
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
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDemoMode || isLoading}
              onClick={() => handleOAuth('google')}
              className="w-full flex items-center justify-center gap-2"
            >
              <span>Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDemoMode || isLoading}
              onClick={() => handleOAuth('github')}
              className="w-full flex items-center justify-center gap-2"
            >
              <span>GitHub</span>
            </Button>
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
                disabled={isDemoMode || isLoading}
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
                disabled={isDemoMode || isLoading}
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
                disabled={isDemoMode || isLoading}
              />
              <p className="mt-1.5 text-xs text-charcoal-muted">Minimum 6 characters</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isDemoMode || isLoading}>
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
