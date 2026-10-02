'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { getLocalSession, clearLocalSession, saveLocalSession } from '@/lib/auth';

// ─────────────────────────────────────────────
// Auth Context Types
// ─────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  isDemoMode: false,
  signOut: async () => {},
  refreshSession: async () => {},
});

// ─────────────────────────────────────────────
// Auth Provider
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSignOut = useCallback(async () => {
    try {
      clearLocalSession();
      setUser(null);
      setSession(null);

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const local = getLocalSession();
      if (local) {
        setUser(local);
        setSession({
          access_token: 'wishora_demo_token',
          refresh_token: 'wishora_demo_refresh',
          expires_in: 3600 * 24 * 30,
          token_type: 'bearer',
          user: local,
        } as Session);
      }

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          saveLocalSession(currentSession.user);
        }
      }
    } catch (err) {
      console.warn('Refresh session notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial local session check (synchronous & instant)
    const initialLocal = getLocalSession();
    if (initialLocal && isMounted) {
      setUser(initialLocal);
      setSession({
        access_token: 'wishora_demo_token',
        refresh_token: 'wishora_demo_refresh',
        expires_in: 3600 * 24 * 30,
        token_type: 'bearer',
        user: initialLocal,
      } as Session);
      setIsLoading(false);
    }

    // 2. Listen to custom auth events
    const handleLocalAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<User | null>;
      if (!isMounted) return;
      const newUser = customEvent.detail ?? getLocalSession();
      if (newUser) {
        setUser(newUser);
        setSession({
          access_token: 'wishora_demo_token',
          refresh_token: 'wishora_demo_refresh',
          expires_in: 3600 * 24 * 30,
          token_type: 'bearer',
          user: newUser,
        } as Session);
      } else {
        setUser(null);
        setSession(null);
      }
      setIsLoading(false);
    };

    window.addEventListener('wishora:auth-change', handleLocalAuthChange);

    // 3. Supabase auth check (if configured)
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseBrowserClient();

        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
          if (isMounted) {
            if (initialSession?.user) {
              setSession(initialSession);
              setUser(initialSession.user);
              saveLocalSession(initialSession.user);
            }
            setIsLoading(false);
          }
        }).catch(() => {
          if (isMounted) setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            if (isMounted) {
              if (newSession?.user) {
                setSession(newSession);
                setUser(newSession.user);
                saveLocalSession(newSession.user);
              }
              setIsLoading(false);
            }
          }
        );

        return () => {
          isMounted = false;
          window.removeEventListener('wishora:auth-change', handleLocalAuthChange);
          subscription.unsubscribe();
        };
      } catch (err) {
        console.warn('Supabase client notice:', err);
        if (isMounted) setIsLoading(false);
      }
    } else {
      if (isMounted) setIsLoading(false);
    }

    return () => {
      isMounted = false;
      window.removeEventListener('wishora:auth-change', handleLocalAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        isDemoMode: !isSupabaseConfigured(),
        signOut: handleSignOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
