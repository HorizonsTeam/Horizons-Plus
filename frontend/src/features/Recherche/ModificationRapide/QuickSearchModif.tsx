import { useMemo, useState } from "react";
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
    setTransport: (value: "train" | "plane" | undefined) => void;
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
    setJourneyData,
    setTransport
}: ModificationProps) {

    const [passagers, setPassagers] = useState<number>(
        Passagers ? Passagers : 1
    );

    const [departure, setDeparture] = useState<Suggestion | null>(
        villeDepart
            ? {
                id: "",
                name: villeDepart,
                source: "sncf",
                lat: 0,
                lon: 0,
                simulated: false,
            }
            : null
    );

    const [arrival, setArrival] = useState<Suggestion | null>(
        villeArrivee
            ? {
                id: "",
                name: villeArrivee,
                source: "sncf",
                lat: 0,
                lon: 0,
                simulated: false,
            }
            : null
    );

    const IsMobile = useIsMobile();
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);
    const [departureDate, setDepartureDate] = useState<string>(
        dateSearch || today
    );
    const [returnDate, setReturnDate] = useState<string>("");

    const [rotation, setRotation] = useState<number>(0);
    const [tripType, setTripType] = useState<TripType>(
        trip ? trip : "oneway"
    );

    // -- utils --

    const createSuggestionFromText = (text: string): Suggestion => ({
        id: "",
        name: text,
        source: "sncf",
        lat: 0,
        lon: 0,
        simulated: false,
    });

    const validateDate = (
        value: string,
        setter: (value: string) => void
    ): void => {
        if (value.length < 10) {
            setter(value);
            return;
        }

        const selectedDate = new Date(value);
        const todayDate = new Date(today);

        if (selectedDate < todayDate) {
            alert("La date ne peut pas être dans le passé.");
            return;
        }

        setter(value);
    };

    const handleSwap = () => {
        setDeparture(arrival);
        setArrival(departure);
        setRotation((prev) => prev + 180);
    };

    const isDisabled =
        !departure?.name ||
        !arrival?.name ||
        !departureDate ||
        (tripType === "roundtrip" && !returnDate);

    const goSearch = () => {
        if (!departure || !arrival || !departureDate) return;

        const base = import.meta.env.VITE_API_URL || "http://localhost:3005";

        setIsLoading(true);
        setErrorMessage(null);

        fetch(
            `${base}/api/search/journeys?` +
            `fromId=${encodeURIComponent(departure.id)}` +
            `&fromName=${encodeURIComponent(departure.name)}` +
            `&fromLat=${encodeURIComponent(String(departure.lat))}` +
            `&fromLon=${encodeURIComponent(String(departure.lon))}` +
            `&toId=${encodeURIComponent(arrival.id)}` +
            `&toName=${encodeURIComponent(arrival.name)}` +
            `&toLat=${encodeURIComponent(String(arrival.lat))}` +
            `&toLon=${encodeURIComponent(String(arrival.lon))}` +
            `&datetime=${encodeURIComponent(departureDate)}`
        )
            .then(res => res.json())
            .then(data => {
                console.log("Overlay search response:", data);

                if (data.error) {
                    setErrorMessage(data.error);
                    setJourneyData([]);
                    setTransport(undefined);
                } else {
                    setJourneyData(data);
                    setTransport(data[0]?.simulated ? "plane" : "train");
                    setErrorMessage(null);
                }
            })
            .catch((err) => {
                console.error("Overlay fetch error:", err);
                setErrorMessage("Erreur serveur, réessayez plus tard");
                setJourneyData([]);
                setTransport(undefined);
            })
            .finally(() => {
                setTimeout(() => setIsLoading(false), 800);
            });
    };
    const handleValidation = () => {
        goSearch();
        setBoxIsOn(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    return (
        <div
            className={`
        fixed bottom-0 left-0 w-full bg-[#103035] border-2 border-[#4A6367] rounded-t-4xl 
        transition-all duration-500 h-95 p-4 max-w-150
        ${BoxIsOn ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
        >
            <div className="grid justify-center gap-2 mt-4">
                <div className="flex justify-center gap-5">
                    <AutocompleteInput
                        label=""
                        value={departure?.name || ""}
                        placeholder="Ville de départ"
                        onChange={(text) =>
                            setDeparture(
                                departure ? { ...departure, name: text } : createSuggestionFromText(text)
                            )
                        }
                        onSelect={(obj) => setDeparture(obj)}
                        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
                        AutocompleteListClassname="absolute autocomplete-suggestions left-0 right-0 z-50 mt-15 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60 mx-18 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden "
                    />

                    <div>
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
                    </div>

                    <AutocompleteInput
                        label=""
                        value={arrival?.name || ""}
                        placeholder="Ville d’arrivée"
                        onChange={(text) =>
                            setArrival(
                                arrival ? { ...arrival, name: text } : createSuggestionFromText(text)
                            )
                        }
                        onSelect={(obj) => setArrival(obj)}
                        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
                        AutocompleteListClassname="absolute autocomplete-suggestions left-0 right-0 z-50 mt-15 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60 mx-18 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden "
                    />
                </div>

                {/* Dates + type de trajet + passagers */}
                <div className="flex justify-between items-center w-full py-4 mb-6 rounded-xl">
                    <div className="max-h-10  mt-2 flex justify-start gap-2 w-full">
                        <DateBtn
                            size={IsMobile ? 15 : 24}
                            label="Date de départ"
                            value={departureDate}
                            min={today}
                            onChange={(value) => validateDate(value, setDepartureDate)
                            
                            
                            }
                        />
                        {tripType === "roundtrip" && (
                            <DateBtn
                                size={IsMobile ? 15 : 24}
                                label="Date de retour"
                                value={returnDate}
                                min={departureDate || today}
                                onChange={(value) => validateDate(value, setReturnDate)}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols w-full">
                        <div className="flex justify-center relative w-full max-w-80">
                            <TripTypeSwitch
                                value={tripType}
                                onChange={setTripType}
                                className="max-w-52"
                            />
                        </div>

                        <div className="flex justify-center  relative w-full mt-10 ml-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setPassagers((prev) => (prev > 1 ? prev - 1 : prev))
                                }
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
                className="w-full h-15 bg-[#98EAF3] rounded-xl disabled:opacity-50 relative bottom-0 top-0"
                onClick={handleValidation}
                disabled={isDisabled}
            >
                <span className="text-[#115E66] font-bold text-xl">
                    Valider les modifications
                </span>
            </button>
        </div>
    );
}
