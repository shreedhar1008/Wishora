export type ReactionType = 'heart' | 'sparkle' | 'cheers' | 'hug' | 'party' | 'fire' | 'laugh' | 'cry';

export interface WishSettings {
  allowReactions?: boolean;
  allowReplies?: boolean;
  requireNameForReply?: boolean;
  notifyOnActivity?: boolean;
  theme?: string;
  animationIntensity?: 'subtle' | 'moderate' | 'vibrant';
  countdownDate?: string;
  [key: string]: unknown;
}

export interface Wish {
  id: string;
  ownerId?: string | null;
  publicToken: string;
  templateId: string;
  templateSlug: string;
  occasion: string;
  title?: string;
  recipientName: string;
  senderName?: string;
  message: string;
  relationship?: string;
  isPublic: boolean;
  isPublished: boolean;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  settings: WishSettings;
}

export interface WishReaction {
  id: string;
  wishId: string;
  type: ReactionType;
  createdAt: string;
}

export interface WishReply {
  id: string;
  wishId: string;
  displayName: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
}
