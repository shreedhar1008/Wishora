'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Dialog } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { saveLocalSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, refreshSession, signOut } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [marketingEmail, setMarketingEmail] = useState(false);
  const [activityEmail, setActivityEmail] = useState(true);
  const [reminderEmail, setReminderEmail] = useState(true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
      setDisplayName(name);
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      if (isSupabaseConfigured()) {
        try {
          const supabase = getSupabaseBrowserClient();
          await supabase.auth.updateUser({
            data: { display_name: displayName }
          });
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            display_name: displayName,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        } catch (supaErr) {
          console.warn('Supabase profile update notice:', supaErr);
        }
      }

      // Always update local session so UI updates immediately
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          display_name: displayName,
          full_name: displayName,
        },
      };
      saveLocalSession(updatedUser);
      await refreshSession();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    setPrefSuccess(false);
    try {
      if (user && isSupabaseConfigured()) {
        try {
          const supabase = getSupabaseBrowserClient();
          await supabase.auth.updateUser({
            data: {
              preferences: {
                marketing: marketingEmail,
                activity: activityEmail,
                reminders: reminderEmail,
              }
            }
          });
        } catch {
          // offline
        }
      }
      setPrefSuccess(true);
      setTimeout(() => setPrefSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Account delete/signout error:', err);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-plum">Settings</h1>
        <p className="text-charcoal-muted mt-1">Manage your account preferences and profile details.</p>
      </div>

      {/* Profile Form */}
      <Card className="p-6 md:p-8 border-none shadow-soft bg-surface">
        <h2 className="text-xl font-bold text-charcoal mb-6">Profile Information</h2>
        
        {saveSuccess && (
          <div className="bg-emerald/10 border border-emerald/20 text-emerald-800 text-sm rounded-xl p-4 mb-6">
            ✅ Profile updated successfully!
          </div>
        )}

        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-6">
            {saveError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSaveProfile}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
              <Input
                type="email"
                value={email}
                disabled
                className="bg-ivory text-charcoal-muted cursor-not-allowed"
              />
              <span className="text-[11px] text-charcoal-muted mt-1 block">Email is linked to your account credentials.</span>
            </div>
          </div>
          <Button type="submit" isLoading={isSaving}>
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 md:p-8 border-none shadow-soft bg-surface">
        <h2 className="text-xl font-bold text-charcoal mb-6">Notification Preferences</h2>

        {prefSuccess && (
          <div className="bg-emerald/10 border border-emerald/20 text-emerald-800 text-sm rounded-xl p-4 mb-6">
            ✅ Preferences saved!
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="activity"
                type="checkbox"
                checked={activityEmail}
                onChange={(e) => setActivityEmail(e.target.checked)}
                className="h-5 w-5 rounded border-border-light text-plum focus:ring-plum"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="activity" className="text-sm font-medium text-charcoal">Wish activity</label>
              <p className="text-sm text-charcoal-muted">Get notified when someone views, reacts to, or replies to your wish.</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="reminders"
                type="checkbox"
                checked={reminderEmail}
                onChange={(e) => setReminderEmail(e.target.checked)}
                className="h-5 w-5 rounded border-border-light text-plum focus:ring-plum"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="reminders" className="text-sm font-medium text-charcoal">Occasion reminders</label>
              <p className="text-sm text-charcoal-muted">Helpful reminders for upcoming special dates and occasions.</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="marketing"
                type="checkbox"
                checked={marketingEmail}
                onChange={(e) => setMarketingEmail(e.target.checked)}
                className="h-5 w-5 rounded border-border-light text-plum focus:ring-plum"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="marketing" className="text-sm font-medium text-charcoal">Product updates</label>
              <p className="text-sm text-charcoal-muted">Receive news, new template releases, and seasonal updates.</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSavePreferences} isLoading={isSavingPrefs} variant="secondary">
            Update Preferences
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 md:p-8 border-none shadow-soft bg-rose/10 border-rose/20">
        <h2 className="text-xl font-bold text-red mb-2">Danger Zone</h2>
        <p className="text-charcoal-muted mb-6 text-sm">
          Once you sign out or delete your session, you will need to log back in to access your wishes.
        </p>
        <Button variant="danger" onClick={() => setIsDeleteDialogOpen(true)}>
          Sign Out / Delete Account
        </Button>
      </Card>

      <Dialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Sign Out or Remove Account"
        description="Are you sure you want to proceed?"
      >
        <div className="space-y-4">
          <p className="text-sm text-charcoal-muted">
            This will sign you out of Wishora on this device and end your active session.
          </p>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAccount} isLoading={isDeleting}>
              Sign Out
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
