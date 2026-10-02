import { Router } from 'express';
import { WishesController } from '../controllers/wishes.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public wishes listing
router.get('/', WishesController.getPublicWishes);

// Create wish (requires authenticated Supabase user)
router.post('/', requireAuth, WishesController.createWish);

// Get single wish by public token
router.get('/:token', WishesController.getWishByToken);

// Reactions
router.get('/:token/reactions', WishesController.getReactions);
router.post('/:token/reactions', WishesController.addReaction);

// Replies
router.get('/:token/replies', WishesController.getReplies);
router.post('/:token/replies', WishesController.addReply);

// Views tracking
router.post('/:token/views', WishesController.trackView);

export default router;
