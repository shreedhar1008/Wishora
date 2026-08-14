import { Metadata } from 'next';
import { getDataAdapter } from '@/lib/db';
import WishClientPage from './WishClientPage';
import { TEMPLATES } from '@/lib/templates/definitions';
import { Wish } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const token = unwrappedParams.token;
  try {
    const db = await getDataAdapter();
    const wish = await db.getWishByToken(token);
    if (wish) {
      const template = TEMPLATES.find(t => t.id === wish.templateId || t.slug === wish.templateSlug);
      const title = wish.title || `A special wish for ${wish.recipientName}`;
      const desc = `You've received a special wish from ${wish.senderName || 'someone special'}!`;
      return {
        title: `${title} | Wishora`,
        description: desc,
        openGraph: {
          title,
          description: desc,
          images: template ? [`/templates/${template.slug}.jpg`] : [],
        }
      };
    }
  } catch {
    // Ignore error, fallback to client-side resolving
  }

  return {
    title: 'A special wish for you | Wishora',
    description: "You've received a special surprise wish!",
  };
}

export default async function WishPage({ params }: { params: Promise<{ token: string }> }) {
  const unwrappedParams = await params;
  const token = unwrappedParams.token;
  let serverWish: Partial<Wish> | null = null;
  
  try {
    const db = await getDataAdapter();
    serverWish = await db.getWishByToken(token);
  } catch {
    // Ignore error, fallback to client-side resolving
  }

  return <WishClientPage token={token} serverWish={serverWish} />;
}
