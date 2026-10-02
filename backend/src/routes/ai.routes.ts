import { Router } from 'express';
import { AiController } from '../controllers/ai.controller.js';

const router = Router();

router.post('/generate-wish', AiController.generateWish);

export default router;
