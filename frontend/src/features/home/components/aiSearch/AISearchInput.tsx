import { useState, useRef, type KeyboardEvent } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "./useGeolocation";
import { useTypewriter } from "./useTypewriter";
import { callAISearch } from "./aiSearchClient";
import OriginFallbackInput from "./OriginFallbackInput";
import AILoadingOverlay from "./AILoadingOverlay";
import type { SearchParams } from "./types";
import type { Suggestion } from "../../../../components/autocomplete/types";

const MIN_LOADING_MS = 2900;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ensureMinDuration = async <T,>(promise: Promise<T>, minMs: number): Promise<T> => {
  const start = Date.now();
  const result = await promise;
  const remaining = minMs - (Date.now() - start);
  if (remaining > 0) await wait(remaining);
  return result;
};

export default function AISearchInput() {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingOriginQuery, setPendingOriginQuery] = useState<string | null>(null);

  const placeholder = useTypewriter(query.length > 0 || loading);

  const goToResults = (sp: SearchParams) => {
    const params = new URLSearchParams({
      fromId: sp.fromId,
      fromName: sp.fromName,
      fromLat: String(sp.fromLat),
      fromLon: String(sp.fromLon),
      fromSource: sp.fromSource,
      toId: sp.toId,
      toName: sp.toName,
      toLat: String(sp.toLat),
      toLon: String(sp.toLon),
      toSource: sp.toSource,
      departureDate: sp.departureDate,
      arrivalDate: sp.arrivalDate,
      passagers: String(sp.passagers),
    });
    if (sp.criteria) params.set("criteria", sp.criteria);
    navigate(`/Recherche?${params.toString()}`);
  };

  const handleError = (err: any) => {
    if (err?.kind === "ORIGIN_REQUIRED") {
      setPendingOriginQuery(query.trim());
      return;
    }
    if (err?.kind === "RATE_LIMIT") {
      setErrorMessage("Vous allez trop vite, réessayez dans une minute.");
    } else if (err?.kind === "NOT_UNDERSTOOD") {
      setErrorMessage(`Je n'ai pas compris. Essayez : "Train pour Lyon demain".`);
    } else if (err?.kind === "SERVICE_DOWN") {
      setErrorMessage("Service IA indisponible, utilisez le formulaire ci-dessous.");
    } else if (err?.kind === "BAD_INPUT") {
      setErrorMessage(err.message);
    } else {
      setErrorMessage("Erreur inattendue, réessayez.");
    }
  };

  const submit = async () => {
    if (loading || query.trim().length < 5) return;
    setErrorMessage(null);
    setPendingOriginQuery(null);
    setLoading(true);

    try {
      const payload: Parameters<typeof callAISearch>[0] = { query: query.trim() };
      if (geo.status === "granted" && geo.coords) {
        payload.userLocation = geo.coords;
      }
      const res = await ensureMinDuration(callAISearch(payload), MIN_LOADING_MS);
      goToResults(res.searchParams);
    } catch (err: any) {
      // Even on error, give the overlay enough time to read 1-2 steps before showing the error.
      const elapsed = err?.__elapsed ?? 0;
      const minErrorWait = 800;
      if (elapsed < minErrorWait) await wait(minErrorWait - elapsed);
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const onOriginResolved = async (origin: Suggestion) => {
    if (!pendingOriginQuery) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await ensureMinDuration(
        callAISearch({
          query: pendingOriginQuery,
          originOverride: {
            id: origin.id,
            name: origin.name,
            lat: origin.lat,
            lon: origin.lon,
            source: origin.source,
          },
        }),
        MIN_LOADING_MS
      );
      goToResults(res.searchParams);
    } catch {
      setErrorMessage("Impossible de finaliser la recherche, réessayez.");
    } finally {
      setLoading(false);
      setPendingOriginQuery(null);
    }
  };

  const submitDisabled = loading || query.trim().length < 5;

  return (
    <div className="px-4 lg:px-0 max-w-3xl mx-auto mb-8">
      {errorMessage && !loading && (
        <div className="mb-3 flex items-start gap-3 bg-red-500/15 border border-red-400/40 text-red-200 px-4 py-3 rounded-xl text-sm">
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-200/70 hover:text-white text-lg leading-none cursor-pointer shrink-0"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      )}

      <div className="relative rounded-2xl bg-gradient-to-r from-cyan-400/40 via-primary/40 to-cyan-400/40 p-[2px] shadow-xl">
        <div className="relative flex items-center bg-[#2C474B] rounded-2xl">
          <Sparkles className="w-5 h-5 text-cyan-300 ml-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 bg-transparent text-white placeholder-slate-400/80 px-3 py-4 lg:py-5 text-sm lg:text-base outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={submit}
            disabled={submitDisabled}
            className="mr-2 bg-primary text-[#115E66] font-semibold rounded-xl px-4 py-2 lg:px-5 lg:py-2.5 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span className="hidden lg:inline">Rechercher</span>
          </button>
        </div>
      </div>

      {pendingOriginQuery && !loading && (
        <OriginFallbackInput onResolved={onOriginResolved} />
      )}

      {loading && <AILoadingOverlay />}
    </div>
  );
}
