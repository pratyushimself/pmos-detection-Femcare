/**
 * FemCare AI — Prediction Service
 *
 * Single, stable contract used by every UI component:
 *
 *   const result = await predictionService.predict(input);
 *
 * Internally it picks an inference provider based on env config:
 *
 *   VITE_PREDICTION_PROVIDER = "mock" | "api"   (default: "mock")
 *   VITE_PREDICTION_ENDPOINT = "/predict"        (default)
 *
 * When the FastAPI / Flask backend serving the TPOT model is ready,
 * set VITE_PREDICTION_PROVIDER=api and VITE_API_BASE_URL=https://...
 * No UI code changes are required.
 *
 * The mock provider lives in `./providers/mockProvider.ts` and contains
 * the rule-based heuristic. It is intentionally isolated so it can be
 * deleted in one step once the real model is live.
 */

import type { AssessmentInput, RiskResult } from "@/lib/scoring";
import { apiClient, ApiError } from "@/services/api/client";
import { mockPredictionProvider } from "./providers/mockProvider";

export type PredictionProviderId = "mock" | "api";

const PROVIDER: PredictionProviderId =
  ((import.meta.env.VITE_PREDICTION_PROVIDER as string | undefined) as PredictionProviderId) ??
  "mock";

const ENDPOINT: string =
  (import.meta.env.VITE_PREDICTION_ENDPOINT as string | undefined) ?? "/predict";

export interface PredictionProvider {
  id: PredictionProviderId;
  predict(input: AssessmentInput): Promise<RiskResult>;
}

/** Real backend provider — calls the future FastAPI/Flask /predict route. */
const apiPredictionProvider: PredictionProvider = {
  id: "api",
  async predict(input: AssessmentInput): Promise<RiskResult> {
    try {
      const heightM = input.heightCm / 100;
      const bmi = Number((input.weightKg / (heightM * heightM)).toFixed(1));

      const payload = {
        age: input.age,
        weight: input.weightKg,
        height: input.heightCm,

        irregular_cycle: input.irregularCycle === "yes" ? 1 : 0,
        cycle_length: input.cycleLength,

        hip_size: input.hipCm,
        waist_size: input.waistCm,
        whr: input.whr,

        weight_gain: input.weightGain === "yes" ? 1 : 0,
        hair_growth: input.hairGrowth === "yes" ? 1 : 0,
        skin_darkening: input.skinDarkening === "yes" ? 1 : 0,
        hair_loss: input.hairLoss === "yes" ? 1 : 0,

        pimples: input.acne === "yes" ? 1 : 0,

        fast_food:
          input.fastFood === "never" || input.fastFood === "rare"
            ? 0
            : 1,

        exercise:
          input.exercise === "often" || input.exercise === "daily"
            ? 1
            : 0,
      };

      const backendResult = await apiClient.post<any>(ENDPOINT, payload);

      const probability = backendResult.probability ?? 0;

      const riskResult: RiskResult = {
        total: probability,

  tier:
    probability < 35
      ? "low"
      : probability < 65
      ? "moderate"
      : "high",

  riskTier:
    probability <= 15
      ? "very-low"
      : probability <= 30
      ? "low"
      : probability <= 45
      ? "mild"
      : probability <= 60
      ? "moderate"
      : probability <= 75
      ? "elevated"
      : probability <= 90
      ? "high"
      : "severe",

  riskLabel:
    probability <= 15
      ? "Very Low Risk"
      : probability <= 30
      ? "Low Risk"
      : probability <= 45
      ? "Mild Hormonal Irregularity"
      : probability <= 60
      ? "Moderate Hormonal Disruption"
      : probability <= 75
      ? "Elevated PMOS Likelihood"
      : probability <= 90
      ? "High PMOS Probability"
      : "Severe Hormonal Risk Pattern",

  confidence: 0.92,

  categories: {
    hormonal: probability,
    cycle: probability * 0.9,
    metabolic: probability * 0.75,
    lifestyle: probability * 0.6,
  },

  bmi,

  bmiBand:
    bmi < 18.5
      ? "underweight"
      : bmi < 25
      ? "normal"
      : bmi < 30
      ? "overweight"
      : "obese",

  whrBand:
    input.whr < 0.8
      ? "low"
      : input.whr < 0.85
      ? "elevated"
      : "high",

  drivers: [
  {
    key: "cycle",
    label: "Cycle Irregularity",
    weight:
      input.irregularCycle === "yes"
        ? Math.min(100, probability * 0.95)
        : probability * 0.25,
    detail:
      "Irregular and prolonged menstrual cycles strongly influence PMOS screening.",
  },

  {
    key: "symptoms",
    label: "Hormonal Symptoms",
    weight:
      [
        input.hairGrowth,
        input.skinDarkening,
        input.hairLoss,
        input.acne,
      ].filter((x) => x === "yes").length *
      22,
    detail:
      "Hair growth, acne, skin darkening and hair loss contribute to hormonal imbalance detection.",
  },

  {
    key: "metabolic",
    label: "Metabolic Indicators",
    weight:
      input.weightGain === "yes"
        ? Math.min(100, probability * 0.7)
        : probability * 0.35,
    detail:
      "Weight fluctuations and waist-to-hip ratio are associated with metabolic syndromes.",
  },

  {
    key: "lifestyle",
    label: "Lifestyle Pattern",
    weight:
      input.fastFood === "often"
        ? 75
        : input.fastFood === "sometimes"
        ? 45
        : 15,
    detail:
      "Diet quality and physical activity affect long-term hormonal health.",
  },
],

  narrative:
    probability < 35
      ? "Your hormonal indicators currently appear balanced."
      : probability < 65
      ? "Some hormonal and metabolic indicators deserve attention."
      : "Multiple indicators align strongly with elevated PMOS likelihood.",

  recommendations: [
    {
      title: "Maintain hormonal balance",
      body:
        "Regular exercise, sleep quality and stable nutrition improve endocrine health.",
      tone: "warm",
      category: "lifestyle",
      priority: "medium",
    },
  ],

  modelVersion: "FemCare-TPOT-v1",
};

return riskResult;
    } catch (err) {
      if (err instanceof ApiError) {
        // Surface a typed error; UI may decide to fallback.
        throw err;
      }
      throw new ApiError("Network error contacting prediction service", 0, err);
    }
  },
};

const providers: Record<PredictionProviderId, PredictionProvider> = {
  mock: mockPredictionProvider,
  api: apiPredictionProvider,
};

export const predictionService = {
  /** Active provider (read-only). */
  get providerId(): PredictionProviderId {
    return PROVIDER;
  },

  /** Single entry point used by the UI. */
  async predict(input: AssessmentInput): Promise<RiskResult> {
    return providers[PROVIDER].predict(input);
  },

  /** Escape hatch for tests / debug screens. */
  withProvider(id: PredictionProviderId) {
    return providers[id];
  },
};
