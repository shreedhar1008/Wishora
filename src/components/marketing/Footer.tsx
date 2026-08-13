import React from 'react';
import Link from 'next/link';

const FOOTER_LINKS = {
  Product: [
    { href: '/templates', label: 'Templates' },
    { href: '/create', label: 'Create a Wish' },
    { href: '/explore', label: 'Explore' },
    { href: '/pricing', label: 'Pricing' },
  ],
  Occasions: [
    { href: '/occasions/birthday', label: 'Birthday' },
    { href: '/occasions/anniversary', label: 'Anniversary' },
    { href: '/occasions/wedding', label: 'Wedding' },
    { href: '/occasions/love', label: 'Love' },
    { href: '/occasions/congratulations', label: 'Congratulations' },
    { href: '/occasions/thank-you', label: 'Thank You' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/help', label: 'Help' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="url(#footerLogoGrad)" />
                <path
                  d="M16 8C12 8 9 11 9 14.5C9 20 16 25 16 25C16 25 23 20 23 14.5C23 11 20 8 16 8Z"
                  fill="white"
                  opacity="0.9"
                />
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="hsl(320, 60%, 45%)" />
                    <stop offset="100%" stopColor="hsl(340, 65%, 60%)" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-bold text-white">Wishora</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Turn a simple wish into a magical moment. Create beautiful, animated, personalized wishes for every occasion.
            </p>
            <p className="text-sm text-white/40">Made with ❤️ for making others smile</p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Wishora. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
