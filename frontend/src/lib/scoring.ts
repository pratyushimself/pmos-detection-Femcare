/**
 * FemCare AI — Risk Inference Layer
 *
 * The frontend talks to a single `inferRisk(input)` function that returns a
 * `RiskResult`. Today it's a transparent rule-based heuristic running locally
 * (see `localInferenceProvider`). When the real ML backend is ready, swap the
 * implementation of `inferRisk` to call the API while keeping the contract
 * identical — no UI changes required.
 */

export type YesNo = "yes" | "no";
export type Frequency = "never" | "rare" | "sometimes" | "often" | "daily";

/** Exactly the 15 inputs requested. */
export interface AssessmentInput {
  age: number;            // years
  weightKg: number;       // kg
  heightCm: number;       // cm
  irregularCycle: YesNo;
  cycleLength: number;    // days
  hipCm: number;          // cm
  waistCm: number;        // cm
  whr: number;            // computed waist/hip
  weightGain: YesNo;      // recent unexplained weight gain
  hairGrowth: YesNo;      // excess hair (face/chest/back)
  skinDarkening: YesNo;   // acanthosis nigricans
  hairLoss: YesNo;        // scalp thinning
  acne: YesNo;            // pimples / acne
  fastFood: Frequency;    // fast food consumption
  exercise: Frequency;    // workout habit
}

export interface CategoryScores {
  hormonal: number;
  cycle: number;
  metabolic: number;
  lifestyle: number;
}

export interface DriverContribution {
  key: string;
  label: string;
  weight: number; // 0..100 normalized contribution to total
  detail: string;
}

type RecommendationTone = "calm" | "warm" | "educational" | "supportive" | "alert";
export type RecommendationPriority = "high" | "medium" | "low";

export interface Recommendation {
  title: string;
  body: string;
  tone: RecommendationTone;
  category: "do" | "avoid" | "lifestyle" | "preventive";
  priority: RecommendationPriority;
}

export type RiskTier =
  | "very-low"
  | "low"
  | "mild"
  | "moderate"
  | "elevated"
  | "high"
  | "severe";

