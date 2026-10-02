import { SupabaseClient } from '@supabase/supabase-js';
import { Wish, WishReaction, WishReply, WishStats, ReactionType } from '@/types';
import { DataAdapter } from './adapter';
import { DemoDataAdapter } from '../demo/data';
import { getSupabaseAdminClient } from '../supabase';
import { generateToken } from '../utils';

// ─────────────────────────────────────────────
// Row ↔ TypeScript mappers
// ─────────────────────────────────────────────

interface WishRow {
  id: string;
  owner_id: string | null;
  public_token: string;
  template_slug: string;
  occasion: string;
  title: string | null;
  recipient_name: string;
  sender_name: string | null;
  message: string;
  relationship: string | null;
  settings: Record<string, unknown>;
  status: string;
  visibility: string;
  password_hash: string | null;
  scheduled_for: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface ReactionRow {
  id: string;
  wish_id: string;
  reaction_type: string;
  count: number;
  created_at: string;
  updated_at: string;
}

interface ReplyRow {
  id: string;
  wish_id: string;
  display_name: string;
  body: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

function rowToWish(row: WishRow): Wish {
  return {
    id: row.id,
    ownerId: row.owner_id || '',
    templateId: row.template_slug,       // maps slug → templateId
    templateSlug: row.template_slug,
    occasion: row.occasion,
    title: row.title || undefined,
    recipientName: row.recipient_name,
    senderName: row.sender_name || undefined,
    message: row.message,
    relationship: row.relationship || undefined,
    publicToken: row.public_token,
    isPublic: row.visibility === 'public',
    isPublished: row.status === 'published',
    status: (row.status || 'published') as Wish['status'],
    visibility: (row.visibility || 'public') as Wish['visibility'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at || undefined,
    customPalette: null,
    images: [],
    musicUrl: null,
    settings: {
      allowReactions: (row.settings as Record<string, unknown>)?.allowReactions !== false,
      allowReplies: (row.settings as Record<string, unknown>)?.allowReplies !== false,
      requireNameForReply: (row.settings as Record<string, unknown>)?.requireNameForReply === true,
      notifyOnActivity: (row.settings as Record<string, unknown>)?.notifyOnActivity === true,
      theme: (row.settings as Record<string, unknown>)?.theme as string | undefined,
      animationIntensity: (row.settings as Record<string, unknown>)?.animationIntensity as 'subtle' | 'moderate' | 'vibrant' | undefined,
      enabledInteractions: (row.settings as Record<string, unknown>)?.enabledInteractions as Wish['settings'] extends { enabledInteractions?: infer T } ? T : never,
      countdownDate: (row.settings as Record<string, unknown>)?.countdownDate as string | undefined,
    },
  };
}

function wishToInsertRow(wish: Partial<Wish>): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (wish.ownerId !== undefined) row.owner_id = wish.ownerId || null;
  if (wish.publicToken !== undefined) row.public_token = wish.publicToken;
  if (wish.templateSlug !== undefined || wish.templateId !== undefined) {
    row.template_slug = wish.templateSlug || wish.templateId;
  }
  if (wish.occasion !== undefined) row.occasion = wish.occasion;
  if (wish.title !== undefined) row.title = wish.title;
  if (wish.recipientName !== undefined) row.recipient_name = wish.recipientName;
  if (wish.senderName !== undefined) row.sender_name = wish.senderName;
  if (wish.message !== undefined) row.message = wish.message;
  if (wish.relationship !== undefined) row.relationship = wish.relationship;
  if (wish.settings !== undefined) row.settings = wish.settings;
  
  const isPublished = wish.isPublished !== false;
  const status = wish.status || (isPublished ? 'published' : 'draft');
  row.status = status;
  
  const isPublic = wish.isPublic !== undefined ? wish.isPublic : (wish.visibility === 'public');
  row.visibility = isPublic ? 'public' : 'private';

  if (wish.publishedAt !== undefined) {
    row.published_at = wish.publishedAt;
  } else if (status === 'published') {
    row.published_at = new Date().toISOString();
  }

  return row;
}

function rowToReaction(row: ReactionRow): WishReaction {
  return {
    id: row.id,
    wishId: row.wish_id,
    type: row.reaction_type as ReactionType,
    createdAt: row.created_at,
  };
}

function rowToReply(row: ReplyRow): WishReply {
  return {
    id: row.id,
    wishId: row.wish_id,
    displayName: row.display_name,
    body: row.body,
    isApproved: row.is_approved,
    createdAt: row.created_at,
  };
}

// ─────────────────────────────────────────────
// SupabaseAdapter
// ─────────────────────────────────────────────

export class SupabaseAdapter implements DataAdapter {
  private client: SupabaseClient;
  private demoFallback: DemoDataAdapter;

