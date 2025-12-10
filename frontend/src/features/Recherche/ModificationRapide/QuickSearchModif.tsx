import React, { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import AutocompleteInput from "../../../components/autocomplete/AutocompleteInput";
import type { Suggestion } from "../../../components/autocomplete/types";
import { ArrowDownUp } from 'lucide-react';
import { DateBtn } from '../../home/components/Date';
import TripTypeSwitch from "../ModificationRapide/TripTypeSwitch";


type TripType = "oneway" | "roundtrip";

type ModificationProps = {
    Passagers: number;
    dateSearch: string;
    BoxIsOn: boolean;
    setBoxIsOn: (value: boolean) => void;
};

export default function QuickModificationOverlay({
    Passagers,
    dateSearch,
    BoxIsOn,
    setBoxIsOn,
}: ModificationProps) {
    const Navigate = useNavigate();

    const [departure, setDeparture] = useState<Suggestion | null>(null);
    const [arrival, setArrival] = useState<Suggestion | null>(null);

    const today = useMemo(() => new Date().toISOString().split("T")[0], []);
    const [departureDate, setDepartureDate] = useState<string>(dateSearch || today);
    const [passagerCount, setPassagerCount] = useState<number>(Passagers);
    const [rotation, setRotation] = useState<number>(0);
    const [tripType, setTripType] = useState<TripType>("oneway");

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
    const handleSwap = () => {
        const oldDeparture = departure;
        setDeparture(arrival);
        setArrival(oldDeparture);
        setRotation((prev) => prev + 180);
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

    Navigate(
      `/Recherche?fromId=${encodeURIComponent(
        departure.id
      )}&fromName=${encodeURIComponent(
        departure.name
      )}&fromLat=${encodeURIComponent(
        departure.lat
      )}&fromLon=${encodeURIComponent(
        departure.lon
      )}&toId=${encodeURIComponent(
        arrival.id
      )}&toName=${encodeURIComponent(
        arrival.name
      )}&toLat=${encodeURIComponent(
        arrival.lat
      )}&toLon=${encodeURIComponent(
        arrival.lon
      )}&departureDate=${encodeURIComponent(
        departureDate
      )}&arrivalDate=${encodeURIComponent(
        tripType === 'roundtrip' ? arrivalDate || '' : ''
      )}&passagers=${encodeURIComponent(
        passagerCount
      )}`
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
                                departure
                                    ? { ...departure, name: text }
                                    : { id: "", name: text, source: "sncf", lat: 0, lon: 0, simulated: false }
                            )
                        }
                        onSelect={(obj) => setDeparture(obj)}
                        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
                        AutocompleteListClassname="absolute autocomplete-suggestions left-0 right-0 z-50 mt-15 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60 mx-18 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden "
                    />
                    <div>
                        <button className=" hover:bg-[#2C474B] p-2 rounded-xl w-10 h-10 mt-1 tansition-colors duration-300 flex items-center justify-center" >
                            <ArrowDownUp
                                size={24}
                                className="text-white  rotate-90 transition-transform duration-500 rounded-full "
                                style={{ transform: `rotate(${rotation}deg)` }}
                                onClick={handleSwap}
                            />
                        </button>
                    </div>
                    
                                      
                                    
                    

                    <AutocompleteInput
                        label=""
                        value={arrival?.name || ""}
                        placeholder="Ville arrivée"
                        onChange={(text) =>
                            setArrival(
                                arrival
                                    ? { ...arrival, name: text }
                                    : { id: "", name: text, source: "sncf", lat: 0, lon: 0, simulated: false }
                            )
                        }
                        onSelect={(obj) => setArrival(obj)}
                        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
                        AutocompleteListClassname="absolute autocomplete-suggestions left-0 right-0 z-50 mt-15 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60 mx-18 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden "

                    />
                </div>
                <div className="flex justify-between items-center w-full py-4 mb-6   rounded-xl ">
                    <div className="max-h-15 w-10 mt-2 flex justify-start gap-4  w-full">

                        <DateBtn
                            label="Date de départ"
                            value={departureDate}
                            min={today}
                            onChange={validateDepartureDate}
                        />
                        {tripType === "roundtrip" && (
                            <DateBtn
                                label="Date de retour"
                                value={departureDate}
                                min={today}
                                onChange={validateDepartureDate}
                            />
                        )}
                    </div>
                    <div className="flex justify-center relative w-full max-w-80 ">
                        <TripTypeSwitch value={tripType} onChange={setTripType} className="max-w-52 " />
                    </div>
                </div>

                

               
            </div>
            
                
                

                

                <button
                    className="w-full h-15 bg-[#98EAF3] rounded-xl mt-4 disabled:opacity-50 relative bottom-0 top-10"
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
