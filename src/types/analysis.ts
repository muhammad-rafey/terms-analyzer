export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Shenanigan {
  clause: string;
  explanation: string;
  severity: RiskLevel;
}

export interface LegalClarity {
  score: number;
  label: string;
  explanation: string;
}

export interface AnalysisResult {
  summary: string;
  riskLevel: RiskLevel;
  riskRationale: string;
  shenanigans: Shenanigan[];
  highlights: string[];
  legalClarity: LegalClarity;
}

export interface AnalysisResponse {
  _id?: string;
  summary: string;
  riskLevel: RiskLevel;
  riskRationale: string;
  shenanigans: Shenanigan[];
  highlights: string[];
  legalClarity: LegalClarity;
  modelUsed: string;
  tokensUsed: number;
  estimatedCostUsd: number;
  processingTimeMs: number;
  createdAt?: string;
}

export interface HistoryItem {
  _id: string;
  preview: string;
  riskLevel: RiskLevel;
  createdAt: string;
  summary: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  cached?: boolean;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
