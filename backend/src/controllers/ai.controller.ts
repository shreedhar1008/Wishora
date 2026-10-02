import { Request, Response } from 'express';
import { AiService } from '../services/ai.service.js';

export class AiController {
  static generateWish(req: Request, res: Response): void {
    try {
      const { recipientName, senderName, occasion, relationship, tone, customDetails } = req.body;

      const result = AiService.generateWish({
        recipientName,
        senderName,
        occasion,
        relationship,
        tone,
        customDetails,
      });

      res.status(200).json(result);
    } catch (err: unknown) {
      console.error('Error generating wish message:', err);
      const message = err instanceof Error ? err.message : 'Failed to generate wish message';
      res.status(500).json({ error: message });
    }
  }
}
