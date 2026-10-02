import { Router, Request, Response } from 'express';
import { isSupabaseConfigured } from '../config/supabase.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'wishora-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    supabaseConfigured: isSupabaseConfigured(),
  });
});

export default router;