export interface RiskResult {
  total: number;          // 0..100
  tier: "low" | "moderate" | "high";
  riskTier: RiskTier;
  riskLabel: string;
  confidence: number;     // 0..1 (heuristic confidence)
  categories: CategoryScores;
  bmi: number;
  bmiBand: "underweight" | "normal" | "overweight" | "obese";
  whrBand: "low" | "elevated" | "high";
  drivers: DriverContribution[];
  narrative: string;
  recommendations: Recommendation[];
  modelVersion: string;
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const yes = (v: YesNo) => v === "yes";

const freqScore: Record<Frequency, number> = {
  never: 0, rare: 18, sometimes: 45, often: 75, daily: 100,
};

const riskProfiles: Array<{
  max: number;
  tier: RiskTier;
  label: string;
  tone: RecommendationTone;
  narrative: string;
}> = [
  {
    max: 15,
    tier: "very-low",
    label: "Very Low Risk",
    tone: "calm",
    narrative:
      "Your current profile is very reassuring. Keep building steady habits, and continue monitoring your cycle and symptoms over time.",
  },
  {
    max: 30,
    tier: "low",
    label: "Low Risk",
    tone: "calm",
    narrative:
      "Your indicators are generally stable. A few thoughtful lifestyle choices can help preserve balance as your hormones and cycle evolve.",
  },
  {
    max: 45,
    tier: "mild",
    label: "Mild Hormonal Irregularity",
    tone: "educational",
    narrative:
      "Mild hormonal irregularity is visible. This is a good moment to lean into sleep, nutrition and gentle symptom tracking.",
  },
  {
    max: 60,
    tier: "moderate",
    label: "Moderate Hormonal Disruption",
    tone: "educational",
    narrative:
      "Moderate disruption is present on one or more axes. Prioritize consistent sleep, nutrient quality, and cycle awareness to support resiliency.",
  },
  {
    max: 75,
    tier: "elevated",
    label: "Elevated PMOS Likelihood",
    tone: "supportive",
    narrative:
      "Elevated risk is suggested by a mix of cycle, metabolic, and hormonal signals. Focus on gentle, sustainable habits that support insulin and reproductive health.",
  },
  {
    max: 90,
    tier: "high",
    label: "High PMOS Probability",
    tone: "supportive",
    narrative:
      "High probability patterns are present. Supportive nutrition, regular movement and focused tracking are especially useful right now.",
  },
  {
    max: 100,
    tier: "severe",
    label: "Severe Hormonal Risk Pattern",
    tone: "supportive",
    narrative:
      "A stronger hormonal risk pattern is showing. Keep guidance educational and steady while you prepare for more detailed clinical review.",
  },
];

const getRiskProfile = (total: number) =>
  riskProfiles.find((profile) => total <= profile.max) ?? riskProfiles[riskProfiles.length - 1];

const getConcernLevel = (value: number) =>
  value <= 25 ? "balanced" : value <= 50 ? "mild" : value <= 75 ? "moderate" : "high";

const priorityValue: Record<RecommendationPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const recommend = (list: Recommendation[], rec: Recommendation) => {
  if (!list.some((existing) => existing.title === rec.title)) {
    list.push(rec);
  }
};

/* =============================================================
 * Local heuristic provider — replace with API call when ready.
 * ============================================================ */
function localInferenceProvider(i: AssessmentInput): RiskResult {
  const h = i.heightCm / 100;
  const bmi = h > 0 ? i.weightKg / (h * h) : 0;
  const bmiBand: RiskResult["bmiBand"] =
    bmi < 18.5 ? "underweight" : bmi < 25 ? "normal" : bmi < 30 ? "overweight" : "obese";
  const whr = i.whr || (i.hipCm > 0 ? i.waistCm / i.hipCm : 0);
  const whrBand: RiskResult["whrBand"] = whr < 0.8 ? "low" : whr < 0.85 ? "elevated" : "high";

  // ─── Hormonal axis (androgen + insulin signals) ──────────────
  let hormonal = 0;
  if (yes(i.hairGrowth)) hormonal += 32;
  if (yes(i.acne)) hormonal += 22;
  if (yes(i.hairLoss)) hormonal += 22;
  if (yes(i.skinDarkening)) hormonal += 28;
  hormonal = clamp(hormonal);

  // ─── Cycle axis ──────────────────────────────────────────────
  let cycle = 0;
  if (yes(i.irregularCycle)) cycle += 55;
  if (i.cycleLength < 21 || i.cycleLength > 35) cycle += 25;
  if (i.cycleLength > 45) cycle += 20;
  cycle = clamp(cycle);

  // ─── Metabolic axis (BMI, WHR, weight gain) ──────────────────
  let metabolic = 0;
  if (bmiBand === "overweight") metabolic += 25;
  if (bmiBand === "obese") metabolic += 50;
  if (bmiBand === "underweight") metabolic += 12;
  if (whrBand === "elevated") metabolic += 15;
  if (whrBand === "high") metabolic += 30;
  if (yes(i.weightGain)) metabolic += 18;
  metabolic = clamp(metabolic);

  // ─── Lifestyle axis ──────────────────────────────────────────
  const fastScore = freqScore[i.fastFood];
  const exScore = 100 - freqScore[i.exercise];
  let lifestyle = clamp(fastScore * 0.55 + exScore * 0.45);

  // Weighted total
  const total = clamp(Math.round(
    hormonal * 0.32 + cycle * 0.30 + metabolic * 0.22 + lifestyle * 0.16
  ));
  const tier: RiskResult["tier"] = total < 35 ? "low" : total < 65 ? "moderate" : "high";

  // ─── Drivers (normalized contribution to the total) ─────────
  const rawDrivers: { key: string; label: string; raw: number; detail: string }[] = [
    { key: "hormonal", label: "Hormonal signals", raw: hormonal * 0.32, detail: `Androgen-related signs combined into ${Math.round(hormonal)}/100.` },
    { key: "cycle", label: "Cycle irregularity", raw: cycle * 0.30, detail: `Cycle pattern scored ${Math.round(cycle)}/100 (${i.cycleLength} day length${yes(i.irregularCycle) ? ", irregular" : ""}).` },
    { key: "metabolic", label: "Metabolic & body composition", raw: metabolic * 0.22, detail: `BMI ${bmi.toFixed(1)} (${bmiBand}), WHR ${whr.toFixed(2)} (${whrBand}).` },
    { key: "lifestyle", label: "Lifestyle factors", raw: lifestyle * 0.16, detail: `Fast food ${i.fastFood}, exercise ${i.exercise}.` },
  ];
  const sumRaw = Math.max(1, rawDrivers.reduce((s, d) => s + d.raw, 0));
  const drivers: DriverContribution[] = rawDrivers
    .map((d) => ({ key: d.key, label: d.label, detail: d.detail, weight: Math.round((d.raw / sumRaw) * 100) }))
    .sort((a, b) => b.weight - a.weight);

  // ─── Recommendations ────────────────────────────────────────
  const riskProfile = getRiskProfile(total);
  const tone: Recommendation["tone"] = riskProfile.tone;
  const recs: Recommendation[] = [];

  const symptoms = [
    { label: "acne", active: yes(i.acne) },
    { label: "hair growth", active: yes(i.hairGrowth) },
    { label: "hair loss", active: yes(i.hairLoss) },
    { label: "skin darkening", active: yes(i.skinDarkening) },
  ];
  const symptomLabels = symptoms.filter((s) => s.active).map((s) => s.label);
  const hasHormonalSymptoms = symptomLabels.length > 0;
  const hormonalConcern = getConcernLevel(hormonal);
  const cycleConcern = getConcernLevel(cycle);
  const metabolicConcern = getConcernLevel(metabolic);
  const lifestyleConcern = getConcernLevel(lifestyle);
  const isHighBMI = bmiBand === "overweight" || bmiBand === "obese";
  const isHighWHR = whrBand === "elevated" || whrBand === "high";
  const strongHormonal = hormonal > 50;
  const strongCycle = cycle > 50 || i.irregularCycle === "yes" || i.cycleLength > 35;
  const strongMetabolic = metabolic > 50 || isHighBMI || isHighWHR || yes(i.weightGain);
  const strongLifestyle = lifestyle > 50 || i.fastFood === "often" || i.fastFood === "daily" || i.exercise === "never" || i.exercise === "rare";

  recommend(recs, {
    title: "Keep a thoughtful tracking habit",
    body: "Tracking cycles, symptoms and daily routines makes this AI guidance more meaningful over time and helps you notice subtle shifts before they become larger patterns.",
    tone,
    category: "preventive",
    priority: "high",
  });

  if (strongHormonal || total >= 46) {
    recommend(recs, {
      title: "Support hormonal balance with sleep and stress care",
      body: "Prioritize 7–8 hours of consistent sleep and simple stress resilience practices. These habits support endocrine balance without dramatic change.",
      tone,
      category: "do",
      priority: "high",
    });
  }

  if (hasHormonalSymptoms) {
    recommend(recs, {
      title: "Monitor hormone-related symptoms closely",
      body: "Track acne, hair growth, hair loss, or skin darkening alongside meals, sleep and energy levels. This can reveal whether insulin resistance or androgen imbalance is influencing your pattern.",
      tone: strongHormonal ? "supportive" : "educational",
      category: "preventive",
      priority: "high",
    });
  }

  if (cycleConcern !== "balanced") {
    recommend(recs, {
      title: "Build better cycle consistency",
      body: "Keep menstrual tracking, hydration, and a regular sleep schedule at the center of your routine. Consistent rhythms help the body regulate hormones and reproductive signals.",
      tone,
      category: "do",
      priority: cycleConcern === "high" ? "high" : "medium",
    });
  }

  if (i.irregularCycle === "yes" || i.cycleLength > 45) {
    recommend(recs, {
      title: "Pay extra attention to cycle regularity",
      body: "Irregular or very long cycles are strong signals for reproductive awareness. Tracking them closely makes your next care conversation more informed.",
      tone: "supportive",
      category: "preventive",
      priority: "high",
    });
  }

  if (strongMetabolic) {
    recommend(recs, {
      title: "Support insulin sensitivity with balanced nutrition",
      body: "Choose whole foods, fiber-rich meals and lower-glycemic choices. Small consistency wins support metabolic health and hormonal resilience.",
      tone,
      category: "lifestyle",
      priority: "high",
    });
  }

  if (isHighBMI || isHighWHR || yes(i.weightGain)) {
    recommend(recs, {
      title: "Watch body composition and metabolic signals",
      body: "A waist-to-hip check and moderate nutrition shifts can improve metabolic balance over weeks. Focus on gradual, manageable changes rather than quick fixes.",
      tone: "educational",
      category: "preventive",
      priority: "high",
    });
  }

  if (lifestyleConcern !== "balanced") {
    recommend(recs, {
      title: "Strengthen daily habits around food, movement and rest",
      body: "Reducing fast food, keeping hydrated, and moving purposefully most days supports hormones, metabolism and mood together.",
      tone,
      category: "lifestyle",
      priority: lifestyleConcern === "high" ? "high" : "medium",
    });
  }

  if (i.fastFood === "often" || i.fastFood === "daily") {
    recommend(recs, {
      title: "Reduce ultra-processed meals",
      body: "Replacing a few fast-food meals each week with balanced whole-food options can ease insulin demand and improve overall hormonal tone.",
      tone: "educational",
      category: "avoid",
      priority: "high",
    });
  }

  if (i.exercise === "never" || i.exercise === "rare") {
    recommend(recs, {
      title: "Create a gentle movement routine",
      body: "Even short, consistent walks and strength-supporting movement can help insulin sensitivity and cycle health without adding pressure.",
      tone: "educational",
      category: "lifestyle",
      priority: "high",
    });
  }

  if (strongHormonal && strongMetabolic) {
    recommend(recs, {
      title: "Combine metabolic and hormonal support thoughtfully",
      body: "Focus on consistent meals, stress resilience, and moderate movement to support both insulin sensitivity and endocrine balance together.",
      tone: "supportive",
      category: "do",
      priority: "high",
    });
  }

  if (!strongHormonal && strongLifestyle && total <= 45) {
    recommend(recs, {
      title: "Use lifestyle strength as your first line of support",
      body: "A strong diet and better sleep are powerful tools for keeping hormones stable even when overall risk is mild.",
      tone: "calm",
      category: "lifestyle",
      priority: "high",
    });
  }

  if (recs.length < 4) {
    recommend(recs, {
      title: "Stay consistent with supportive habits",
      body: "Small, steady changes in sleep, movement, and food quality are the most effective way to keep hormonal health in a stable range.",
      tone,
      category: "lifestyle",
      priority: "medium",
    });
  }

  const sortedRecommendations = recs
    .sort((a, b) => priorityValue[b.priority] - priorityValue[a.priority])
    .slice(0, Math.min(8, recs.length));

  return {
    total,
    tier,
    riskTier: riskProfile.tier,
    riskLabel: riskProfile.label,
    confidence: 0.78,
    categories: { hormonal, cycle, metabolic, lifestyle },
    bmi: Math.round(bmi * 10) / 10,
    bmiBand,
    whrBand,
    drivers,
    narrative: riskProfile.narrative,
    recommendations: sortedRecommendations,
    modelVersion: "femcare-heuristic-1.0",
  };
}

/**
 * Public entry point. Async so a real model API can drop in later
 * without changing any caller. Today it resolves synchronously.
 */
export async function inferRisk(input: AssessmentInput): Promise<RiskResult> {
  // To swap in the real ML backend later, replace the body with:
  //   const res = await fetch('/api/infer', { method: 'POST', body: JSON.stringify(input) });
  //   return res.json();
  return Promise.resolve(localInferenceProvider(input));
}

export const tierMeta = {
  low: {
    label: "Low likelihood",
    color: "hsl(var(--risk-low))",
    bg: "calm" as const,
    blurb: "Your indicators look balanced and reassuring.",
  },
  moderate: {
    label: "Moderate likelihood",
    color: "hsl(var(--risk-mod))",
    bg: "warm" as const,
    blurb: "A few patterns deserve attention and proactive support.",
  },
  high: {
    label: "Elevated likelihood",
    color: "hsl(var(--risk-high))",
    bg: "alert" as const,
    blurb: "Multiple indicators align — please consult a healthcare provider.",
  },
};
