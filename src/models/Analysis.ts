import mongoose, { Schema, Document, Model } from 'mongoose';
import type { RiskLevel, Shenanigan, LegalClarity } from '@/types/analysis';

export interface IAnalysis extends Document {
  inputHash: string;
  rawText: string;
  summary: string;
  riskLevel: RiskLevel;
  riskRationale: string;
  shenanigans: Shenanigan[];
  highlights: string[];
  legalClarity: LegalClarity;
  modelUsed: string;
  tokensUsed: number;
  processingTimeMs: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShenanigansSchema = new Schema<Shenanigan>(
  {
    clause: { type: String, required: true },
    explanation: { type: String, required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  },
  { _id: false }
);

const AnalysisSchema = new Schema<IAnalysis>(
  {
    inputHash: { type: String, required: true, index: true },
    rawText: { type: String, required: true },
    summary: { type: String, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
    riskRationale: { type: String, required: true },
    shenanigans: { type: [ShenanigansSchema], default: [] },
    highlights: { type: [String], default: [] },
    legalClarity: {
      score: { type: Number, required: true, min: 1, max: 10 },
      label: { type: String, required: true },
      explanation: { type: String, required: true },
    },
    modelUsed: { type: String, required: true },
    tokensUsed: { type: Number, default: 0 },
    processingTimeMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-delete after 30 days
AnalysisSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export const Analysis: Model<IAnalysis> =
  mongoose.models.Analysis ?? mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
