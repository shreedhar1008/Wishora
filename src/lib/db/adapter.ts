import { Wish, WishReaction, WishReply, WishStats, ReactionType } from '@/types';

export interface DataAdapter {
  // Wishes
  createWish(wish: Partial<Wish>): Promise<Wish>;
  getWishByToken(publicToken: string): Promise<Wish | null>;
  getWishById(id: string): Promise<Wish | null>;
  getWishesByOwner(ownerId: string): Promise<Wish[]>;
  updateWish(id: string, data: Partial<Wish>): Promise<Wish>;
  deleteWish(id: string): Promise<void>;
  publishWish(id: string): Promise<Wish>;
  getPublicWishes(options: { page: number; limit: number; occasion?: string | null }): Promise<{ wishes: Wish[]; total: number }>;
  
  // Reactions
  addReaction(wishId: string, reactionType: ReactionType): Promise<WishReaction>;
  getReactions(wishId: string): Promise<WishReaction[]>;
  
  // Replies
  addReply(wishId: string, displayName: string, body: string): Promise<WishReply>;
  getReplies(wishId: string): Promise<WishReply[]>;
  
  // Views
  addView(wishId: string, deviceType?: string, referrer?: string): Promise<void>;
  getViewCount(wishId: string): Promise<number>;
  
  // Stats
  getWishStats(wishId: string): Promise<{ views: number; reactions: number; replies: number }>;
  getDashboardStats(ownerId: string): Promise<WishStats>;
}
