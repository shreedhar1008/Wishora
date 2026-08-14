import { SupabaseClient } from '@supabase/supabase-js';
import { Wish, WishReaction, WishReply, WishStats, ReactionType } from '@/types';
import { DataAdapter } from './adapter';
import { getSupabaseServerClient } from '../supabase';
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
    status: row.status as Wish['status'],
    visibility: row.visibility as Wish['visibility'],
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
  if (wish.status !== undefined) row.status = wish.status;
  if (wish.visibility !== undefined) row.visibility = wish.visibility;
  if (wish.isPublic !== undefined) row.visibility = wish.isPublic ? 'public' : 'private';
  if (wish.isPublished !== undefined) row.status = wish.isPublished ? 'published' : 'draft';
  if (wish.publishedAt !== undefined) row.published_at = wish.publishedAt;

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

  constructor(client?: SupabaseClient) {
    this.client = client || getSupabaseServerClient();
  }

  // ── Wishes ────────────────────────────────

  async createWish(wish: Partial<Wish>): Promise<Wish> {
    const token = wish.publicToken || generateToken(16);
    const insertData = {
      ...wishToInsertRow(wish),
      public_token: token,
      template_slug: wish.templateSlug || wish.templateId || 'tpl_bday_1',
      occasion: wish.occasion || 'birthday',
      recipient_name: wish.recipientName || 'Friend',
      message: wish.message || '',
      status: wish.status || 'draft',
      visibility: wish.isPublic ? 'public' : 'private',
      settings: wish.settings || {},
    };

    const { data, error } = await this.client
      .from('wishes')
      .insert(insertData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create wish: ${error.message}`);
    return rowToWish(data as WishRow);
  }

  async getWishByToken(publicToken: string): Promise<Wish | null> {
    const { data, error } = await this.client
      .from('wishes')
      .select('*')
      .eq('public_token', publicToken)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get wish: ${error.message}`);
    }
    return data ? rowToWish(data as WishRow) : null;
  }

  async getWishById(id: string): Promise<Wish | null> {
    const { data, error } = await this.client
      .from('wishes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to get wish: ${error.message}`);
    }
    return data ? rowToWish(data as WishRow) : null;
  }

  async getWishesByOwner(ownerId: string): Promise<Wish[]> {
    const { data, error } = await this.client
      .from('wishes')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get wishes: ${error.message}`);
    return (data || []).map((row) => rowToWish(row as WishRow));
  }

  async updateWish(id: string, updates: Partial<Wish>): Promise<Wish> {
    const updateData = {
      ...wishToInsertRow(updates),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.client
      .from('wishes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update wish: ${error.message}`);
    return rowToWish(data as WishRow);
  }

  async deleteWish(id: string): Promise<void> {
    const { error } = await this.client
      .from('wishes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete wish: ${error.message}`);
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

    if (error) throw new Error(`Failed to get public wishes: ${error.message}`);

    return {
      wishes: (data || []).map((row) => rowToWish(row as WishRow)),
      total: count || 0,
    };
  }

  // ── Reactions ─────────────────────────────

  async addReaction(wishId: string, reactionType: ReactionType): Promise<WishReaction> {
    // Upsert: increment count if reaction type already exists, otherwise insert
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

      if (error) throw new Error(`Failed to update reaction: ${error.message}`);
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

    if (error) throw new Error(`Failed to add reaction: ${error.message}`);
    return rowToReaction(data as ReactionRow);
  }

  async getReactions(wishId: string): Promise<WishReaction[]> {
    const { data, error } = await this.client
      .from('wish_reactions')
      .select('*')
      .eq('wish_id', wishId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get reactions: ${error.message}`);
    return (data || []).map((row) => rowToReaction(row as ReactionRow));
  }

  // ── Replies ───────────────────────────────

  async addReply(wishId: string, displayName: string, body: string): Promise<WishReply> {
    const { data, error } = await this.client
      .from('wish_replies')
      .insert({
        wish_id: wishId,
        display_name: displayName || 'Anonymous',
        body,
        is_approved: true, // Auto-approve for now
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add reply: ${error.message}`);
    return rowToReply(data as ReplyRow);
  }

  async getReplies(wishId: string): Promise<WishReply[]> {
    const { data, error } = await this.client
      .from('wish_replies')
      .select('*')
      .eq('wish_id', wishId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get replies: ${error.message}`);
    return (data || []).map((row) => rowToReply(row as ReplyRow));
  }

  // ── Views ─────────────────────────────────

  async addView(wishId: string, _deviceType?: string, _referrer?: string): Promise<void> {
    const { error } = await this.client
      .from('wish_views')
      .insert({
        wish_id: wishId,
        user_agent: _deviceType || null,
      });

    if (error) {
      // Non-critical — log but don't throw
      console.error('Failed to track view:', error.message);
    }
  }

  async getViewCount(wishId: string): Promise<number> {
    const { count, error } = await this.client
      .from('wish_views')
      .select('*', { count: 'exact', head: true })
      .eq('wish_id', wishId);

    if (error) throw new Error(`Failed to get view count: ${error.message}`);
    return count || 0;
  }

  // ── Stats ─────────────────────────────────

  async getWishStats(wishId: string): Promise<{ views: number; reactions: number; replies: number }> {
    const [viewCount, reactionsData, repliesData] = await Promise.all([
      this.getViewCount(wishId),
      this.getReactions(wishId),
      this.getReplies(wishId),
    ]);

    // Sum the count field from all reaction rows
    const totalReactions = reactionsData.reduce((sum, r) => {
      // The reaction row has a count field in the DB, but our type doesn't expose it.
      // We count rows as a fallback.
      return sum + 1;
    }, 0);

    return {
      views: viewCount,
      reactions: totalReactions,
      replies: repliesData.length,
    };
  }

  async getDashboardStats(ownerId: string): Promise<WishStats> {
    const wishes = await this.getWishesByOwner(ownerId);

    let totalViews = 0;
    let totalReactions = 0;
    let totalReplies = 0;

    // Batch stats for all user wishes
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
