export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

export type InteractionType =
  | 'confetti'
  | 'balloons'
  | 'audio'
  | 'button'
  | 'envelope'
  | 'gallery'
  | 'quiz'
  | 'timeline'
  | 'scratch'
  | 'poll'
  | 'balloon-pop'
  | 'candle-blow'
  | 'gift-box'
  | 'blooming-roses'
  | 'countdown'
  | 'sparkles'
  | 'hearts'
  | 'countdown-timer'
  | 'sparkle-background'
  | 'heart-animation'
  | 'scratch-reveal'
  | 'memory-gallery';

export type ReactionType = 'heart' | 'celebrate' | 'smile' | 'cry' | 'laugh' | 'surprise';

export type ThemeStyle = 'elegant' | 'playful' | 'romantic' | 'festive' | 'minimal' | 'bold';

export type AnimationIntensity = 'subtle' | 'moderate' | 'vibrant';


export interface WishReaction {
  id: string;
  wishId: string;
  type: ReactionType | string;
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

export interface WishStats {
  totalWishes: number;
  totalViews: number;
  totalReactions: number;
  totalReplies: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface WishSettings {
  allowReactions?: boolean;
  allowReplies?: boolean;
  requireNameForReply?: boolean;
  notifyOnActivity?: boolean;
  theme?: string;
  animationIntensity?: 'subtle' | 'moderate' | 'vibrant';
  enabledInteractions?: InteractionType[];
  countdownDate?: string;
}

export interface Wish {
  id: string;
  ownerId: string;
  templateId: string;
  templateSlug?: string;
  occasion?: string;
  title?: string;
  message: string;
  signature?: string;
  publicToken: string;
  isPublic?: boolean;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
  customPalette?: ColorPalette | null;
  images?: string[];
  musicUrl?: string | null;
  settings?: WishSettings;
  recipientName?: string;
  senderName?: string;
  relationship?: string;
  status?: 'draft' | 'published' | 'archived' | 'expired';
  visibility?: 'public' | 'private';
  publishedAt?: string;
}

export interface Template {
  id: string;
  slug: string;
  title: string;
  description: string;
  occasion: string;
  category: string;
  colorPalette: ColorPalette;
  fontStyle: string;
  animationType: string;
  interactiveModules: InteractionType[];
  supportedFields: string[];
  defaultMessage: string;
  isPremium: boolean;
  isPublished: boolean;
  popularity: number;
  tags: string[];
  emoji: string;
  previewGradient: string;
}
