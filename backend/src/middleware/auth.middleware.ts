import { Request, Response, NextFunction } from 'express';
import { getSupabaseClient } from '../config/supabase.js';
import { AuthenticatedUser } from '../types/index.js';

// Extend Express Request type to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Please sign in to continue.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Invalid authorization token.' });
      return;
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    };

    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication verification failed';
    res.status(401).json({ error: message });
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
          };
        }
      }
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
}
