import { Wish, WishReaction, WishReply, WishStats, ReactionType } from '@/types';
import { DataAdapter } from '../db/adapter';
import { generateToken } from '../utils';

// In-memory data store for demo mode
let wishes: Wish[] = [
  {
    id: 'wish_demo_1',
    ownerId: 'demo_user',
    templateId: 'birthday-balloon-blast',
    templateSlug: 'birthday-balloon-blast',
    occasion: 'birthday',
    recipientName: 'Emma',
    senderName: 'Sarah',
    title: 'Happy Birthday Emma!',
    message: 'Wishing you a day filled with joy, laughter, and endless surprises! May all your dreams take flight this year.',
    signature: 'With love, Sarah',
    publicToken: 'demo-emma-bday',
    isPublic: true,
    isPublished: true,
    status: 'published',
    visibility: 'public',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    customPalette: {
      primary: '#FF4B4B',
      secondary: '#4B9AFF',
      accent: '#FFD93D',
      background: '#FFF5F5',
      text: '#333333'
    },
    images: [],
    musicUrl: null,
    settings: {
      allowReactions: true,
      allowReplies: true,
      requireNameForReply: true,
      notifyOnActivity: false
    }
  },
  {
    id: 'wish_demo_2',
    ownerId: 'demo_user',
    templateId: 'our-story',
    templateSlug: 'our-story',
    occasion: 'anniversary',
    recipientName: 'Aarav & Maya',
    senderName: 'Aarav',
    title: 'Happy Anniversary Aarav & Maya',
    message: 'Every chapter with you is my favorite. Here is to our beautiful story and the many pages yet to be written. Cheers to 5 wonderful years!',
    signature: 'Forever yours, Aarav',
    publicToken: 'demo-aarav-maya',
    isPublic: true,
    isPublished: true,
    status: 'published',
    visibility: 'public',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    customPalette: null,
    images: [],
    musicUrl: null,
    settings: {
      allowReactions: true,
      allowReplies: true,
      requireNameForReply: false,
      notifyOnActivity: true
    }
  },
  {
    id: 'wish_demo_3',
    ownerId: 'demo_user',
    templateId: 'congratulations-confetti',
    templateSlug: 'congratulations-confetti',
    occasion: 'congratulations',
    recipientName: 'Daniel',
    senderName: 'Uncle John',
    title: 'Way to go, Daniel!',
    message: 'You did it! I am incredibly proud of your hard work and amazing success on passing the bar exam. The sky is the limit!',
    signature: 'Best, Uncle John',
    publicToken: 'demo-dan-success',
    isPublic: true,
    isPublished: true,
    status: 'published',
    visibility: 'public',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    customPalette: null,
    images: [],
    musicUrl: null,
    settings: {
      allowReactions: true,
      allowReplies: false,
      requireNameForReply: false,
      notifyOnActivity: false
    }
  },
  {
    id: 'wish_demo_4',
    ownerId: 'demo_user',
    templateId: 'thank-you-mom',
    templateSlug: 'thank-you-mom',
    occasion: 'thank-you',
    recipientName: 'Mom',
    senderName: 'Chloe',
    title: 'To the best Mom ever',
    message: 'Thank you for your endless love, patience, and guidance. You are the best mom in the world and I appreciate everything you do for us every single day.',
    signature: 'Love always, Chloe',
    publicToken: 'demo-mom-thanks',
    isPublic: true,
    isPublished: true,
    status: 'published',
    visibility: 'public',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    customPalette: null,
    images: [],
    musicUrl: null,
    settings: {
      allowReactions: true,
      allowReplies: true,
      requireNameForReply: true,
      notifyOnActivity: true
    }
  },
  {
    id: 'wish_demo_5',
    ownerId: 'demo_user',
    templateId: 'diwali-glow',
    templateSlug: 'diwali-glow',
    occasion: 'festival',
    recipientName: 'Family',
    senderName: 'The Sharma Family',
    title: 'Happy Diwali!',
    message: 'May the festival of lights bring joy, prosperity, and happiness to your home. Wishing you and your family a sparkling Diwali!',
    signature: 'The Sharma Family',
    publicToken: 'demo-diwali-2026',
    isPublic: true,
    isPublished: true,
    status: 'published',
    visibility: 'public',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    customPalette: null,
    images: [],
    musicUrl: null,
    settings: {
      allowReactions: true,
      allowReplies: true,
      requireNameForReply: true,
      notifyOnActivity: false
    }
  }
];

