import clockIco from "../../../../../assets/clock.svg";
import type { Stop, Leg } from "../../components/Recap/Correspendances.tsx";

type RoadDetailsProps = {
    stops: Stop[];
    legs: Leg[];
    formattedDepartureDate: string;
    passagersCount: number;
    journey: any;
};

type Segment = {
    mode: Leg["mode"];
    fromIndex: number;
    toIndex: number;
};

function modeTitle(mode: Leg["mode"]) {
    return mode === "rail" ? "Trajet en train" : "Vol";
}
function modeIcon(mode: Leg["mode"]) {
    return mode === "rail" ? "🚆" : "✈️";
}
function stopLabel(stop: Stop) {
    return `${stop.city} — ${stop.placeName}`;
}

/** Regroupe les legs consécutifs de même mode en gros segments */
function buildSegments(legs: Leg[]): Segment[] {
    const sorted = [...legs].sort((a, b) => a.fromIndex - b.fromIndex);
    const segments: Segment[] = [];

    for (const leg of sorted) {
        const last = segments[segments.length - 1];
        if (!last) {
            segments.push({ mode: leg.mode, fromIndex: leg.fromIndex, toIndex: leg.toIndex });
            continue;
        }

        const isContiguous = last.toIndex === leg.fromIndex;
        const sameMode = last.mode === leg.mode;

        if (isContiguous && sameMode) {
            last.toIndex = leg.toIndex;
        } else {
            segments.push({ mode: leg.mode, fromIndex: leg.fromIndex, toIndex: leg.toIndex });
        }
    }

    return segments;
}

export default function RoadDetails({
    stops,
    legs,
    formattedDepartureDate,
    passagersCount,
    journey,
}: RoadDetailsProps) {
    const hasStops = Array.isArray(stops) && stops.length >= 2;
    const segments = Array.isArray(legs) ? buildSegments(legs) : [];

    const firstStop = hasStops ? stops[0] : null;
    const lastStop = hasStops ? stops[stops.length - 1] : null;


    return (
        <section className="w-full m-15">
            <div className="w-full bg-[#133A40] rounded-2xl border-2 border-[#2C474B]">
                {/* HEADER DATE */}
                <div className="px-4 pt-5">
                    <p className="font-bold w-full text-center">{formattedDepartureDate}</p>
                </div>

                {/* RÉSUMÉ GLOBAL */}
                <div className="mt-5 border-t-2 border-b-2 border-[#2C474B] px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="font-bold text-white">
                                {journey?.departureTime ?? firstStop?.arrival ?? "--:--"}
                                <span className="text-white/60 font-medium"> → </span>
                                {journey?.arrivalTime ?? lastStop?.arrival ?? "--:--"}
                            </p>

                            <p className="text-sm text-white/80 mt-1 break-words">
                                <span className="font-bold">{journey?.departureName ?? firstStop?.city ?? "Départ"}</span>
                                <span className="text-white/60"> → </span>
                                <span className="font-bold">{journey?.arrivalName ?? lastStop?.city ?? "Arrivée"}</span>
                            </p>

                            <p className="text-xs text-white/60 mt-1">
                                {passagersCount} passager{(passagersCount ?? 1) > 1 ? "s" : ""} •{" "}
                                {stops?.length ?? 0} arrêt{(stops?.length ?? 0) > 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <img src={clockIco} className="h-5 w-5" alt="" />
                            <span className="font-bold text-xl">{journey?.duration ?? ""}</span>
                        </div>
                    </div>
                </div>

               

                {/* ITINÉRAIRE (SEGMENTS) */}
                <div className="px-4 pb-5">
                    <h3 className="font-semibold text-[#98EAF3] mb-3">Itinéraire détaillé</h3>

                    {!hasStops ? (
                        <p className="text-sm text-white/70">Trajet indisponible.</p>
                    ) : segments.length === 0 ? (
                        <p className="text-sm text-white/70">Aucun segment disponible.</p>
                    ) : (
                        <div className="space-y-3">
                            {segments.map((seg, sidx) => {
                                const segmentStops = stops.slice(seg.fromIndex, seg.toIndex + 1);
                                const segStart = segmentStops[0];
                                const segEnd = segmentStops[segmentStops.length - 1];

                                return (
                                    <article
                                        key={`${seg.mode}-${seg.fromIndex}-${seg.toIndex}`}
                                        className="rounded-2xl border border-[#2C474B] bg-[#0F2F34] p-4"
                                    >
                                        {/* titre segment */}
                                        <header className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-lg" aria-hidden="true">{modeIcon(seg.mode)}</span>
                                                <p className="font-semibold text-white truncate">{modeTitle(seg.mode)}</p>
                                            </div>

                                            <p className="text-xs text-white/60 shrink-0">
                                                {segStart?.arrival ?? "--:--"} → {segEnd?.arrival ?? "--:--"}
                                            </p>
                                        </header>

                                        {/* ligne route */}
                                        <p className="text-sm text-white/80 mt-2 break-words">
                                            <span className="font-bold">{segStart?.city}</span>
                                            <span className="text-white/50"> → </span>
                                            <span className="font-bold">{segEnd?.city}</span>
                                        </p>

                                        {/* liste des arrêts du segment */}
                                        <ol className="mt-3 space-y-2">
                                            {segmentStops.map((st, i) => {
                                                const isFirst = i === 0;
                                                const isLast = i === segmentStops.length - 1;

                                                return (
                                                    <li key={`${st.placeName}-${i}`} className="flex items-start gap-3">
                                                        {/* heure */}
                                                        <span className="text-xs text-white/70 w-12 pt-0.5">
                                                            {st.arrival}
                                                        </span>

                                                        {/* puce + contenu */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={[
                                                                        "h-2.5 w-2.5 rounded-full border-2",
                                                                        isFirst
                                                                            ? "bg-gray-400 border-white"
                                                                            : isLast
                                                                                ? "bg-black border-white"
                                                                                : "bg-[#98EAF3] border-[#98EAF3]",
                                                                    ].join(" ")}
                                                                    aria-hidden="true"
                                                                />
                                                                <p className="font-semibold text-white truncate">
                                                                    {st.city}
                                                                    <span className="text-white/60 font-medium">
                                                                        {st.kind === "station" ? " • Gare" : " • Aéroport"}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <p className="text-sm text-white/75 break-words ml-5">
                                                                {st.placeName}
                                                            </p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ol>

                                        {/* correspondance (si segment suivant) */}
                                        {sidx < segments.length - 1 && (
                                            <div className="mt-4 rounded-xl border border-[#2C474B] bg-[#133A40] px-3 py-2">
                                                <p className="text-xs text-white/80">
                                                    Correspondance à{" "}
                                                    <span className="font-semibold">
                                                        {stopLabel(stops[seg.toIndex])}
                                                    </span>
                                                    <span className="text-white/50"> • </span>
                                                    <span className="font-semibold">
                                                        {modeIcon(segments[sidx + 1].mode)} {modeTitle(segments[sidx + 1].mode)}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
