
// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function SearchForm() {
//     const [activeTab, setActiveTab] = useState<'depart' | 'arrivee'>('depart');
//     return <>
//       <section className="bg-dark px-4 py-8 lg:py-16 mb-30">
//         <div className="max-w-md mx-auto lg:max-w-4xl">
//           <h1 className="text-3xl lg:text-5xl font-bold text-center mb-8 lg:mb-12">
//             Envie de voyager ?
//           </h1>
//           <div className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8">
//             <div className="flex gap-2 mb-6 lg:hidden">
//               <button
//                 onClick={() => setActiveTab('depart')}
//                 className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
//                   activeTab === 'depart' 
//                     ? 'bg-primary text-dark' 
//                     : 'bg-dark/50 text-white'
//                 }`}
//               >
//                 Départ
//               </button>
//               <button
//                 onClick={() => setActiveTab('arrivee')}
//                 className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
//                   activeTab === 'arrivee' 
//                     ? 'bg-primary text-dark' 
//                     : 'bg-dark/50 text-white'
//                 }`}
//               >
//                 <span>Arrivée</span>
//                 {activeTab === 'arrivee' && (
//                   <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                     2
//                   </span>
//                 )}
//               </button>
//             </div>
//             <div className="space-y-4 lg:hidden">
//               <input
//                 type="text"
//                 placeholder="Où"
//                 className="search-input w-full"
//               />
//               <input
//                 type="text"
//                 placeholder="Quand"
//                 className="search-input w-full"
//               />
//             </div>
//             <div className="hidden lg:grid lg:grid-cols-2 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Départ</label>
//                 <input
//                   type="text"
//                   placeholder="D'où partez-vous ?"
//                   className="search-input w-full"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Arrivée</label>
//                 <input
//                   type="text"
//                   placeholder="Où allez-vous ?"
//                   className="search-input w-full"
//                 />
//               </div>
//             </div>

//             <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Date de départ</label>
//                 <input
//                   type="date"
//                   className="search-input w-full"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Date de retour</label>
//                 <input
//                   type="date"
//                   className="search-input w-full"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-400 mb-2">Passagers</label>
//                 <select className="search-input w-full">
//                   <option>1 passager</option>
//                   <option>2 passagers</option>
//                   <option>3 passagers</option>
//                   <option>4+ passagers</option>
//                 </select>
//               </div>
//             </div>

//             <button className="btn-primary w-full text-lg mt-6">
//               <Link to="/Recherche">Rechercher</Link>
//             </button>
//           </div>
//         </div>
//       </section>
//     </>;
// };




import { ArrowDownUp, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SearchForm() {
  return (
    <section className="px-4 py-8 lg:py-16">
      <div className=" mx-auto lg:max-w-4xl">
        <h1 className="text-4xl mx-auto  lg:text-5xl font-bold text-center mb-8 lg:mb-12 text-[#98EAF3]">
          Envie de voyager ?
        </h1>

        {/* Formulaire Mobile */}
        <div className="lg:hidden">
          
          {/* Container pour Ville départ + Ville arrivée avec bouton swap */}
          <div className="relative mb-4">
            {/* Ville départ */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Ville départ"
                className="w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Ville arrivée */}
            <div>
              <input
                type="text"
                placeholder="Ville arrivée"
                className="w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Bouton swap - positionné à droite entre les deux champs */}
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-400 rounded-full p-2.5 shadow-lg hover:bg-cyan-300 transition-all z-10"
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
                className="absolute right-3 top-1.2 -translate-y-1/2 bg-red-700 rounded-full p-1 border-[#103035] border-3 z-10 cursor-pointer"
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
          <Link to="/Recherche">
            <button className="w-full bg-[#98EAF3] text-[#115E66] font-bold rounded-2xl py-3.5 cursor-pointer " >
     
            Rechercher
            </button>
          </Link>
        </div>

        {/* Formulaire Desktop */}
        <div className="hidden lg:block bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          
          {/* Villes départ et arrivée */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Ville départ</label>
              <input
                type="text"
                placeholder="D'où partez-vous ?"
                className="w-full bg-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Ville arrivée</label>
              <input
                type="text"
                placeholder="Où allez-vous ?"
                className="w-full bg-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3.5 outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
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
          <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold rounded-2xl py-4 transition-all shadow-lg text-lg">
            Rechercher
          </button>
        </div>
      </div>
    </section>
  );
}