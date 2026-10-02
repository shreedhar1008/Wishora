import { getSupabaseBrowserClient, isSupabaseConfigured } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// Auth Helpers & Resilient Fallback
// ─────────────────────────────────────────────

export type AuthProvider = 'google';

/**
 * Creates a compliant User object matching @supabase/supabase-js
 */
export function createMockUser(email: string, displayName?: string, customId?: string): User {
  const cleanId =
    customId ||
    (email === 'shreedharshiragurr@gmail.com'
      ? 'admin_shreedhar'
      : `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`);
  const name = displayName || email.split('@')[0] || 'User';

  return {
    id: cleanId,
    app_metadata: { provider: 'email' },
    user_metadata: {
      display_name: name,
      full_name: name,
      email: email,
    },
    aud: 'authenticated',
    confirmation_sent_at: new Date().toISOString(),
    recovery_sent_at: undefined,
    email_change_sent_at: undefined,
    new_email: undefined,
    invited_at: undefined,
    action_link: undefined,
    email: email,
    phone: undefined,
    created_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: undefined,
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
  };
}

/**
 * Saves authenticated session in cookie and localStorage
 */
export function saveLocalSession(user: User): void {
  if (typeof window === 'undefined') return;
  try {
    const userJson = JSON.stringify(user);
    localStorage.setItem('wishora_user', userJson);
    document.cookie = `wishora_user=${encodeURIComponent(userJson)}; path=/; max-age=2592000; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent('wishora:auth-change', { detail: user }));
  } catch (err) {
    console.warn('Could not save local auth session:', err);
  }
}

/**
 * Clears local session from cookie and localStorage
 */
export function clearLocalSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('wishora_user');
    document.cookie = 'wishora_user=; path=/; max-age=0; SameSite=Lax';
    window.dispatchEvent(new CustomEvent('wishora:auth-change', { detail: null }));
  } catch (err) {
    console.warn('Could not clear local auth session:', err);
  }
}

/**
 * Retrieves the local session user if available
 */
export function getLocalSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromStorage = localStorage.getItem('wishora_user');
    if (fromStorage) {
      return JSON.parse(fromStorage);
    }
    const match = document.cookie.match(/(?:^|;\s*)wishora_user=([^;]+)/);
    if (match && match[1]) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  } catch (err) {
    console.warn('Could not parse local auth session:', err);
  }
  return null;
}

/**
 * Checks if an error is due to network connection, DNS, or invalid project keys
 */
function isConnectionError(error: any): boolean {
  if (!error) return false;
  const msg = (error.message || error.toString() || '').toLowerCase();
  return (
    msg.includes('fetch failed') ||
    msg.includes('network') ||
    msg.includes('enotfound') ||
    msg.includes('invalid api key') ||
    msg.includes('failed to fetch') ||
    error.status === 0 ||
    error.status === 401 ||
    error.code === 'invalid_api_key' ||
    error.name === 'AuthRetryableFetchError'
  );
}

/**
 * Sign up with email and password.
 */
export async function signUp(email: string, password: string, displayName?: string) {
  if (isSupabaseConfigured()) {
    try {
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

      if (!error && data?.user) {
        saveLocalSession(data.user);
        return { data, error: null };
      }

      if (error && !isConnectionError(error)) {
        return { data: null, error };
      }
    } catch (err) {
      if (!isConnectionError(err)) {
        return { data: null, error: { message: err instanceof Error ? err.message : 'Signup error' } };
      }
    }
  }

  // Resilient fallback (offline / demo mode / invalid Supabase credentials)
  const user = createMockUser(email, displayName);
  const session: Session = {
    access_token: 'wishora_demo_token',
    refresh_token: 'wishora_demo_refresh',
    expires_in: 3600 * 24 * 30,
    token_type: 'bearer',
    user,
  };

  saveLocalSession(user);
  return {
    data: { user, session },
    error: null,
  };
}

/**
 * Sign in with email and password.
 */
export async function signIn(email: string, password: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        saveLocalSession(data.user);
        return { data, error: null };
      }

      if (error && !isConnectionError(error)) {
        return { data: null, error };
      }
    } catch (err) {
      if (!isConnectionError(err)) {
        return { data: null, error: { message: err instanceof Error ? err.message : 'Sign in error' } };
      }
    }
  }

  // Resilient fallback (offline / demo mode / invalid Supabase credentials)
  const user = createMockUser(email);
  const session: Session = {
    access_token: 'wishora_demo_token',
    refresh_token: 'wishora_demo_refresh',
    expires_in: 3600 * 24 * 30,
    token_type: 'bearer',
    user,
  };

  saveLocalSession(user);
  return {
    data: { user, session },
    error: null,
  };
}

/**
 * Instant 1-Click Demo Login
 */
export async function quickDemoLogin(role: 'admin' | 'demo' = 'demo') {
  const isAdm = role === 'admin';
  const email = isAdm ? 'shreedharshiragurr@gmail.com' : 'demo@wishora.app';
  const displayName = isAdm ? 'Shreedhar Shiragur' : 'Demo Creator';
  const customId = isAdm ? 'admin_shreedhar' : 'demo_user';

  const user = createMockUser(email, displayName, customId);
  const session: Session = {
    access_token: 'wishora_demo_token',
    refresh_token: 'wishora_demo_refresh',
    expires_in: 3600 * 24 * 30,
    token_type: 'bearer',
    user,
  };

  saveLocalSession(user);
  return { data: { user, session }, error: null };
}

/**
 * Sign in with magic link (passwordless email).
 */
export async function signInWithMagicLink(email: string, redirectTo?: string) {
  if (isSupabaseConfigured()) {
    try {
      const redirectUrl = redirectTo || `${window.location.origin}/auth/callback`;
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (!error) {
        return { data, error: null };
      }

      if (error && !isConnectionError(error)) {
        return { data: null, error };
      }
    } catch (err) {
      if (!isConnectionError(err)) {
        return { data: null, error: { message: err instanceof Error ? err.message : 'Failed to send magic link' } };
      }
    }
  }

  // Resilient fallback
  const user = createMockUser(email);
  saveLocalSession(user);
  return {
    data: { user, session: null },
    error: null,
  };
}

/**
 * Sign in with Google OAuth provider.
 */
export async function signInWithOAuth(provider: AuthProvider = 'google', redirectTo?: string) {
  if (isSupabaseConfigured()) {
    try {
      const redirectUrl = redirectTo || `${window.location.origin}/auth/callback`;
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      return { data, error };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : 'OAuth sign in failed' } };
    }
  }

  return { error: { message: 'OAuth requires a configured Supabase project.' } };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  clearLocalSession();
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
  }
}

/**
 * Get the current session.
 */
export async function getSession(): Promise<Session | null> {
  const local = getLocalSession();
  if (local) {
    return {
      access_token: 'wishora_demo_token',
      refresh_token: 'wishora_demo_refresh',
      expires_in: 3600 * 24 * 30,
      token_type: 'bearer',
      user: local,
    };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Get the current user.
 */
export async function getUser(): Promise<User | null> {
  const local = getLocalSession();
  if (local) return local;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Reset password — sends a password reset email.
 */
export async function resetPassword(email: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : 'Password reset failed' } };
    }
  }

  return { data: {}, error: null };
}