let reactions: WishReaction[] = [
  { id: 'r1', wishId: 'wish_demo_1', type: 'heart', createdAt: new Date().toISOString() },
  { id: 'r2', wishId: 'wish_demo_1', type: 'celebrate', createdAt: new Date().toISOString() },
  { id: 'r3', wishId: 'wish_demo_2', type: 'heart', createdAt: new Date().toISOString() },
  { id: 'r4', wishId: 'wish_demo_4', type: 'heart', createdAt: new Date().toISOString() }
];

let replies: WishReply[] = [
  { id: 'rep1', wishId: 'wish_demo_1', displayName: 'Emma', body: 'Aww thank you so much! I love the balloons!', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), isApproved: true },
  { id: 'rep2', wishId: 'wish_demo_4', displayName: 'Mom', body: 'This is beautiful honey, love you too!', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), isApproved: true }
];

let views: { id: string; wishId: string; createdAt: string }[] = [
  { id: 'v1', wishId: 'wish_demo_1', createdAt: new Date().toISOString() },
  { id: 'v2', wishId: 'wish_demo_1', createdAt: new Date().toISOString() },
  { id: 'v3', wishId: 'wish_demo_1', createdAt: new Date().toISOString() },
  { id: 'v4', wishId: 'wish_demo_2', createdAt: new Date().toISOString() },
  { id: 'v5', wishId: 'wish_demo_4', createdAt: new Date().toISOString() }
];

export class DemoDataAdapter implements DataAdapter {
  
  async createWish(wishData: Partial<Wish>): Promise<Wish> {
    const isPublished = wishData.isPublished !== false;
    const isPublic = wishData.isPublic ?? true;
    const status = wishData.status || (isPublished ? 'published' : 'draft');
    const visibility = isPublic ? 'public' : 'private';

    const newWish: Wish = {
      id: `wish_${Date.now()}`,
      ownerId: wishData.ownerId || 'demo_user',
      templateId: wishData.templateId || wishData.templateSlug || 'birthday-balloon-blast',
      templateSlug: wishData.templateSlug || wishData.templateId || 'birthday-balloon-blast',
      occasion: wishData.occasion || 'birthday',
      recipientName: wishData.recipientName || 'Friend',
      senderName: wishData.senderName || undefined,
      relationship: wishData.relationship || undefined,
      title: wishData.title || undefined,
      message: wishData.message || '',
      signature: wishData.signature || (wishData.senderName ? `With love, ${wishData.senderName}` : undefined),
      publicToken: wishData.publicToken || generateToken(16),
      isPublic: isPublic,
      isPublished: isPublished,
      status: status,
      visibility: visibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: isPublished ? new Date().toISOString() : undefined,
      customPalette: wishData.customPalette || null,
      images: wishData.images || [],
      musicUrl: wishData.musicUrl || null,
      settings: {
        allowReactions: wishData.settings?.allowReactions !== false,
        allowReplies: wishData.settings?.allowReplies !== false,
        requireNameForReply: wishData.settings?.requireNameForReply === true,
        notifyOnActivity: wishData.settings?.notifyOnActivity === true,
        theme: wishData.settings?.theme,
        animationIntensity: wishData.settings?.animationIntensity,
        enabledInteractions: wishData.settings?.enabledInteractions,
        countdownDate: wishData.settings?.countdownDate,
      }
    };
    wishes.unshift(newWish);
    return newWish;
  }

