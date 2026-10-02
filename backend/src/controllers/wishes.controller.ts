import { Request, Response } from 'express';
import { WishesService } from '../services/wishes.service.js';
import { sanitizeHtml } from '../utils/sanitize.js';
import { ReactionType } from '../types/index.js';

function getParamString(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
}

export class WishesController {
  static async createWish(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'You must be signed in to create a wish.' });
        return;
      }

      const {
        templateSlug,
        occasion,
        title,
        recipientName,
        senderName,
        message,
        relationship,
        settings,
        isPublic,
      } = req.body;

      if (!recipientName || !message) {
        res.status(400).json({ error: 'Recipient name and message are required.' });
        return;
      }

      const wish = await WishesService.createWish({
        ownerId: user.id,
        templateSlug: templateSlug || 'birthday-balloon-blast',
        occasion: occasion || 'birthday',
        title: title ? sanitizeHtml(title) : undefined,
        recipientName: sanitizeHtml(recipientName),
        senderName: senderName ? sanitizeHtml(senderName) : (user.user_metadata?.display_name || 'Creator'),
        message: sanitizeHtml(message),
        relationship: relationship ? sanitizeHtml(relationship) : undefined,
        settings: settings || {},
        isPublic: isPublic !== false,
        isPublished: true,
      });

      res.status(201).json({
        success: true,
        wish,
        publicToken: wish.publicToken,
      });
    } catch (err: unknown) {
      console.error('Error creating wish:', err);
      const message = err instanceof Error ? err.message : 'Failed to create wish';
      res.status(500).json({ error: message });
    }
  }

  static async getWishByToken(req: Request, res: Response): Promise<void> {
    try {
      const token = getParamString(req.params.token);
      if (!token) {
        res.status(400).json({ error: 'Token parameter is required' });
        return;
      }

      const wish = await WishesService.getWishByToken(token);
      if (!wish) {
        res.status(404).json({ error: 'Wish not found' });
        return;
      }

      res.status(200).json(wish);
    } catch (err: unknown) {
      console.error('Error fetching wish:', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch wish';
      res.status(500).json({ error: message });
    }
  }

  static async getPublicWishes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const occasion = (req.query.occasion as string) || null;

      const result = await WishesService.getPublicWishes({ page, limit, occasion });
      res.status(200).json(result);
    } catch (err: unknown) {
      console.error('Error listing public wishes:', err);
      const message = err instanceof Error ? err.message : 'Failed to list wishes';
      res.status(500).json({ error: message });
    }
  }

  // ── Reactions ─────────────────────────────

  static async getReactions(req: Request, res: Response): Promise<void> {
    try {
      const token = getParamString(req.params.token);
      const wish = await WishesService.getWishByToken(token);
      if (!wish) {
        res.status(404).json({ error: 'Wish not found' });
        return;
      }

      const reactions = await WishesService.getReactions(wish.id);
      res.status(200).json(reactions);
    } catch (err: unknown) {
      console.error('Error getting reactions:', err);
      const message = err instanceof Error ? err.message : 'Failed to get reactions';
      res.status(500).json({ error: message });
    }
  }

  static async addReaction(req: Request, res: Response): Promise<void> {
    try {
      const token = getParamString(req.params.token);
      const wish = await WishesService.getWishByToken(token);
      if (!wish) {
        res.status(404).json({ error: 'Wish not found' });
        return;
      }

      const { reactionType } = req.body;
      if (!reactionType) {
        res.status(400).json({ error: 'reactionType is required' });
        return;
      }

      const sanitizedReaction = sanitizeHtml(reactionType) as ReactionType;
      const reaction = await WishesService.addReaction(wish.id, sanitizedReaction);
      res.status(201).json(reaction);
    } catch (err: unknown) {
      console.error('Error adding reaction:', err);
      const message = err instanceof Error ? err.message : 'Failed to add reaction';
      res.status(500).json({ error: message });
    }
  }

  // ── Replies ───────────────────────────────

  static async getReplies(req: Request, res: Response): Promise<void> {
    try {
      const token = getParamString(req.params.token);
      const wish = await WishesService.getWishByToken(token);
      if (!wish) {
        res.status(404).json({ error: 'Wish not found' });
        return;
      }

      const replies = await WishesService.getReplies(wish.id);
      res.status(200).json(replies);
    } catch (err: unknown) {
      console.error('Error getting replies:', err);
      const message = err instanceof Error ? err.message : 'Failed to get replies';
      res.status(500).json({ error: message });
    }
  }

  static async addReply(req: Request, res: Response): Promise<void> {
    try {
      const token = getParamString(req.params.token);
      const wish = await WishesService.getWishByToken(token);
      if (!wish) {
        res.status(404).json({ error: 'Wish not found' });
        return;
      }

      const { displayName, body } = req.body;
      if (!body) {
        res.status(400).json({ error: 'Reply body is required' });
        return;
      }

      const sanitizedName = displayName ? sanitizeHtml(displayName) : 'Anonymous';
      const sanitizedBody = sanitizeHtml(body);

      const reply = await WishesService.addReply(wish.id, sanitizedName, sanitizedBody);
      res.status(201).json(reply);
    } catch (err: unknown) {
      console.error('Error adding reply:', err);
      const message = err instanceof Error ? err.message : 'Failed to add reply';
      res.status(500).json({ error: message });
    }
  }

  // ── Views ─────────────────────────────────

  static async trackView(req: Request, res: Response): Promise<void> {
    try {
      const token = getParamString(req.params.token);
      const wish = await WishesService.getWishByToken(token);
      if (!wish) {
        res.status(404).json({ error: 'Wish not found' });
        return;
      }

      const userAgent = Array.isArray(req.headers['user-agent']) 
        ? req.headers['user-agent'][0] 
        : req.headers['user-agent'];
      await WishesService.addView(wish.id, userAgent);
      res.status(201).json({ success: true });
    } catch (err: unknown) {
      console.error('Error tracking view:', err);
      const message = err instanceof Error ? err.message : 'Failed to track view';
      res.status(500).json({ error: message });
    }
  }
}
