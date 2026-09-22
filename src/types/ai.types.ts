import { SupportedTravelMode } from './preferences.types';

export interface RouteContextSummary {
  distance?: string;
  duration?: string;
  currentStreet?: string;
  trafficCondition?: string;
  eta?: string;
}

export interface AINavAssistantRequestDTO {
  destination: string;
  origin?: string;
  travelMode?: SupportedTravelMode;
  routeSummary?: RouteContextSummary;
  userQuery?: string;
}

export interface AINavAssistantResponse {
  available: boolean;
  assistantReply: string;
  suggestedAction?: 'reroute' | 'continue' | 'find_pitstop' | 'eco_mode';
  confidenceScore?: number;
  tips?: string[];
  provider?: 'gemini-1.5-flash' | 'iqoo-copilot-engine';
}
