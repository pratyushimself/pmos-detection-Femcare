/**
 * Public service surface. Import from "@/services" everywhere in the UI:
 *
 *   import { predictionService } from "@/services";
 *   const result = await predictionService.predict(input);
 */
export { predictionService } from "./prediction/predictionService";
export type {
  PredictionProvider,
  PredictionProviderId,
} from "./prediction/predictionService";
export { apiClient, ApiError, API_BASE_URL } from "./api/client";
