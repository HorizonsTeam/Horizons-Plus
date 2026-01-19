import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import terIco from "../../../assets/ter_ico.svg";
import SiegeIco from "../../../assets/siege_ico.svg";
import trashcan from "../../../assets/trashcan.svg";
import type { TrainCardProps } from "../types.ts";

const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

function parseHHMM(hhmm: string): { h: number; m: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(mm)) return null;
  return { h, m: mm };
}

function durationLabel(start: string, end: string): string {
  const a = parseHHMM(start);
  const b = parseHHMM(end);
  if (!a || !b) return "—";
  const startMin = a.h * 60 + a.m;
  let endMin = b.h * 60 + b.m;
  if (endMin < startMin) endMin += 24 * 60;
  const d = endMin - startMin;
  const hh = Math.floor(d / 60);
  const mm = d % 60;
  return `${hh}h${String(mm).padStart(2, "0")}`;
}

export default function TrainCard({ item, onDeleted }: TrainCardProps) {
  const navigate = useNavigate();

  const handleDeletePanierItem = async (): Promise<void> => {
    try {
      const res = await fetch(`${base}/api/panier/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId: item.id }),
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      onDeleted(item.id);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier :", error);
      alert("Impossible de supprimer l'item.");
    }
  };

  const duree = useMemo(() => durationLabel(item.departHeure, item.arriveeHeure), [
    item.departHeure,
    item.arriveeHeure,
  ]);

  const prix = useMemo(() => {
    const n = Number(item.prix);
    return Number.isFinite(n) ? n.toFixed(2) : String(item.prix);
  }, [item.prix]);

  const handleVoirDetail = (): void => {
    navigate(`/train/${item.id}`);
  };

  return (
    <div
      onClick={handleVoirDetail}
      className="w-full rounded-3xl border border-[#2C474B] bg-[#0C2529] text-white px-4 py-4 sm:px-6 cursor-pointer"
    >
      <article>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#98EAF3] text-[#0C2529] font-bold text-xs px-3 py-1">
                Direct
              </span>
              <span className="text-xs text-white/60">TER</span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/60">n°{item.id}</span>
            </div>

            <h3 className="mt-2 text-lg sm:text-xl font-semibold text-[#98EAF3] truncate">
              {item.departLieu} → {item.arriveeLieu}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
              <span className="font-semibold">{item.departHeure}</span>
              <span className="text-white/40">→</span>
              <span className="font-semibold">{item.arriveeHeure}</span>
              <span className="text-white/40">•</span>
              <span>{duree}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <img src={terIco} alt="" className="h-4 w-4" />
                <span>{item.classe}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={SiegeIco} alt="" className="h-4 w-4" />
                <span>{item.siegeRestant} places</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-2xl font-extrabold">{prix}€</p>
            <p className="mt-1 text-xs font-semibold text-emerald-300">
              Il reste {item.siegeRestant}
            </p>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVoirDetail();
                }}
                className="h-9 px-4 rounded-full bg-[#FFB856] text-[#0C2529] font-bold text-sm hover:brightness-110 transition cursor-pointer"
              >
                Détail
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePanierItem();
                }}
                className="h-9 w-9 rounded-2xl bg-[#133A40] border border-[#2C474B] flex items-center justify-center hover:border-red-400/60 hover:bg-red-500/10 transition cursor-pointer"
                aria-label="Supprimer"
                title="Supprimer"
              >
                <img src={trashcan} alt="" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
