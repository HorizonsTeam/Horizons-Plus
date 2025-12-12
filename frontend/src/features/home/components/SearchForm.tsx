import { ArrowDownUp, Minus, Search } from 'lucide-react';
import { useState, useMemo, type ChangeEvent } from 'react';
import AutocompleteInput from '../../../components/autocomplete/AutocompleteInput.tsx';
import { useNavigate } from 'react-router-dom';
import type { Suggestion } from '../../../components/autocomplete/types.ts';
import { DateBtn } from './Date.tsx';
import Avatar from '../../../assets/Avatar.svg'

type TripType = 'oneway' | 'roundtrip';

type SearchFormProps = {
  onPlaneAnimation: (value: boolean) => void;
  planeAnimDurationMs: number;
};


export default function SearchForm({ 

  onPlaneAnimation,
  planeAnimDurationMs,
}: SearchFormProps) 
{
  const [departure, setDeparture] = useState<Suggestion | null>(null);
  const [arrival, setArrival] = useState<Suggestion | null>(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [departureDate, setDepartureDate] = useState(today);
  const [arrivalDate, setArrivalDate] = useState<string>('');
  const [passagerCount, setPassagerCount] = useState<number>(1);

  const [rotation, setRotation] = useState<number>(0);
  const [tripType, setTripType] = useState<TripType>('oneway');

  const Navigate = useNavigate();
  

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

    if (arrivalDate) {
      const arr = new Date(arrivalDate);
      if (arr < selectedDate) {
        setArrivalDate('');
      }
    }
  };

  const validateArrivalDate = (value: string) => {
    if (value.length < 10) {
      setArrivalDate(value);
      return;
    }

    const selectedDate = new Date(value);
    const dep = departureDate ? new Date(departureDate) : null;

    if (dep && selectedDate < dep) {
      alert("La date d'arrivée ne peut pas être avant la date de départ.");
      return;
    }

    setArrivalDate(value);
  };

  const handleDateChange = (
    e: ChangeEvent<HTMLInputElement>,
    isDeparture: boolean
  ) => {
    const value = e.target.value;
    if (isDeparture) validateDepartureDate(value);
    else validateArrivalDate(value);
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
    if (tripType === 'roundtrip' && !arrivalDate) return true;
    return false;
  }, [departure, arrival, departureDate, arrivalDate, tripType]);

  const goSearch = () => {
    if (isDisabled || !departure || !arrival) return;

    
    



    setTimeout(() => {  
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
      onPlaneAnimation(false);
    }, planeAnimDurationMs);
  };
  return (
    <section className="px-4 py-8 lg:py-16">
      <div>
        <h1 className="text-4xl mx-auto lg:text-5xl font-bold text-center mb-8 lg:mb-12 text-primary">
          Envie de voyager ?
        </h1>

        {/* ========== MOBILE ========== */}
        <div className="lg:hidden">
          {/* Villes + swap */}
          <div className="relative mb-4">
            {/* Ville départ */}
            <div className="mb-3">
              <AutocompleteInput
                label=""
                value={departure?.name || ''}
                placeholder="Ville départ"
                onChange={(text) => {
                  setDeparture(
                    departure
                      ? { ...departure, name: text }
                      : {
                        id: '',
                        name: text,
                        source: 'sncf',
                        lat: 0,
                        lon: 0,
                        simulated: false,
                      }
                  );
                }}
                onSelect={(obj) => setDeparture(obj)}
                className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Ville arrivée */}
            <div>
              <AutocompleteInput
                label=""
                value={arrival?.name || ''}
                placeholder="Ville arrivée"
                onChange={(text) => {
                  setArrival(
                    arrival
                      ? { ...arrival, name: text }
                      : {
                        id: '',
                        name: text,
                        source: 'sncf',
                        lat: 0,
                        lon: 0,
                        simulated: false,
                      }
                  );
                }}
                onSelect={(obj) => setArrival(obj)}
                className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Bouton swap */}
            <button
              type="button"
              onClick={handleSwap}
              style={{ transform: `rotate(${rotation}deg)` }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary p-2 rounded-4xl border-2 border-dark text-white transition-transform duration-300"
              aria-label="Inverser"
            >
              <ArrowDownUp className="w-4 h-4 text-slate-900 stroke-[2.5]" />
            </button>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="relative">
              <input
                type="date"
                placeholder="Départ"
                value={departureDate}
                onChange={(e) => handleDateChange(e, true)}
                className="w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
              />
            </div>
            <div className="relative">
              <input
                type="date"
                placeholder="Arrivée"
                value={arrivalDate}
                onChange={(e) => handleDateChange(e, false)}
                className="w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
              />
              {!!arrivalDate && (
                <button
                  type="button"
                  onClick={() => setArrivalDate('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-700 rounded-full p-1 border-[#103035] border-3 z-10"
                  aria-label="Cancel arrival date"
                >
                  <Minus className="w-3 h-3 text-white stroke-[3]" />
                </button>
              )}
            </div>
          </div>

          {/* Passagers */}
          <div className="mb-5">
            <input
              type="number"
              min={1}
              value={passagerCount}
              onChange={(e) => setPassagerCount(Number(e.target.value))}
              placeholder="Passagers"
              className="w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Bouton Rechercher */}
          <button
            disabled={isDisabled}
            className="w-full bg-primary active:bg-cyan-300 text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg"
            onClick={goSearch}
          >
            Rechercher
          </button>
        </div>




        {/* ========== DESKTOP ========== */}
        <div className="hidden lg:block w-full  mt-20">
          

          {/* Barre de recherche */}
          <div className=" grid grid-cols justify-center">
            <div className="flex justify-start mb-6">
              <div className="inline-flex rounded-full bg-primary  p-1 h-15">
                <button
                  type="button"
                  onClick={() => setTripType('oneway')}
                  className={[
                    'px-5 py-1/2 rounded-full text-sm font-medium transition ',
                    tripType === 'oneway'
                      ? 'bg-secondary  border border-white/30 shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]'
                      : 'bg-transparent ',
                  ].join(' ')}
                >
                  Aller simple
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('roundtrip')}
                  className={[
                    'px-5 py-1/2 rounded-full text-sm font-medium transition',
                    tripType === 'roundtrip'
                      ? 'bg-secondary text-white border border-white/30 shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]'
                      : 'bg-transparent ',
                  ].join(' ')}
                >
                  Aller-retour
                </button>
              </div>
            </div>
            <div className="flex   min-h-20 gap-8">
              {/* Date carré */}
              <div className="h-full w-14">
                <DateBtn
                  label=""
                  value={departureDate}
                  min={today}
                  onChange={validateDepartureDate}
                  
                  
                />
              </div>
              {tripType === 'roundtrip' && (
              
              <div className="h-full w-14 ml-10">
                <DateBtn
                  label=""
                  value={departureDate}
                  min={today}
                  onChange={validateDepartureDate}
                />
              </div>
              )
}


              {/* Bloc villes unique */}
              <div className="relative flex bg-white rounded-xl shadow-sm mx-10">
                {/* Ville départ */}
                <div className="min-w-[290px] h-full">

                  <AutocompleteInput
                    label=""
                    value={departure?.name || ''}
                    placeholder="Ville de départ"
                    onChange={(text) => {
                      setDeparture(
                        departure
                          ? { ...departure, name: text }
                          : {
                            id: '',
                            name: text,
                            source: 'sncf',
                            lat: 0,
                            lon: 0,
                            simulated: false,
                          }
                      );
                    }}
                    onSelect={(obj) => setDeparture(obj)}
                    className="min-h-22 w-full text-black bg-white rounded-l-xl px-4 outline-none border-none"
                    AutocompleteListClassname={`absolute min-w-150 autocomplete-suggestions left-0 right-0 z-50 mt-5 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60  overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden`}

                  />
                </div>

                {/* Séparateur central + swap */}
                <div className="mr-10">
                  <button
                    type="button"
                    onClick={handleSwap}
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       h-9 w-9 rounded-full bg-slate-200 border border-slate-300
                       flex items-center justify-center transition-transform duration-300 "
                    aria-label="Inverser"
                  >
                    <ArrowDownUp className="w-4 h-4 text-slate-800 stroke-[2.5] rotate-90 " />
                  </button>
                </div>

                {/* Ville arrivée */}
                <div className="min-w-[260px] h-full">
                  <AutocompleteInput
                    label=""
                    value={arrival?.name || ''}
                    placeholder="Ville d'arrivée"
                    onChange={(text) => {
                      setArrival(
                        arrival
                          ? { ...arrival, name: text }
                          : {
                            id: '',
                            name: text,
                            source: 'sncf',
                            lat: 0,
                            lon: 0,
                            simulated: false,
                          }
                      );
                    }}
                    onSelect={(obj) => setArrival(obj)}
                    className="min-h-22 text-black bg-white px-4 outline-none border-none"
                    AutocompleteListClassname={`absolute 'min-w-100' autocomplete-suggestions left-0 right-0 z-50 mt-5 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl backdrop-blur-md max-h-60  overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden`}

                  />
                </div>
              </div>

              {/* Passagers carré */}
              <div className="bg-white rounded-xl grid grid-cols shadow-sm flex items-center px-4 py-3.5 -ml-10">
                <img src={Avatar} alt="" className='justify-center ml-2' />
                <div>
                <select
                  value={passagerCount}
                  onChange={(e) => setPassagerCount(Number(e.target.value))}
                  className='text-black text-xm'
                >
                  <option value={1}>x1</option>
                  <option value={2}>x2</option>
                  <option value={3}>x3</option>
                  <option value={4}>x4</option>
                </select>
                </div>
              </div>

              {/* Recherche carré */}
              <div className='p-1  bg-gradient-to-r from-[#7ADFEA] via-[#98EAF3] to-[#C7F7FB] bg-200  rounded-2xl shadow-md '>
                <button
                  type="button"
                  onClick={() => {
                    onPlaneAnimation(true);
                    goSearch () ; }}
                  className={`
        px-4 py-4
        flex items-center 
        text-slate-500
        shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
        h-full
        transition-all
        rounded-xl
        hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
    `}                  
                >
                  <Search className="w-full  text-slate-900 stroke-[2.5] " />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
