export type SearchParams = {
  fromId: string;
  fromName: string;
  fromLat: number;
  fromLon: number;
  fromSource: string;
  toId: string;
  toName: string;
  toLat: number;
  toLon: number;
  toSource: string;
  departureDate: string;
  arrivalDate: string;
  passagers: number;
  criteria: string;
};

export type InterpretedQuery = {
  type: "train" | "avion" | null;
  origin: string;
  destination: string;
  date: string;
  criteria: "price_min" | "price_max" | "best_balance" | null;
  max_price: number | null;
  flexible_days: boolean;
};

export type AISearchResponse = {
  searchParams: SearchParams;
  interpreted: InterpretedQuery;
};

export type AISearchError =
  | { kind: "BAD_INPUT"; message: string }
  | { kind: "ORIGIN_REQUIRED"; interpreted: Partial<InterpretedQuery> }
  | { kind: "NOT_UNDERSTOOD"; message: string }
  | { kind: "RATE_LIMIT"; message: string }
  | { kind: "SERVICE_DOWN"; message: string }
  | { kind: "UNKNOWN"; message: string };

export type GeolocStatus = "idle" | "loading" | "granted" | "denied" | "error";
