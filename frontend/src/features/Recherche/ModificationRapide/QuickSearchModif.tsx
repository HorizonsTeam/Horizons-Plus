import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AutocompleteInput from "../../../components/autocomplete/AutocompleteInput";
import type { Suggestion } from "../../../components/autocomplete/types";
import { ArrowDownUp } from "lucide-react";
import TripTypeSwitch from "../ModificationRapide/TripTypeSwitch";
import { DateBtn } from "../../home/components/Date";
import Counter from "../../../components/AdditionalsComponents/Counter";

type TripType = "oneway" | "roundtrip";

type ModificationProps = {
    villeDepart: Suggestion | null | string;
    villeArrivee: Suggestion | null | string;
    dateSearch: string;
    BoxIsOn: boolean;
    setBoxIsOn: (value: boolean) => void;
    Passagers?: number;
    trip?: TripType;

    setIsLoading: (value: boolean) => void;
    setErrorMessage: (value: string | null) => void;

    setJourneyData: (value: any[]) => void;
    setTransport: (value: "train" | "plane") => void;
};

const makeSuggestion = (s: Suggestion | string): Suggestion => {
    if (typeof s === "string") {
        // IMPORTANT: on ne crée plus de "simulated" pour éviter les trajets bizarres
        return { id: "", name: s, source: "sncf", lat: 0, lon: 0, simulated: false };
    }
    return {
        id: s.id || s.name,
        name: s.name,
        source: s.source || "sncf",
        lat: s.lat || 0,
        lon: s.lon || 0,
        simulated: s.simulated ?? false,
    };
};

export default function QuickModificationOverlay({
    villeDepart,
    villeArrivee,
    Passagers,
    dateSearch,
    trip,
    BoxIsOn,
    setBoxIsOn,
    setIsLoading,
    setErrorMessage,
}: ModificationProps) {
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const [departure, setDeparture] = useState<Suggestion | null>(
        villeDepart ? makeSuggestion(villeDepart) : null
    );
    const [arrival, setArrival] = useState<Suggestion | null>(
        villeArrivee ? makeSuggestion(villeArrivee) : null
    );

    const [departureDate, setDepartureDate] = useState(dateSearch || today);
    const [returnDate, setReturnDate] = useState<string>("");
    const [passagers, setPassagers] = useState(Passagers ?? 1);
    const [tripType, setTripType] = useState<TripType>(trip ?? "oneway");
    const [rotation, setRotation] = useState(0);

    const validateDate = useCallback(
        (value: string, setter: (v: string) => void, minDate?: string) => {
            if (value.length < 10) {
                setter(value);
                return;
            }
            const min = minDate ?? today;
            if (value < min) {
                alert("La date ne peut pas être dans le passé.");
                return;
            }
            setter(value);
        },
        [today]
    );

    const handleSwap = useCallback(() => {
        setDeparture(arrival);
        setArrival(departure);
        setRotation((prev) => prev + 180);
    }, [arrival, departure]);

    const isDisabled = useMemo(() => {
        if (!departure?.id || !arrival?.id || !departureDate) return true;
        if (tripType === "roundtrip" && !returnDate) return true;
        return false;
    }, [departure, arrival, departureDate, returnDate, tripType]);

    const goSearch = useCallback(() => {
        if (!departure?.id || !arrival?.id || !departureDate) return;

        setIsLoading(true);
        setErrorMessage(null);

        const url = `/Recherche?fromId=${encodeURIComponent(departure.id)}
&fromName=${encodeURIComponent(departure.name)}
&fromLat=${encodeURIComponent(departure.lat)}
&fromLon=${encodeURIComponent(departure.lon)}
&toId=${encodeURIComponent(arrival.id)}
&toName=${encodeURIComponent(arrival.name)}
&toLat=${encodeURIComponent(arrival.lat)}
&toLon=${encodeURIComponent(arrival.lon)}
&fromSource=${encodeURIComponent(departure.source)}
&toSource=${encodeURIComponent(arrival.source)}
&departureDate=${encodeURIComponent(departureDate)}
&arrivalDate=${encodeURIComponent(tripType === "roundtrip" ? returnDate || "" : "")}
&passagers=${encodeURIComponent(passagers)}`.replace(/\s+/g, "");

        window.location.href = url;
    }, [arrival, departure, departureDate, passagers, returnDate, tripType, setErrorMessage, setIsLoading]);

    const handleValidation = useCallback(() => {
        goSearch();
        setBoxIsOn(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [goSearch, setBoxIsOn]);

    return (
        <div
            className={`
        fixed bottom-0 left-0 w-full bg-[#103035] border-2 border-[#4A6367] rounded-t-4xl z-50
        transition-all duration-500 h-95 p-4 max-w-150
        ${BoxIsOn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
        >
            <div className="grid justify-center gap-2 py-4 mb-8">
                <div className="flex justify-center gap-5">
                    <AutocompleteInput
                        label=""
                        value={departure?.name || ""}
                        placeholder="Ville de départ"
                        onChange={(text) =>
                            setDeparture((prev) => (prev ? { ...prev, name: text } : makeSuggestion(text)))
                        }
                        onSelect={setDeparture}
                        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
                    />

                    <button
                        type="button"
                        onClick={handleSwap}
                        className="hover:bg-[#2C474B] p-2 rounded-xl w-10 h-10 mt-1 transition-colors duration-300 flex items-center justify-center"
                    >
                        <ArrowDownUp size={24} className="text-white transition-transform duration-500" style={{ transform: `rotate(${rotation}deg)` }} />
                    </button>

                    <AutocompleteInput
                        label=""
                        value={arrival?.name || ""}
                        placeholder="Ville d’arrivée"
                        onChange={(text) =>
                            setArrival((prev) => (prev ? { ...prev, name: text } : makeSuggestion(text)))
                        }
                        onSelect={setArrival}
                        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
                    />
                </div>

                <div className="flex justify-between items-center w-full py-4 mb-6 rounded-xl">
                    <div className="flex flex-col gap-2">
                        <TripTypeSwitch value={tripType} onChange={setTripType} a="oneway" b="roundtrip" label="Aller-retour" />
                        <div className="flex gap-2">
                            <DateBtn label="Date de départ" value={departureDate} min={today} onChange={(v) => validateDate(v, setDepartureDate)} />
                            {tripType === "roundtrip" && (
                                <DateBtn label="Date de retour" value={returnDate} min={departureDate || today} onChange={(v) => validateDate(v, setReturnDate, departureDate || today)} />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 items-center mt-4">
                        <button type="button" onClick={() => setPassagers((p) => (p > 1 ? p - 1 : p))} className="w-12 h-12 rounded-full bg-[#2C474B] text-white text-2xl flex justify-center items-center">-</button>
                        <Counter value={passagers} places={[10, 1]} fontSize={30} padding={5} gap={10} textColor="#98EAF3" fontWeight={500} />
                        <button type="button" onClick={() => setPassagers((p) => p + 1)} className="w-12 h-12 rounded-full bg-[#2C474B] text-white text-2xl flex justify-center items-center">+</button>
                    </div>
                </div>
            </div>

            <button
                className="w-full h-15 bg-[#98EAF3] rounded-xl disabled:opacity-50"
                onClick={handleValidation}
                disabled={isDisabled}
            >
                <span className="text-[#115E66] font-bold text-xl">Valider les modifications</span>
            </button>
        </div>
    );
}
