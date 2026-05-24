/**
 * FemCare AI — HTTP API client
 *
 * Thin fetch wrapper. Centralizes base URL, headers, error handling,
 * and timeouts so feature services (predictionService, etc.) stay clean.
 *
 * Configure via Vite env:
 *   VITE_API_BASE_URL   — e.g. https://api.femcare.ai  (default: "")
 *   VITE_API_TIMEOUT_MS — request timeout (default: 15000)
 *
 * To swap to axios later, only this file changes.
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

const DEFAULT_TIMEOUT_MS: number = Number(
  (import.meta.env.VITE_API_TIMEOUT_MS as string | undefined) ?? 15000
);

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public payload?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeoutMs?: number;
  /** When false, do not prefix with API_BASE_URL (use absolute path as-is). */
  absolute?: boolean;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, timeoutMs = DEFAULT_TIMEOUT_MS, absolute, headers, ...rest } = opts;
  const url = absolute ? path : `${API_BASE_URL}${path}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? safeJson(text) : null;

    if (!res.ok) {
      throw new ApiError(
        (data as any)?.message ?? res.statusText ?? "Request failed",
        res.status,
        data
      );
    }
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  del: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