  constructor(client?: SupabaseClient) {
    this.client = client || getSupabaseAdminClient();
    this.demoFallback = new DemoDataAdapter();
  }

  // ── Wishes ────────────────────────────────

  async createWish(wish: Partial<Wish>): Promise<Wish> {
    try {
      const token = wish.publicToken || generateToken(16);
      const isPublished = wish.isPublished !== false;
      const status = wish.status || (isPublished ? 'published' : 'draft');
      const isPublic = wish.isPublic !== undefined ? wish.isPublic : (wish.visibility === 'public');

      const insertData = {
        ...wishToInsertRow(wish),
        public_token: token,
        template_slug: wish.templateSlug || wish.templateId || 'birthday-balloon-blast',
        occasion: wish.occasion || 'birthday',
        recipient_name: wish.recipientName || 'Friend',
        sender_name: wish.senderName || null,
        title: wish.title || null,
        message: wish.message || '',
        status: status,
        visibility: isPublic ? 'public' : 'private',
        settings: wish.settings || {},
        owner_id: wish.ownerId || null,
        published_at: isPublished ? new Date().toISOString() : null,
      };

      let { data, error } = await this.client
        .from('wishes')
        .insert(insertData)
        .select()
        .single();

      // If foreign key constraint on owner_id fails (missing profile row)
      if (error && error.message.includes('wishes_owner_id_fkey')) {
        console.warn('Foreign key violation on owner_id, attempting auto-recovery...');
        if (insertData.owner_id) {
          try {
            await this.client.from('profiles').upsert({
              id: insertData.owner_id,
              display_name: insertData.sender_name || 'User',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });

            const retryResult = await this.client
              .from('wishes')
              .insert(insertData)
              .select()
              .single();

            if (!retryResult.error) {
              data = retryResult.data;
              error = null;
            }
          } catch {
            // ignore error and proceed to fallback
          }
        }

        // If still error, insert with owner_id = null so wish is NEVER lost
        if (error) {
          const fallbackNullResult = await this.client
            .from('wishes')
            .insert({ ...insertData, owner_id: null })
            .select()
            .single();

          if (!fallbackNullResult.error) {
            data = fallbackNullResult.data;
            error = null;
          }
        }
      }

      if (error) {
        console.warn('Supabase createWish error, falling back to in-memory store:', error.message);
        return await this.demoFallback.createWish(wish);
      }
      return rowToWish(data as WishRow);
    } catch (err: unknown) {
      console.warn('Supabase createWish network exception, falling back to in-memory store:', err);
      return await this.demoFallback.createWish(wish);
    }
  }

  async getWishByToken(publicToken: string): Promise<Wish | null> {
    try {
      const { data, error } = await this.client
        .from('wishes')
        .select('*')
        .eq('public_token', publicToken)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.warn('Supabase getWishByToken error:', error.message);
        }
        return await this.demoFallback.getWishByToken(publicToken);
      }
      return data ? rowToWish(data as WishRow) : await this.demoFallback.getWishByToken(publicToken);
    } catch {
      return await this.demoFallback.getWishByToken(publicToken);
    }
  }

