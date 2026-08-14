import { getSupabaseBrowserClient, isSupabaseConfigured } from './supabase';

// ─────────────────────────────────────────────
// Auth Helpers (Client-Side)
// ─────────────────────────────────────────────

export type AuthProvider = 'google' | 'github';

/**
 * Sign up with email and password.
 */
export async function signUp(email: string, password: string, displayName?: string) {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Authentication requires Supabase configuration.' } };
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0],
      },
    },
  });

  return { data, error };
}

/**
 * Sign in with email and password.
 */
export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Authentication requires Supabase configuration.' } };
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign in with magic link (passwordless email).
 */
export async function signInWithMagicLink(email: string) {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Authentication requires Supabase configuration.' } };
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

/**
 * Sign in with an OAuth provider (Google, GitHub).
 */
export async function signInWithOAuth(provider: AuthProvider) {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Authentication requires Supabase configuration.' } };
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseBrowserClient();
  await supabase.auth.signOut();
}

/**
 * Get the current session.
 */
export async function getSession() {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user.
 */
export async function getUser() {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Reset password — sends a password reset email.
 */
export async function resetPassword(email: string) {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Authentication requires Supabase configuration.' } };
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
  });

  return { data, error };
}
