import { ArrowDownUp, Minus } from 'lucide-react';
import { useState } from 'react';
import AutocompleteInput from '../../../components/autocomplete/AutocompleteInput.tsx';
import { Link } from 'react-router-dom';

export default function SearchForm() {
  // Etat des villes 
  const [depart, setDepart] = useState<string>("");
  const [arrivee, setArrivee] = useState<string>("");
  const [rotation, setRotation] = useState<number>(0);

  //Fonction swap
  const handleSwap = () => {
    setDepart(arrivee);
    setArrivee(depart);
    setRotation((prev)=>prev + 180);
  }
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
                value={depart}
                placeholder="Ville départ"
                onChange={setDepart}
                className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Ville arrivée */}
            <div>
              <AutocompleteInput 
                label=""
                value={arrivee}
                placeholder="Ville arrivée"
                onChange={setArrivee}
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
                className="w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
              />
            </div>
            <div className="relative">
              <input
                type="date"
                placeholder="Arrivée"
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
              type="text"
              placeholder="Passagers"
              className="w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
            />
          </div>

          {/* Bouton Rechercher */}
          <Link to="/Recherche" className="w-full bg-primary active:bg-cyan-300 text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg">


            Rechercher
          </Link>

          
       
        </div>

        {/* Formulaire Desktop */}
        <div className="hidden lg:block bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          
          {/* Villes départ et arrivée */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <AutocompleteInput 
                label="Ville départ"
                value={depart}
                placeholder="D'où partez-vous ?"
                onChange={setDepart}
                className="search-input w-full bg-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
            <div>
              <AutocompleteInput 
                label="Ville arrivée"
                value={arrivee}
                placeholder="Où allez-vous ?"
                onChange={setArrivee}
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
                className="w-full bg-slate-600/50 text-white rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Date d'arrivée</label>
              <input
                type="date"
                className="w-full bg-slate-600/50 text-white rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Passagers</label>
              <select className="w-full bg-slate-600/50 text-white rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30 cursor-pointer">
                <option>1 passager</option>
                <option>2 passagers</option>
                <option>3 passagers</option>
                <option>4+ passagers</option>
              </select>
            </div>
          </div>

          {/* Bouton Rechercher */}
          <button className="w-full bg-primary hover:bg-cyan-300 text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg cursor-pointer">
            Rechercher
          </button>
        </div>
      </div>
    </section>
  );
}