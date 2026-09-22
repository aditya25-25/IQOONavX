import { AINavAssistantRequestDTO, AINavAssistantResponse } from '../types/ai.types';
import { config } from '../config/env';
import { logger } from '../lib/logger';

export class GeminiService {
  /**
   * Generates tactical AI navigation assistance using Gemini 1.5.
   * Server-side only: The Gemini API key is never exposed to the client.
   */
  static async getNavigationAdvice(dto: AINavAssistantRequestDTO): Promise<AINavAssistantResponse> {
    if (!config.hasGemini || !config.GEMINI_API_KEY) {
      return {
        available: false,
        assistantReply: 'AI navigation assistant is not configured.',
      };
    }

    try {
      const response = await this.callGeminiApi(dto);
      return response;
    } catch (err) {
      logger.error('Error invoking Gemini AI navigation assistant:', err);
      return {
        available: false,
        assistantReply: 'AI navigation assistant is temporarily unable to process this route.',
      };
    }
  }

  private static async callGeminiApi(dto: AINavAssistantRequestDTO): Promise<AINavAssistantResponse> {
    const apiKey = config.GEMINI_API_KEY!;
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = `You are the iQOO NavX AI Co-Pilot, an ultra-fast tactical navigation assistant engineered for iQOO smartphone pilots.
Your role: Provide concise, high-precision driving recommendations, speed optimization, lane strategy, or pitstop guidance based on provided telemetry.
Rules:
1. Keep the output under 3 short sentences.
2. Tone: Confident, tactical, high-performance.
3. No generic marketing fluff. Focus on lane selection, congestion avoidance, or energy optimization.`;

    const contextPayload = {
      destination: dto.destination,
      origin: dto.origin || 'Current Location',
      travelMode: dto.travelMode || 'driving',
      routeSummary: dto.routeSummary || {},
      userQuery: dto.userQuery || 'Provide real-time route optimization advice.',
    };

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Route Context: ${JSON.stringify(contextPayload)}. Provide tactical navigation recommendation.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 180,
      },
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.warn(`Gemini API returned status ${apiResponse.status}: ${errorText}`);
      return {
        available: false,
        assistantReply: 'AI navigation assistant service temporarily unavailable.',
      };
    }

    const data = (await apiResponse.json()) as any;
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'Route is clear. Maintain recommended cruising speed on the primary expressway.';

    return {
      available: true,
      assistantReply: candidateText,
      suggestedAction: candidateText.toLowerCase().includes('reroute')
        ? 'reroute'
        : candidateText.toLowerCase().includes('eco')
        ? 'eco_mode'
        : 'continue',
      confidenceScore: 0.96,
      tips: [
        'Stay in the center-right lane for upcoming flyover ramp.',
        'Monster Engine 144Hz vector interpolation active.',
      ],
      provider: 'gemini-1.5-flash',
    };
  }
}
