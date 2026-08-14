'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Card, Toast } from '@/components/ui';

function ShareWishContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const shareUrl = React.useMemo(() => {
    if (!token) return '';
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/w/${token}`;
    }
    return `https://wishora.app/w/${token}`;
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-center items-center py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-charcoal mb-4">No token provided</h2>
        <Link href="/create">
          <Button>Go Back</Button>
        </Link>
      </div>
    );
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`I created a special wish for you! ✨\n\nOpen it here: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">Your Wish is Ready!</h1>
          <p className="text-charcoal-muted">Share the magic with your loved ones.</p>
        </div>

        <Card className="p-8 border-none shadow-elevated text-center">
          <div className="bg-surface-hover p-4 rounded-xl mb-6">
            <p className="text-sm font-medium text-charcoal mb-2">Share this link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-surface border border-border-light rounded-lg px-3 py-2 text-sm text-charcoal outline-none"
              />
              <Button size="sm" variant={copied ? 'primary' : 'outline'} onClick={handleCopyLink} className="shrink-0">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-xl shadow-soft border border-border-light inline-block">
              <QRCodeSVG value={shareUrl || 'https://wishora.app'} size={150} level="M" />
            </div>
          </div>
          <p className="text-xs text-charcoal-muted mb-8">Scan to open on mobile</p>

          <div className="space-y-3">
            <Button
              className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-soft"
              onClick={handleWhatsAppShare}
              size="lg"
            >
              Share via WhatsApp
            </Button>
            
            <Link href={`/w/${token}`}>
              <Button variant="outline" className="w-full" size="lg">
                Preview Wish
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="ghost" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      
      {showToast && (
        <Toast message="Link copied to clipboard!" type="success" onClose={() => setShowToast(false)} />
      )}
    </main>
  );
}

export default function ShareWishPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center">Loading share page...</div>}>
      <ShareWishContent />
    </React.Suspense>
  );
}
