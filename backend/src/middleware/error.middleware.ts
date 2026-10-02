import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Unhandled Server Error:', err);
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(500).json({ error: message });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}