  async getWishById(id: string): Promise<Wish | null> {
    try {
      const { data, error } = await this.client
        .from('wishes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.warn('Supabase getWishById error:', error.message);
        }
        return await this.demoFallback.getWishById(id);
      }
      return data ? rowToWish(data as WishRow) : await this.demoFallback.getWishById(id);
    } catch {
      return await this.demoFallback.getWishById(id);
    }
  }

  async getWishesByOwner(ownerId: string): Promise<Wish[]> {
    try {
      const { data, error } = await this.client
        .from('wishes')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getWishesByOwner error:', error.message);
        return await this.demoFallback.getWishesByOwner(ownerId);
      }
      return (data || []).map((row) => rowToWish(row as WishRow));
    } catch {
      return await this.demoFallback.getWishesByOwner(ownerId);
    }
  }

  async updateWish(id: string, updates: Partial<Wish>): Promise<Wish> {
    const updateData = {
      ...wishToInsertRow(updates),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await this.client
        .from('wishes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return await this.demoFallback.updateWish(id, updates);
      }
      return rowToWish(data as WishRow);
    } catch {
      return await this.demoFallback.updateWish(id, updates);
    }
  }

  async deleteWish(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('wishes')
        .delete()
        .eq('id', id);

      if (error) {
        await this.demoFallback.deleteWish(id);
      }
    } catch {
      await this.demoFallback.deleteWish(id);
    }
  }

  async publishWish(id: string): Promise<Wish> {
    return this.updateWish(id, {
      isPublished: true,
      status: 'published',
      publishedAt: new Date().toISOString(),
    });
  }

  async getPublicWishes(options: {
    page: number;
    limit: number;
    occasion?: string | null;
  }): Promise<{ wishes: Wish[]; total: number }> {
    const { page, limit, occasion } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      let query = this.client
        .from('wishes')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (occasion) {
        query = query.eq('occasion', occasion);
      }

      const { data, count, error } = await query;

      if (error) {
        return await this.demoFallback.getPublicWishes(options);
      }

      return {
        wishes: (data || []).map((row) => rowToWish(row as WishRow)),
        total: count || 0,
      };
    } catch {
      return await this.demoFallback.getPublicWishes(options);
    }
  }

  // ── Reactions ─────────────────────────────

  async addReaction(wishId: string, reactionType: ReactionType): Promise<WishReaction> {
    try {
      const { data: existing } = await this.client
        .from('wish_reactions')
        .select('*')
        .eq('wish_id', wishId)
        .eq('reaction_type', reactionType)
        .single();

      if (existing) {
        const { data, error } = await this.client
          .from('wish_reactions')
          .update({
            count: (existing as ReactionRow).count + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', (existing as ReactionRow).id)
          .select()
          .single();

        if (error) return await this.demoFallback.addReaction(wishId, reactionType);
        return rowToReaction(data as ReactionRow);
      }

      const { data, error } = await this.client
        .from('wish_reactions')
        .insert({
          wish_id: wishId,
          reaction_type: reactionType,
          count: 1,
        })
        .select()
        .single();

      if (error) return await this.demoFallback.addReaction(wishId, reactionType);
      return rowToReaction(data as ReactionRow);
    } catch {
      return await this.demoFallback.addReaction(wishId, reactionType);
    }
  }

  async getReactions(wishId: string): Promise<WishReaction[]> {
    try {
      const { data, error } = await this.client
        .from('wish_reactions')
        .select('*')
        .eq('wish_id', wishId)
        .order('created_at', { ascending: false });

      if (error) return await this.demoFallback.getReactions(wishId);
      return (data || []).map((row) => rowToReaction(row as ReactionRow));
    } catch {
      return await this.demoFallback.getReactions(wishId);
    }
  }

  // ── Replies ───────────────────────────────

  async addReply(wishId: string, displayName: string, body: string): Promise<WishReply> {
    try {
      const { data, error } = await this.client
        .from('wish_replies')
        .insert({
          wish_id: wishId,
          display_name: displayName || 'Anonymous',
          body,
          is_approved: true,
        })
        .select()
        .single();

      if (error) return await this.demoFallback.addReply(wishId, displayName, body);
      return rowToReply(data as ReplyRow);
    } catch {
      return await this.demoFallback.addReply(wishId, displayName, body);
    }
  }

  async getReplies(wishId: string): Promise<WishReply[]> {
    try {
      const { data, error } = await this.client
        .from('wish_replies')
        .select('*')
        .eq('wish_id', wishId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) return await this.demoFallback.getReplies(wishId);
      return (data || []).map((row) => rowToReply(row as ReplyRow));
    } catch {
      return await this.demoFallback.getReplies(wishId);
    }
  }

  // ── Views ─────────────────────────────────

  async addView(wishId: string, deviceType?: string, referrer?: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('wish_views')
        .insert({
          wish_id: wishId,
          user_agent: deviceType || referrer || null,
        });

      if (error) {
        await this.demoFallback.addView(wishId, deviceType, referrer);
      }
    } catch {
      await this.demoFallback.addView(wishId, deviceType, referrer);
    }
  }

  async getViewCount(wishId: string): Promise<number> {
    try {
      const { count, error } = await this.client
        .from('wish_views')
        .select('*', { count: 'exact', head: true })
        .eq('wish_id', wishId);

      if (error) return await this.demoFallback.getViewCount(wishId);
      return count || 0;
    } catch {
      return await this.demoFallback.getViewCount(wishId);
    }
  }

  // ── Stats ─────────────────────────────────

  async getWishStats(wishId: string): Promise<{ views: number; reactions: number; replies: number }> {
    const [viewCount, reactionsData, repliesData] = await Promise.all([
      this.getViewCount(wishId),
      this.getReactions(wishId),
      this.getReplies(wishId),
    ]);

    return {
      views: viewCount,
      reactions: reactionsData.length,
      replies: repliesData.length,
    };
  }

  async getDashboardStats(ownerId: string): Promise<WishStats> {
    const wishes = await this.getWishesByOwner(ownerId);

    let totalViews = 0;
    let totalReactions = 0;
    let totalReplies = 0;

    const statsPromises = wishes.map((w) => this.getWishStats(w.id));
    const allStats = await Promise.all(statsPromises);

    for (const stats of allStats) {
      totalViews += stats.views;
      totalReactions += stats.reactions;
      totalReplies += stats.replies;
    }

    return {
      totalWishes: wishes.length,
      totalViews,
      totalReactions,
      totalReplies,
    };
  }
}
