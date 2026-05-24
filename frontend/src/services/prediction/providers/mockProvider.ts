/**
 * Mock Prediction Provider
 *
 * Wraps the existing local heuristic in `@/lib/scoring` behind the
 * `PredictionProvider` contract. Delete this file (and the "mock" branch
 * in predictionService.ts) once the real ML backend is live.
 */

import { inferRisk, type AssessmentInput, type RiskResult } from "@/lib/scoring";
import type { PredictionProvider } from "../predictionService";

export const mockPredictionProvider: PredictionProvider = {
  id: "mock",
  async predict(input: AssessmentInput): Promise<RiskResult> {
    return inferRisk(input);
  },
};
