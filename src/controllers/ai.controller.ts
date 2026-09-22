import { Request, Response, NextFunction } from 'express';
import { GeminiService } from '../services/gemini.service';
import { sendSuccess } from '../utils/response';

export class AIController {
  /**
   * POST /api/v1/ai/navigation-assistant
   * Provides tactical AI navigation Co-Pilot assistance via Gemini 1.5.
   */
  static async getAssistantAdvice(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await GeminiService.getNavigationAdvice(req.body);
      return sendSuccess(res, response);
    } catch (error) {
      return next(error);
    }
  }
}
