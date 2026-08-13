'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Dialog } from '@/components/ui';

export default function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-plum">Settings</h1>
        <p className="text-charcoal-muted mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="bg-amber/10 border border-amber/20 rounded-xl p-4">
        <p className="text-sm text-amber-800 font-medium">
          Demo mode: All settings are currently read-only. Authentication integration is required to save changes.
        </p>
      </div>

      <Card className="p-6 md:p-8 border-none shadow-soft bg-surface">
        <h2 className="text-xl font-bold text-charcoal mb-6">Profile Information</h2>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Display Name</label>
              <Input defaultValue="Demo User" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
              <Input type="email" defaultValue="demo@wishora.app" disabled />
            </div>
          </div>
          <Button disabled>Save Changes</Button>
        </form>
      </Card>

      <Card className="p-6 md:p-8 border-none shadow-soft bg-surface">
        <h2 className="text-xl font-bold text-charcoal mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { id: 'marketing', label: 'Marketing emails', desc: 'Receive news, special offers, and updates about Wishora.' },
            { id: 'activity', label: 'Wish activity', desc: 'Get notified when someone views or reacts to your wish.' },
            { id: 'reminders', label: 'Occasion reminders', desc: 'Reminders for upcoming birthdays and anniversaries.' },
          ].map((pref) => (
            <div key={pref.id} className="flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id={pref.id}
                  type="checkbox"
                  defaultChecked={pref.id !== 'marketing'}
                  disabled
                  className="h-5 w-5 rounded border-border-light text-plum focus:ring-plum"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={pref.id} className="text-sm font-medium text-charcoal">{pref.label}</label>
                <p className="text-sm text-charcoal-muted">{pref.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button disabled>Update Preferences</Button>
        </div>
      </Card>

      <Card className="p-6 md:p-8 border-none shadow-soft bg-rose/10 border-rose/20">
        <h2 className="text-xl font-bold text-red mb-2">Danger Zone</h2>
        <p className="text-charcoal-muted mb-6 text-sm">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="danger" onClick={() => setIsDeleteDialogOpen(true)}>
          Delete Account
        </Button>
      </Card>

      <Dialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Account"
        description="Are you absolutely sure you want to do this?"
      >
        <div className="space-y-4">
          <p className="text-sm text-charcoal-muted">
            This action cannot be undone. This will permanently delete your account and remove your data from our servers, including all your wishes.
          </p>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="danger" disabled>Yes, delete my account</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
