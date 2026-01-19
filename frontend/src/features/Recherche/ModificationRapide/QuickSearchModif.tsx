import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AutocompleteInput from "../../../components/autocomplete/AutocompleteInput";
import type { Suggestion } from "../../../components/autocomplete/types";
import { ArrowDownUp } from "lucide-react";
import { DateBtn } from "../../home/components/Date";
import TripTypeSwitch from "../ModificationRapide/TripTypeSwitch";
import Counter from "../../../components/AdditionalsComponents/Counter";
import useIsMobile from "../../../components/layouts/UseIsMobile";

type TripType = "oneway" | "roundtrip";

type ModificationProps = {
    villeDepart: string;
    villeArrivee: string;
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

const makeSuggestion = (name: string): Suggestion => ({
    id: "",
    name,
    source: "sncf",
    lat: 0,
    lon: 0,
    simulated: false,
});

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
    setJourneyData: _setJourneyData,
    setTransport: _setTransport,
}: ModificationProps) {
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const [departureDate, setDepartureDate] = useState<string>(dateSearch || today);
    const [returnDate, setReturnDate] = useState<string>("");

    const [passagers, setPassagers] = useState<number>(Passagers ?? 1);

    const [departure, setDeparture] = useState<Suggestion | null>(
        villeDepart ? makeSuggestion(villeDepart) : null
    );
    const [arrival, setArrival] = useState<Suggestion | null>(
        villeArrivee ? makeSuggestion(villeArrivee) : null
    );

    const [rotation, setRotation] = useState<number>(0);
    const [tripType, setTripType] = useState<TripType>(trip ?? "oneway");

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
        if (!departure?.name) return true;
        if (!arrival?.name) return true;
        if (!departureDate) return true;
        if (tripType === "roundtrip" && !returnDate) return true;
        return false;
    }, [departure?.name, arrival?.name, departureDate, returnDate, tripType]);

    const goSearch = useCallback(() => {
        if (!departure || !arrival || !departureDate) return;

        setIsLoading(true);
        setErrorMessage(null);

        navigate(
            `/Recherche?fromId=${encodeURIComponent(departure.id)}
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
            &passagers=${encodeURIComponent(passagers)}`.replace(/\s+/g, "")
        );

        
        requestAnimationFrame(() => {
            if (mountedRef.current) setIsLoading(false);
        });
    }, [
        arrival,
        departure,
        departureDate,
        navigate,
        passagers,
        returnDate,
        setErrorMessage,
        setIsLoading,
        tripType,
    ]);

    const handleValidation = useCallback(() => {
        goSearch();
        setBoxIsOn(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [goSearch, setBoxIsOn]);

    const listWidthClass = isMobile ? "min-w-50" : "min-w-100";

    return (
        <div
            className={`
                fixed bottom-0 left-0 w-full bg-[#103035] border-2 border-[#4A6367] rounded-t-4xl  z-50
                transition-all duration-500 h-95 p-4  max-w-150
                ${BoxIsOn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
            `}
        >
            <div className="grid justify-center gap-2  py-4 mb-8">
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
                        AutocompleteListClassname={`absolute ${listWidthClass} autocomplete-suggestions left-0 right-0 z-100 mt-5 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden`}
                    />

                    <button
                        type="button"
                        onClick={handleSwap}
                        className="hover:bg-[#2C474B] p-2 rounded-xl w-10 h-10 mt-1 transition-colors duration-300 flex items-center justify-center"
                    >
                        <ArrowDownUp
                            size={24}
                            className="text-white transition-transform duration-500 rounded-full rotate-90"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        />
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
                        AutocompleteListClassname={`absolute ${listWidthClass} autocomplete-suggestions left-0 right-0 z-50 mt-5 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden`}
                    />
                </div>

                <div className="flex justify-between items-center w-full py-4 mb-6 rounded-xl">
                    <div className="w-full ">
                        <div className=" justify-center gap-2 relative w-full max-w-80 -mt-4 mb-4">
                            <span className="block font-semibold text-[10px] mb-2 ml-1 text-slate-400 ">
                                Aller-retour
                            </span>
                            <TripTypeSwitch
                                value={tripType}
                                onChange={setTripType}
                                a="oneway"
                                b="roundtrip"
                                label="Aller-retour"
                            />
                        </div>
                    
                    <div className="max-h-10 mt-2 flex justify-start gap-2 w-full">
                        <DateBtn
                            size={isMobile ? 15 : 24}
                            label="Date de départ"
                            value={departureDate}
                            min={today}
                            onChange={(value) => validateDate(value, setDepartureDate, today)}
                        />

                        {tripType === "roundtrip" && (
                            <DateBtn
                                size={isMobile ? 15 : 24}
                                label="Date de retour"
                                value={returnDate}
                                min={departureDate || today}
                                onChange={(value) => validateDate(value, setReturnDate, departureDate || today)}
                            />
                        )}
                    </div>
                    </div>

                    <div className="grid grid-cols w-full">
                        

                        <div className="flex justify-center relative w-full mt-10 ml-2">
                            <button
                                type="button"
                                onClick={() => setPassagers((prev) => (prev > 1 ? prev - 1 : prev))}
                                className="w-12 h-12 text-2xl bg-[#2C474B] font-bold rounded-full text-white flex justify-center items-center p-2"
                            >
                                -
                            </button>

                            <Counter
                                value={passagers}
                                places={[10, 1]}
                                fontSize={30}
                                padding={5}
                                gap={10}
                                textColor="#98EAF3"
                                fontWeight={500}
                            />

                            <button
                                type="button"
                                onClick={() => setPassagers((prev) => prev + 1)}
                                className="w-12 h-12 text-2xl bg-[#2C474B] font-bold rounded-full text-white flex justify-center items-center p-2"
                            >
                                +
                            </button>
                        </div>
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
