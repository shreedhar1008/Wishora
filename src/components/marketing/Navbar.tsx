'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';

const NAV_LINKS = [
  { href: '/templates', label: 'Templates' },
  { href: '/explore', label: 'Explore' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut: handleSignOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const userInitials = React.useMemo(() => {
    if (!user) return '?';
    const name = user.user_metadata?.display_name || user.email || '';
    return name
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0]?.toUpperCase())
      .join('');
  }, [user]);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide nav on wish viewer pages
  if (pathname?.startsWith('/w/')) return null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-surface/90 backdrop-blur-lg shadow-soft border-b border-border-light'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Wishora home">
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="transition-transform group-hover:scale-110">
              <circle cx="16" cy="16" r="14" fill="url(#logoGrad)" />
              <path
                d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M14 13L16 10L18 13"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
              <circle cx="21" cy="9" r="1.5" fill="#FFD700" opacity="0.8" className="animate-sparkle" />
              <circle cx="24" cy="12" r="1" fill="#FFD700" opacity="0.6" className="animate-sparkle" style={{ animationDelay: '0.5s' }} />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="hsl(320, 60%, 30%)" />
                  <stop offset="100%" stopColor="hsl(340, 65%, 55%)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text-plum">Wishora</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-plum',
                pathname === link.href ? 'text-plum' : 'text-charcoal-light'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/create">
                <Button variant="primary" size="sm">
                  ✨ Create a Wish
                </Button>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full gradient-plum text-white text-xs font-bold flex items-center justify-center hover:shadow-md transition-shadow"
                  aria-label="User menu"
                >
                  {userInitials}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-elevated border border-border-light py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-border-light">
                      <p className="text-sm font-medium text-charcoal truncate">{user?.user_metadata?.display_name || 'Creator'}</p>
                      <p className="text-xs text-charcoal-muted truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-charcoal hover:bg-ivory transition-colors"
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      href="/create"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-charcoal hover:bg-ivory transition-colors"
                    >
                      ✨ Create Wish
                    </Link>
                    <button
                      onClick={async () => {
                        setIsProfileOpen(false);
                        await handleSignOut();
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/create">
                <Button variant="primary" size="sm">
                  ✨ Create a Wish
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-plum-50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal">
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border-light shadow-elevated animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-plum-50 text-plum'
                    : 'text-charcoal hover:bg-ivory'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border-light flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">📊 Dashboard</Button>
                  </Link>
                  <Link href="/create" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">✨ Create a Wish</Button>
                  </Link>
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await handleSignOut();
                      router.push('/');
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/create" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">✨ Create a Wish</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
