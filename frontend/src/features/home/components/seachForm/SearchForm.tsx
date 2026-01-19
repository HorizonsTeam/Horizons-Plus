import { ArrowDownUp, Minus, Search } from "lucide-react";
import { useState, useMemo, type ChangeEvent, useRef, useEffect } from "react";
import AutocompleteInput from "../../../../components/autocomplete/AutocompleteInput";
import { useNavigate } from "react-router-dom";
import type { Suggestion } from "../../../../components/autocomplete/types";
import PassengerSelect from "./components/PassengerSelect";
import useIsMobile from "../../../../components/layouts/UseIsMobile";
import BlurBackground from "../../../../components/layouts/component/BlurBackground";

type TripType = "oneway" | "roundtrip";

type SearchFormProps = {
  onPlaneAnimation: (value: boolean) => void;
  planeAnimDurationMs: number;
};

export default function SearchForm({ onPlaneAnimation, planeAnimDurationMs }: SearchFormProps) {
  const [departure, setDeparture] = useState<Suggestion | null>(null);
  const [arrival, setArrival] = useState<Suggestion | null>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [departureDate, setDepartureDate] = useState(today);
  const [arrivalDate, setArrivalDate] = useState("");
  const [passagerCount, setPassagerCount] = useState(1);

  const [rotation, setRotation] = useState(0);
  const [tripType, setTripType] = useState<TripType>("oneway");

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const depWrapperRef = useRef<HTMLDivElement | null>(null);
  const arrWrapperRef = useRef<HTMLDivElement | null>(null);

  const [backgroundDisabled, setBackgroundDisabled] = useState(true);
  const [activeWrapper, setActiveWrapper] = useState<HTMLDivElement | null>(null);

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  const moveWrapperToTop = (wrapper: HTMLDivElement | null) => {
    if (isMobile) return;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();

    wrapper.dataset.prevPos = wrapper.style.position;
    wrapper.dataset.prevLeft = wrapper.style.left;
    wrapper.dataset.prevTop = wrapper.style.top;
    wrapper.dataset.prevWidth = wrapper.style.width;
    wrapper.dataset.prevZ = wrapper.style.zIndex;
    wrapper.dataset.prevTrans = wrapper.style.transition;
    wrapper.dataset.prevPadding = wrapper.style.padding;
    wrapper.dataset.prevTransform = wrapper.style.transform;

    wrapper.style.willChange = "top,left,width,transform";

    wrapper.style.transition = "none";
    wrapper.style.position = "fixed";
    wrapper.style.top = `${rect.top}px`;
    wrapper.style.left = `${rect.left}px`;
    wrapper.style.width = `${rect.width}px`;
    wrapper.style.transform = "none";
    wrapper.style.zIndex = "9999";
    wrapper.style.padding = "4px";

    const input = wrapper.querySelector("input") as HTMLInputElement | null;
    if (input) {
      input.dataset.prevInlineWidth = input.style.width;
      input.dataset.prevInlineMaxWidth = input.style.maxWidth;
      input.style.width = "100%";
      input.style.maxWidth = "100%";
      input.style.boxSizing = "border-box";
    }

    requestAnimationFrame(() => {
      wrapper.style.transition =
        `top 450ms ${ease}, left 450ms ${ease}, width 450ms ${ease}, transform 450ms ${ease}`;
      wrapper.style.top = "20px";
      wrapper.style.left = "50%";
      wrapper.style.width = "min(720px, 92vw)";
      wrapper.style.transform = "translateX(-50%)";
    });
  };


  const resetWrapper = (wrapper: HTMLDivElement | null) => {
    if (isMobile) return;
    if (!wrapper) return;

    wrapper.style.position = wrapper.dataset.prevPos ?? "";
    wrapper.style.left = wrapper.dataset.prevLeft ?? "";
    wrapper.style.top = wrapper.dataset.prevTop ?? "";
    wrapper.style.width = wrapper.dataset.prevWidth ?? "";
    wrapper.style.zIndex = wrapper.dataset.prevZ ?? "";
    wrapper.style.transition = wrapper.dataset.prevTrans ?? "";
    wrapper.style.padding = wrapper.dataset.prevPadding ?? "";
    wrapper.style.transform = wrapper.dataset.prevTransform ?? "";
    wrapper.style.willChange = "";

    delete wrapper.dataset.prevPos;
    delete wrapper.dataset.prevLeft;
    delete wrapper.dataset.prevTop;
    delete wrapper.dataset.prevWidth;
    delete wrapper.dataset.prevZ;
    delete wrapper.dataset.prevTrans;
    delete wrapper.dataset.prevPadding;
    delete wrapper.dataset.prevTransform;

    const input = wrapper.querySelector("input") as HTMLInputElement | null;
    if (input) {
      input.style.width = input.dataset.prevInlineWidth ?? "";
      input.style.maxWidth = input.dataset.prevInlineMaxWidth ?? "";

      delete input.dataset.prevInlineWidth;
      delete input.dataset.prevInlineMaxWidth;
    }
  };
  useEffect (()=>{
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        closeFocus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  },[activeWrapper])

  const openFocus = (wrapper: HTMLDivElement | null) => {
    if (isMobile) return;
    if (!wrapper) return;

    if (activeWrapper && activeWrapper !== wrapper) {
      resetWrapper(activeWrapper);
    }

    setActiveWrapper(wrapper);
    setBackgroundDisabled(false);
    moveWrapperToTop(wrapper);
  };

  const closeFocus = () => {
    if (isMobile) return;

    setBackgroundDisabled(true);

    if (activeWrapper) {
      resetWrapper(activeWrapper);
    }

    setActiveWrapper(null);
  };

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

    if (arrivalDate && new Date(arrivalDate) < selectedDate) {
      setArrivalDate("");
    }
  };

  const validateArrivalDate = (value: string) => {
    if (value.length < 10) {
      setArrivalDate(value);
      return;
    }

    if (new Date(value) < new Date(departureDate)) {
      alert("La date d'arrivée ne peut pas être avant la date de départ.");
      return;
    }

    setArrivalDate(value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>, isDeparture: boolean) => {
    const value = e.target.value;
    isDeparture ? validateDepartureDate(value) : validateArrivalDate(value);
  };

  const handleSwap = () => {
    const oldDeparture = departure;
    setDeparture(arrival);
    setArrival(oldDeparture);
    setRotation((prev) => prev + 180);
  };

  const isDisabled = useMemo(() => {
    const base =
      !departure?.id ||
      !departure?.name ||
      !arrival?.id ||
      !arrival?.name ||
      !departureDate;

    if (base) return true;
    if (tripType === "roundtrip" && !arrivalDate) return true;
    return false;
  }, [departure, arrival, departureDate, arrivalDate, tripType]);

  const goSearch = () => {
    if (isDisabled || !departure || !arrival) return;

    onPlaneAnimation(true);

    setTimeout(() => {
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
        &arrivalDate=${encodeURIComponent(tripType === "roundtrip" ? arrivalDate || "" : "")}
        &passagers=${encodeURIComponent(passagerCount)}`.replace(/\s+/g, "")
      );

      onPlaneAnimation(false);
    }, planeAnimDurationMs);
  };

  return (
    <section className="px-4 py-8 lg:py-16">
      <h1 className="text-4xl lg:text-5xl font-bold text-center mb-10 text-primary">
        Envie de voyager ?
      </h1>

      {!isMobile && !backgroundDisabled && (
        <BlurBackground closeFocus={closeFocus}/>
      )}

      {/* MOBILE */}
      <div className="lg:hidden">
        <div className="relative mb-4">
          <div className="mb-3">
            <AutocompleteInput
              label=""
              value={departure?.name || ""}
              placeholder="Ville départ"
              onChange={(text) => {
                setDeparture(
                  departure
                    ? { ...departure, name: text }
                    : { id: "", name: text, source: "sncf", lat: 0, lon: 0, simulated: false }
                );
              }}
              onSelect={(obj) => setDeparture(obj)}
              wrapperRef={depWrapperRef}
              onFocus={() => moveWrapperToTop(depWrapperRef.current)}
              onBlur={() => resetWrapper(depWrapperRef.current)}
              className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          <div>
            <AutocompleteInput
              label=""
              value={arrival?.name || ""}
              placeholder="Ville arrivée"
              onChange={(text) => {
                setArrival(
                  arrival
                    ? { ...arrival, name: text }
                    : { id: "", name: text, source: "sncf", lat: 0, lon: 0, simulated: false }
                );
              }}
              onSelect={(obj) => setArrival(obj)}
              wrapperRef={arrWrapperRef}
              onFocus={() => moveWrapperToTop(arrWrapperRef.current)}
              onBlur={() => resetWrapper(arrWrapperRef.current)}
              className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          <button
            type="button"
            onClick={handleSwap}
            style={{ transform: `rotate(${rotation}deg)` }}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-primary p-2 rounded-4xl border-2 border-dark text-white transition-transform duration-300"
            aria-label="Inverser"
          >
            <ArrowDownUp className="w-4 h-4 text-slate-900 stroke-[2.5]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="date"
            value={departureDate}
            onChange={(e) => handleDateChange(e, true)}
            className="w-full bg-[#2C474B] text-white rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
          />
          <div className="relative">
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => handleDateChange(e, false)}
              className="w-full bg-[#2C474B] text-white rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
            />
            {!!arrivalDate && (
              <button
                type="button"
                onClick={() => setArrivalDate("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-700 rounded-full p-1 border-[#103035] border-3 z-10"
              >
                <Minus className="w-3 h-3 text-white stroke-[3]" />
              </button>
            )}
          </div>
        </div>

        <input
          type="number"
          min={1}
          value={passagerCount}
          onChange={(e) => setPassagerCount(Number(e.target.value))}
          className="w-full bg-[#2C474B] text-white rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30 mb-5"
        />

        <button
          disabled={isDisabled}
          className="w-full cursor-pointer bg-primary active:bg-cyan-300 text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg"
          onClick={goSearch}
        >
          Rechercher
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="flex justify-center mb-[3.5rem]">
          <div className="inline-flex bg-[#2C474B] rounded-full p-1">
            <button
              onClick={() => {
                setTripType("oneway");
                setArrivalDate("");
              }}
              className={`px-7 py-3 cursor-pointer rounded-full text-sm transition ${tripType === "oneway" ? "bg-primary text-[#115E66]" : "text-white hover:text-cyan-200"
                }`}
            >
              Aller simple
            </button>

            <button
              onClick={() => setTripType("roundtrip")}
              className={`px-7 py-3 cursor-pointer rounded-full text-sm transition ${tripType === "roundtrip" ? "bg-primary text-[#115E66]" : "text-white hover:text-cyan-200"
                }`}
            >
              Aller-retour
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-4 bg-[#2C474B] rounded-2xl px-7 py-6 shadow-xl">
            <AutocompleteInput
              label=""
              value={departure?.name || ""}
              placeholder="Ville départ"
              onChange={(text) =>
                setDeparture(
                  departure
                    ? { ...departure, name: text }
                    : { id: "", name: text, source: "sncf", lat: 0, lon: 0, simulated: false }
                )
              }
              onSelect={setDeparture}
              wrapperRef={depWrapperRef}
              onFocus={() => openFocus(depWrapperRef.current)}
              className="bg-[#243C40] text-white placeholder-slate-400 rounded-xl px-4 py-3 w-56 outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              OnCloseFocus={closeFocus}

            />

            <button
              onClick={handleSwap}
              style={{ transform: `rotate(${rotation}deg)` }}
              className="cursor-pointer bg-primary p-3 rounded-full border-2 border-dark transition-transform duration-300 hover:scale-105"
            >
              <ArrowDownUp className="w-4 h-4 text-slate-900 stroke-[2.5] rotate-90" />
            </button>

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
              onSelect={setArrival}
              wrapperRef={arrWrapperRef}
              onFocus={() => openFocus(arrWrapperRef.current)}
              className="bg-[#243C40] text-white placeholder-slate-400 rounded-xl px-4 py-3 w-56 outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              OnCloseFocus={closeFocus}
            />

            <input
              type="date"
              value={departureDate}
              onChange={(e) => handleDateChange(e, true)}
              className="bg-[#243C40] text-white rounded-xl px-4 py-3 outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark] cursor-pointer"
            />

            {tripType === "roundtrip" && (
              <div className="relative">
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => handleDateChange(e, false)}
                  className="bg-[#243C40] text-white rounded-xl px-4 py-3 outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
                />
                {arrivalDate && (
                  <button
                    onClick={() => setArrivalDate("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-700 rounded-full p-1"
                  >
                    <Minus className="w-3 h-3 text-white stroke-[3]" />
                  </button>
                )}
              </div>
            )}

            <PassengerSelect value={passagerCount} onChange={(v) => setPassagerCount(v)} />

            <button
              disabled={isDisabled}
              onClick={goSearch}
              className="bg-primary rounded-xl px-6 py-4 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Search className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
