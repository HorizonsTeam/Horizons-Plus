import axios, { AxiosError } from "axios";
import type { AISearchResponse, AISearchError } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3005";

type ResolvedPlace = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  source: string;
};

type Payload = {
  query: string;
  userLocation?: { lat: number; lon: number };
  originOverride?: ResolvedPlace;
};

export async function callAISearch(payload: Payload): Promise<AISearchResponse> {
  try {
    const { data } = await axios.post<AISearchResponse>(
      `${API_BASE}/api/ai-search`,
      payload,
      { timeout: 10_000 }
    );
    return data;
  } catch (err) {
    throw mapAxiosError(err);
  }
}

function mapAxiosError(err: unknown): AISearchError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ error?: string; message?: string; interpreted?: any }>;
    const status = ax.response?.status;
    const body = ax.response?.data;

    if (status === 429) {
      return { kind: "RATE_LIMIT", message: body?.error || "Trop de requêtes" };
    }
    if (status === 400) {
      return { kind: "BAD_INPUT", message: body?.error || "Requête invalide" };
    }
    if (status === 422 && body?.error === "ORIGIN_REQUIRED") {
      return { kind: "ORIGIN_REQUIRED", interpreted: body.interpreted || {} };
    }
    if (status === 422) {
      return { kind: "NOT_UNDERSTOOD", message: body?.error || "Phrase non comprise" };
    }
    if (status === 503) {
      return { kind: "SERVICE_DOWN", message: body?.error || "Service IA indisponible" };
    }
  }
  return { kind: "UNKNOWN", message: "Erreur inattendue" };
}
