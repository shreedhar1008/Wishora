import { getSupabaseClient } from '../config/supabase.js';
import { Wish, WishReaction, WishReply, ReactionType } from '../types/index.js';
import { generateToken } from '../utils/token.js';

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
    ownerId: row.owner_id || null,
    templateId: row.template_slug,
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
    settings: (row.settings as Wish['settings']) || {},
  };
}

export class WishesService {
  private static get client() {
    return getSupabaseClient();
  }

  static async createWish(wishData: Partial<Wish>): Promise<Wish> {
    const token = wishData.publicToken || generateToken(16);
    const isPublished = wishData.isPublished !== false;
    const status = wishData.status || (isPublished ? 'published' : 'draft');
    const isPublic = wishData.isPublic !== undefined ? wishData.isPublic : (wishData.visibility === 'public');

    const insertData = {
      public_token: token,
      template_slug: wishData.templateSlug || wishData.templateId || 'birthday-balloon-blast',
      occasion: wishData.occasion || 'birthday',
      recipient_name: wishData.recipientName || 'Friend',
      sender_name: wishData.senderName || null,
      title: wishData.title || null,
      message: wishData.message || '',
      status: status,
      visibility: isPublic ? 'public' : 'private',
      settings: wishData.settings || {},
      owner_id: wishData.ownerId || null,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    let { data, error } = await this.client
      .from('wishes')
      .insert(insertData)
      .select()
      .single();

    // Auto-recovery if foreign key constraint on owner_id fails (missing profile)
    if (error && error.message.includes('wishes_owner_id_fkey')) {
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
          // ignore
        }
      }

      if (error) {
        const fallback = await this.client
          .from('wishes')
          .insert({ ...insertData, owner_id: null })
          .select()
          .single();

        if (!fallback.error) {
          data = fallback.data;
          error = null;
        }
      }
    }

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return rowToWish(data as WishRow);
  }

  static async getWishByToken(publicToken: string): Promise<Wish | null> {
    const { data, error } = await this.client
      .from('wishes')
      .select('*')
      .eq('public_token', publicToken)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data ? rowToWish(data as WishRow) : null;
  }

  static async getWishesByOwner(ownerId: string): Promise<Wish[]> {
    const { data, error } = await this.client
      .from('wishes')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((row) => rowToWish(row as WishRow));
  }

  static async getPublicWishes(options: {
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
    if (error) throw new Error(error.message);

    return {
      wishes: (data || []).map((row) => rowToWish(row as WishRow)),
      total: count || 0,
    };
  }

  // ── Reactions ─────────────────────────────

  static async addReaction(wishId: string, reactionType: ReactionType): Promise<WishReaction> {
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

      if (error) throw new Error(error.message);
      return {
        id: (data as ReactionRow).id,
        wishId: (data as ReactionRow).wish_id,
        type: (data as ReactionRow).reaction_type as ReactionType,
        createdAt: (data as ReactionRow).created_at,
      };
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

    if (error) throw new Error(error.message);
    return {
      id: (data as ReactionRow).id,
      wishId: (data as ReactionRow).wish_id,
      type: (data as ReactionRow).reaction_type as ReactionType,
      createdAt: (data as ReactionRow).created_at,
    };
  }

  static async getReactions(wishId: string): Promise<WishReaction[]> {
    const { data, error } = await this.client
      .from('wish_reactions')
      .select('*')
      .eq('wish_id', wishId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((row: ReactionRow) => ({
      id: row.id,
      wishId: row.wish_id,
      type: row.reaction_type as ReactionType,
      createdAt: row.created_at,
    }));
  }

  // ── Replies ───────────────────────────────

  static async addReply(wishId: string, displayName: string, body: string): Promise<WishReply> {
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

    if (error) throw new Error(error.message);
    return {
      id: (data as ReplyRow).id,
      wishId: (data as ReplyRow).wish_id,
      displayName: (data as ReplyRow).display_name,
      body: (data as ReplyRow).body,
      isApproved: (data as ReplyRow).is_approved,
      createdAt: (data as ReplyRow).created_at,
    };
  }

  static async getReplies(wishId: string): Promise<WishReply[]> {
    const { data, error } = await this.client
      .from('wish_replies')
      .select('*')
      .eq('wish_id', wishId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((row: ReplyRow) => ({
      id: row.id,
      wishId: row.wish_id,
      displayName: row.display_name,
      body: row.body,
      isApproved: row.is_approved,
      createdAt: row.created_at,
    }));
  }

  // ── Views ─────────────────────────────────

  static async addView(wishId: string, userAgent?: string): Promise<void> {
    const { error } = await this.client
      .from('wish_views')
      .insert({
        wish_id: wishId,
        user_agent: userAgent || null,
      });

    if (error) throw new Error(error.message);
  }
}