  async getWishByToken(publicToken: string): Promise<Wish | null> {
    // Also match alternative demo token aliases
    const found = wishes.find(w => w.publicToken === publicToken);
    if (found) return found;

    if (publicToken === 'demo_emma_birthday' || publicToken === 'demo-bday-1') {
      return wishes.find(w => w.publicToken === 'demo-emma-bday') || null;
    }
    if (publicToken === 'demo_aarav_anniversary' || publicToken === 'demo-anniv-1') {
      return wishes.find(w => w.publicToken === 'demo-aarav-maya') || null;
    }
    if (publicToken === 'demo_daniel_congrats' || publicToken === 'demo-congrats-1') {
      return wishes.find(w => w.publicToken === 'demo-dan-success') || null;
    }

    return null;
  }

  async getWishById(id: string): Promise<Wish | null> {
    return wishes.find(w => w.id === id) || null;
  }

  async getWishesByOwner(ownerId: string): Promise<Wish[]> {
    return wishes.filter(w => w.ownerId === ownerId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateWish(id: string, data: Partial<Wish>): Promise<Wish> {
    const index = wishes.findIndex(w => w.id === id);
    if (index === -1) throw new Error('Wish not found');
    
    wishes[index] = { 
      ...wishes[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return wishes[index];
  }

  async deleteWish(id: string): Promise<void> {
    wishes = wishes.filter(w => w.id !== id);
    reactions = reactions.filter(r => r.wishId !== id);
    replies = replies.filter(r => r.wishId !== id);
    views = views.filter(v => v.wishId !== id);
  }

  async publishWish(id: string): Promise<Wish> {
    return this.updateWish(id, { isPublished: true, status: 'published', publishedAt: new Date().toISOString() });
  }

  async getPublicWishes(options: { page: number; limit: number; occasion?: string | null }): Promise<{ wishes: Wish[]; total: number }> {
    const { page, limit, occasion } = options;
    const publicWishes = wishes.filter(w => 
      w.isPublic && 
      (w.isPublished || w.status === 'published') && 
      (!occasion || w.occasion === occasion)
    )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const start = (page - 1) * limit;
    const paginatedWishes = publicWishes.slice(start, start + limit);
    
    return {
      wishes: paginatedWishes,
      total: publicWishes.length
    };
  }

  async addReaction(wishId: string, type: ReactionType): Promise<WishReaction> {
    const reaction: WishReaction = {
      id: `react_${Date.now()}`,
      wishId,
      type,
      createdAt: new Date().toISOString()
    };
    reactions.push(reaction);
    return reaction;
  }

  async getReactions(wishId: string): Promise<WishReaction[]> {
    return reactions.filter(r => r.wishId === wishId);
  }

  async addReply(wishId: string, displayName: string, body: string): Promise<WishReply> {
    const reply: WishReply = {
      id: `reply_${Date.now()}`,
      wishId,
      displayName,
      body,
      isApproved: true, // Auto-approve in demo
      createdAt: new Date().toISOString()
    };
    replies.push(reply);
    return reply;
  }

  async getReplies(wishId: string): Promise<WishReply[]> {
    return replies.filter(r => r.wishId === wishId && r.isApproved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async addView(wishId: string, deviceType?: string, referrer?: string): Promise<void> {
    views.push({
      id: `view_${Date.now()}_${deviceType || 'generic'}_${referrer || 'direct'}`,
      wishId,
      createdAt: new Date().toISOString()
    });
  }

  async getViewCount(wishId: string): Promise<number> {
    return views.filter(v => v.wishId === wishId).length;
  }

  async getWishStats(wishId: string): Promise<{ views: number; reactions: number; replies: number }> {
    return {
      views: await this.getViewCount(wishId),
      reactions: reactions.filter(r => r.wishId === wishId).length,
      replies: replies.filter(r => r.wishId === wishId && r.isApproved).length
    };
  }

  async getDashboardStats(ownerId: string): Promise<WishStats> {
    const userWishes = await this.getWishesByOwner(ownerId);
    let totalViews = 0;
    let totalReactions = 0;
    let totalReplies = 0;
    
    for (const wish of userWishes) {
      const stats = await this.getWishStats(wish.id);
      totalViews += stats.views;
      totalReactions += stats.reactions;
      totalReplies += stats.replies;
    }
    
    return {
      totalWishes: userWishes.length,
      totalViews,
      totalReactions,
      totalReplies
    };
  }
}
