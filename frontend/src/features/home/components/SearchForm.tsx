import { ArrowDownUp, Minus } from 'lucide-react';
import { useState } from 'react';
import AutocompleteInput from '../../../components/autocomplete/AutocompleteInput.tsx';

import { useNavigate } from 'react-router-dom';
import type { Suggestion } from '../../../components/autocomplete/types.ts';

export default function SearchForm() {
  const [departure, setDeparture] = useState<Suggestion | null>(null); // Pour stocker l'objet complet de la ville de départ
  const [arrival, setArrival] = useState<Suggestion | null>(null);   // Pour stocker l'objet complet de la ville d'arrivée
  const today = new Date().toISOString().split("T")[0];
  const [departureDate, setDepartureDate] = useState(today);
  const [arrivalDate, setArrivalDate] = useState<string>("");
  const [passagerCount, setPassagerCount] = useState<number>(1);

  const [rotation, setRotation] = useState<number>(0);

  const Navigate = useNavigate();

  const isDisabled =
  !departure?.id ||
  !departure?.name ||
  !arrival?.id ||
  !arrival?.name ||
  !departureDate;

  //Fonction swap
  const handleSwap = () => {
    setDeparture(departure);
    setArrival(arrival);
    setRotation((prev) => prev + 180);
  }

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isDeparture: boolean
  ) => {
    const value = e.target.value;

    // Si la valeur n'est pas complète (moins de 10 caractères "YYYY-MM-DD"), on ne valide pas encore
    if (value.length < 10) {
      if (isDeparture) setDepartureDate(value);
      else setArrivalDate(value);
      return;
    }

    const selectedDate = new Date(value);
    const todayDate = new Date(today); // today = "YYYY-MM-DD"

    if (isDeparture) {
      if (selectedDate < todayDate) {
        alert("La date de départ ne peut pas être dans le passé.");
        return;
      }
      setDepartureDate(value);
    } else {
      const departure = departureDate ? new Date(departureDate) : null;
      if (departure && selectedDate < departure) {
        alert("La date d'arrivée ne peut pas être avant la date de départ.");
        return;
      }
      setArrivalDate(value);
    }
  };

  return (
    <section className="px-4 py-8 lg:py-16">
      <div className=" mx-auto lg:max-w-4xl">
        <h1 className="text-4xl mx-auto  lg:text-5xl font-bold text-center mb-8 lg:mb-12 text-primary">
          Envie de voyager ?
        </h1>

        {/* Formulaire Mobile */}
        <div className="lg:hidden">
          
          {/* Container pour Ville départ + Ville arrivée avec bouton swap */}
          <div className="relative mb-4">
            {/* Ville départ */}
            <div className="mb-3">
              <AutocompleteInput 
                label=""
                value={departure?.name || ''}                // affiche le nom si dispo
                placeholder="Ville départ"
                onChange={(text) =>
                            setDeparture(departure
                              ? { ...departure, name: text }
                              : { id: "", name: text }
                            )
                          }
                onSelect={(obj) => setDeparture(obj)}        // obj = {id, name, type, region}
                className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Ville arrivée */}
            <div>
              <AutocompleteInput 
                label=""
                value={arrival?.name || ''}                  // affiche le nom si dispo
                placeholder="Ville arrivée"
                onChange={(text) =>
                            setArrival(arrival
                              ? { ...arrival, name: text }
                              : { id: "", name: text }
                            )
                          }
                onSelect={(obj) => setArrival(obj)}          // obj = {id, name, type, region}
                className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Bouton swap - positionné à droite entre les deux champs */}
            <button
              type='button'
              onClick={handleSwap}
              style={{ transform: `rotate(${rotation}deg)` }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary p-2 rounded-4xl border-2 border-dark text-white transition-transform duration-300"              
              aria-label="Inverser"
            >
              <ArrowDownUp className="w-4 h-4 text-slate-900 stroke-[2.5]" />
            </button>
          </div>

          {/* Dates - Départ et Arrivée côte à côte */}
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
                <button
                className="absolute right-3 top-1.2 -translate-y-1/2 bg-red-700 rounded-full p-1 border-[#103035] border-3 z-10"
                aria-label="Cancel arrival date"
              >
                <Minus className="w-3 h-3 text-white stroke-[3]" />
              </button>
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
            onClick={() => {
              if (isDisabled) return;

              Navigate(
                `/Recherche?fromId=${encodeURIComponent(departure.id)}&fromName=${encodeURIComponent(departure.name)}&toId=${encodeURIComponent(arrival.id)}&toName=${encodeURIComponent(arrival.name)}&departureDate=${encodeURIComponent(departureDate)}&arrivalDate=${encodeURIComponent(arrivalDate || "")}&passagers=${encodeURIComponent(passagerCount)}`
              );
            }}
          >
            Rechercher
          </button>
          

          
       
        </div>

        {/* Formulaire Desktop */}
        <div className="hidden lg:block bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          
          {/* Villes départ et arrivée */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <AutocompleteInput 
                label="Ville départ"
                value={departure?.name || ''}                  // affiche le nom si dispo
                placeholder="D'où partez-vous ?"
                onChange={(text) =>
                            setDeparture(departure
                              ? { ...departure, name: text }
                              : { id: "", name: text }
                            )
                          }
                onSelect={(obj) => setDeparture(obj)}          // obj = {id, name, type, region}
                className="search-input w-full bg-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
            <div>
              <AutocompleteInput 
                label="Ville arrivée"
                value={arrival?.name || ''}                  // affiche le nom si dispo
                placeholder="Où allez-vous ?"
                onChange={(text) =>
                            setArrival(arrival
                              ? { ...arrival, name: text }
                              : { id: "", name: text }
                            )
                          }
                onSelect={(obj) => setArrival(obj)}          // obj = {id, name, type, region}
                className="search-input w-full bg-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
          </div>

          {/* Dates et Passagers */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Date de départ</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => handleDateChange(e, true)}
                className="w-full bg-slate-600/50 text-white rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Date d'arrivée</label>
              <input
                type="date"
                value={arrivalDate}
                onChange={(e) => handleDateChange(e, false)}
                className="w-full bg-slate-600/50 text-white rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Passagers</label>
              <select
                className="w-full bg-slate-600/50 text-white rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30 cursor-pointer"
                value={passagerCount}
                onChange={(e) => setPassagerCount(Number(e.target.value))}
              >
                <option value={1}>1 passager</option>
                <option value={2}>2 passagers</option>
                <option value={3}>3 passagers</option>
                <option value={4}>4 passagers</option>
              </select>
            </div>
          </div>

          {/* Bouton Rechercher */}
          <button 
            disabled={isDisabled}
            className="w-full bg-primary hover:bg-cyan-300 text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg cursor-pointer"
            onClick={() => {
              if (isDisabled) return;

              Navigate(
                `/Recherche?fromId=${encodeURIComponent(departure.id)}&fromName=${encodeURIComponent(departure.name)}&toId=${encodeURIComponent(arrival.id)}&toName=${encodeURIComponent(arrival.name)}&departureDate=${encodeURIComponent(departureDate)}&arrivalDate=${encodeURIComponent(arrivalDate || "")}&passagers=${encodeURIComponent(passagerCount)}`
              );
            }}
          >
            Rechercher
          </button>
        </div>
      </div>
    </section>
  );
}
