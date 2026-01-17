import clockIco from "../../../../../assets/clock.svg";
import type { Stop, Leg } from "../../components/Recap/Correspendances.tsx";

type RoadDetailsProps = {
    stops: Stop[];
    legs: Leg[];
    formattedDepartureDate: string;
    passagersCount: number;
    journey: any;
};

function modeMeta(mode: Leg["mode"]) {
    switch (mode) {
        case "rail":
            return { icon: "🚆", label: "Trajet en train" };
        case "air":
            return { icon: "✈️", label: "Vol" };
        case "waiting":
            return { icon: "⏳", label: "Temps d’attente" };
        case "walking":
            return { icon: "🚶", label: "Correspondance à pied" };
        default:
            return { icon: "•", label: "Étape" };
    }
}

function stopLabel(stop?: Stop) {
    if (!stop) return "";
    return `${stop.city} — ${stop.placeName}`;
}

export default function RoadDetails({
    stops,
    legs,
    formattedDepartureDate,
    passagersCount,
    journey,
}: RoadDetailsProps) {
    const hasStops = Array.isArray(stops) && stops.length >= 2;

    const firstStop = hasStops ? stops[0] : null;
    const lastStop = hasStops ? stops[stops.length - 1] : null;

    return (
        <section className="w-full">
            <div className="w-full bg-[#133A40] rounded-2xl border-2 border-[#2C474B] overflow-hidden">
                {/* HEADER DATE */}
                <div className="px-4 pt-5">
                    <p className="font-bold w-full text-center">
                        {formattedDepartureDate}
                    </p>
                </div>

                {/* RÉSUMÉ GLOBAL */}
                <div className="mt-5 border-t-2 border-b-2 border-[#2C474B] px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="font-bold text-white">
                                {journey?.departureTime ?? firstStop?.arrival ?? "--:--"}
                                <span className="text-white font-medium"> → </span>
                                {journey?.arrivalTime ?? lastStop?.arrival ?? "--:--"}
                            </p>

                            <p className="text-sm text-white/80 mt-1 break-words">
                                <span className="font-bold">
                                    {journey?.departureName ?? firstStop?.city ?? "Départ"}
                                </span>
                                <span className="text-white/60"> → </span>
                                <span className="font-bold">
                                    {journey?.arrivalName ?? lastStop?.city ?? "Arrivée"}
                                </span>
                            </p>

                            <p className="text-xs text-white/60 mt-1">
                                {passagersCount} passager
                                {(passagersCount ?? 1) > 1 ? "s" : ""} •{" "}
                                {stops?.length ?? 0} arrêt
                                {(stops?.length ?? 0) > 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <img src={clockIco} className="h-5 w-5" alt="" />
                            <span className="font-bold text-xl">
                                {journey?.duration ?? ""}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ITINÉRAIRE */}
                <div className="px-4 pb-5">
                    <h3 className="font-semibold text-[#98EAF3] mb-3">
                        Itinéraire détaillé
                    </h3>

                    {!hasStops || !Array.isArray(legs) || legs.length === 0 ? (
                        <p className="text-sm text-white/70">Trajet indisponible.</p>
                    ) : (
                        <div className="space-y-4">
                            {legs.map((leg, idx) => {
                                const meta = modeMeta(leg.mode);

                                /* WAITING / WALKING = bloc intermédiaire */
                                if (leg.mode === "waiting" || leg.mode === "walking") {
                                    const stop = stops[leg.fromIndex];

                                    return (
                                        <div
                                            key={`intermediate-${idx}`}
                                            className="rounded-xl border border-[#2C474B] bg-[#133A40] px-4 py-3"
                                        >
                                            <p className="text-sm text-white/80 flex items-center gap-2 break-words">
                                                <span className="text-lg">{meta.icon}</span>
                                                <span className="font-semibold">{meta.label}</span>
                                                <span className="text-white/50">à</span>
                                                <span className="font-semibold">
                                                    {stopLabel(stop)}
                                                </span>
                                            </p>
                                        </div>
                                    );
                                }

                                /* RAIL / AIR = segment principal */
                                const segmentStops = stops.slice(
                                    leg.fromIndex,
                                    leg.toIndex + 1
                                );
                                const segStart = segmentStops[0];
                                const segEnd =
                                    segmentStops[segmentStops.length - 1];

                                return (
                                    <article
                                        key={`segment-${idx}`}
                                        className="rounded-2xl border border-[#2C474B] bg-[#0F2F34] p-4"
                                    >
                                        <header className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{meta.icon}</span>
                                                <p className="font-semibold text-white">
                                                    {meta.label}
                                                </p>
                                            </div>
                                            <p className="text-xs text-white/60 whitespace-nowrap">
                                                {segStart?.arrival ?? "--:--"} →{" "}
                                                {segEnd?.arrival ?? "--:--"}
                                            </p>
                                        </header>

                                        <p className="text-sm text-white/80 mt-2">
                                            <span className="font-bold">{segStart?.city}</span>
                                            <span className="text-white/50"> → </span>
                                            <span className="font-bold">{segEnd?.city}</span>
                                        </p>

                                        <ol className="mt-3 space-y-2">
                                            {segmentStops.map((st, i) => {
                                                const isFirst = i === 0;
                                                const isLast = i === segmentStops.length - 1;

                                                return (
                                                    <li
                                                        key={`${st.placeName}-${i}`}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <span className="text-xs text-white/70 w-12 shrink-0 pt-0.5">
                                                            {st.arrival}
                                                        </span>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={[
                                                                        "h-2.5 w-2.5 rounded-full border-2 shrink-0",
                                                                        isFirst
                                                                            ? "bg-gray-400 border-white"
                                                                            : isLast
                                                                                ? "bg-black border-white"
                                                                                : "bg-[#98EAF3] border-[#98EAF3]",
                                                                    ].join(" ")}
                                                                />
                                                                <p className="font-semibold text-white">
                                                                    {st.city}
                                                                    <span className="text-white/60 font-medium">
                                                                        {st.kind === "station"
                                                                            ? " • Gare"
                                                                            : " • Aéroport"}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <p className="text-sm text-white/75 ml-5">
                                                                {st.placeName}
                                                            </p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ol>
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
