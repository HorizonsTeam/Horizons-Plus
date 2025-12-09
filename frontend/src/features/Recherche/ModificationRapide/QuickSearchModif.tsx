import React, { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import AutocompleteInput from "../../../components/autocomplete/AutocompleteInput";
import type { Suggestion } from "../../../components/autocomplete/types";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    containerClassName?: string;
    inputValue?: string | number;
};

type ModificationProps = {
    Passagers: number;
    dateSearch: string;
    BoxIsOn: boolean;
    setBoxIsOn: (value: boolean) => void;
};

function FloatingInput({
    label,
    containerClassName = "",
    className = "",
    inputValue,
    ...props
}: Props) {
    return (
        <div className={`relative ${containerClassName}`}>
            <input
                {...props}
                placeholder=" "
                value={inputValue}
                className={[
                    "peer h-18 w-full rounded-xl bg-[#103035] px-4 mt-2 text-white outline-none",
                    "placeholder-transparent ring-1 ring-transparent",
                    "focus:ring-2 focus:ring-cyan-400",
                    className,
                ].join(" ")}
            />
            <label
                className={[
                    "pointer-events-none absolute left-4 top-1 -translate-y-1/2",
                    "text-gray-400 transition-all duration-150",
                    "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-cyan-300",
                    "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
                    "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs mt-2",
                ].join(" ")}
            >
                {label}
            </label>
        </div>
    );
}

export default function QuickModificationOverlay({
    Passagers,
    dateSearch,
    BoxIsOn,
    setBoxIsOn,
}: ModificationProps) {
    const navigate = useNavigate();

    const [departure, setDeparture] = useState<Suggestion | null>(null);
    const [arrival, setArrival] = useState<Suggestion | null>(null);

    const today = useMemo(() => new Date().toISOString().split("T")[0], []);
    const [departureDate, setDepartureDate] = useState<string>(dateSearch || today);
    const [passagerCount, setPassagerCount] = useState<number>(Passagers);

    const validateDepartureDate = (value: string) => {
        if (value.length < 10) {
            setDepartureDate(value);
            return;
        }

        const selectedDate = new Date(value);
        const todayDate = new Date(today);

        if (selectedDate < todayDate) {
            alert("La date de départ ne peut pas être dans le passé.");
            return;
        }

        setDepartureDate(value);
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        validateDepartureDate(e.target.value);
    };

    const isDisabled = useMemo(() => {
        return (
            !departure?.id ||
            !departure?.name ||
            !arrival?.id ||
            !arrival?.name ||
            !departureDate
        );
    }, [departure, arrival, departureDate]);

    const goSearch = () => {
        if (isDisabled || !departure || !arrival) return;

        navigate(
            `/Recherche?fromId=${encodeURIComponent(departure.id)}` +
            `&fromName=${encodeURIComponent(departure.name)}` +
            `&toId=${encodeURIComponent(arrival.id)}` +
            `&toName=${encodeURIComponent(arrival.name)}` +
            `&departureDate=${encodeURIComponent(departureDate)}` +
            `&arrivalDate=` +
            `&passagers=${encodeURIComponent(passagerCount)}`
        );
    };

    const handleValidation = () => {
        goSearch();
        setBoxIsOn(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            className={`
        fixed bottom-0 left-0 w-full bg-[#133A40] rounded-t-4xl 
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
                                departure
                                    ? { ...departure, name: text }
                                    : { id: "", name: text, source: "sncf", lat: 0, lon: 0 }
                            )
                        }
                        onSelect={(obj) => setDeparture(obj)}
                        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
                        AutocompleteListClassname="absolute autocomplete-suggestions left-0 right-0 z-50 mt-15 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60 mx-18 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden "
                    />

                    <AutocompleteInput
                        label=""
                        value={arrival?.name || ""}
                        placeholder="Ville arrivée"
                        onChange={(text) =>
                            setArrival(
                                arrival
                                    ? { ...arrival, name: text }
                                    : { id: "", name: text, source: "sncf", lat: 0, lon: 0 }
                            )
                        }
                        onSelect={(obj) => setArrival(obj)}
                        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
                        AutocompleteListClassname="absolute autocomplete-suggestions left-0 right-0 z-50 mt-15 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60 mx-18 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden "

                    />
                </div>

                <FloatingInput
                    label="Nombre de passagers"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    inputValue={passagerCount}
                    onChange={(e) => setPassagerCount(Number(e.target.value))}
                />

                <FloatingInput
                    label="Date de départ"
                    type="date"
                    inputValue={departureDate}
                    onChange={handleDateChange}
                />

                <button
                    className="w-full h-15 bg-[#98EAF3] rounded-xl mt-4 disabled:opacity-50"
                    onClick={handleValidation}
                    disabled={isDisabled}
                >
                    <span className="text-[#115E66] font-bold text-xl">
                        Valider les modifications
                    </span>
                </button>
            </div>
        </div>
    );
}
