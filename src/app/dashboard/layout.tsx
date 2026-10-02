'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'My Wishes', href: '/dashboard/wishes', icon: '✨' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row pt-16">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border-light fixed h-[calc(100vh-64px)] z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold text-plum">Dashboard</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium',
                  isActive
                    ? 'bg-plum text-white shadow-soft'
                    : 'text-charcoal-muted hover:bg-plum-50 hover:text-plum'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 pb-24 md:pb-10">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-light pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full space-y-1',
                  isActive ? 'text-plum' : 'text-charcoal-muted'
                )}
              >
                <span className={cn("text-xl", isActive ? "scale-110 transition-transform" : "")}>{item.icon}</span>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
