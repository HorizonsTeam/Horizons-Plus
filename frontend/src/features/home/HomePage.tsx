import { useState } from 'react';
import { Calendar, MapPin, Users, ArrowDownUp, Minus, Plus } from 'lucide-react';
import imageJeu from '../../assets/image-jeu.png';
import nuage from '../../assets/nuage.png';

export default function HomePage() {
  const [showReturnDate, setShowReturnDate] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Search Form */}
      <section className="bg-dark px-4 py-8 lg:py-16">
        <div className="max-w-md mx-auto lg:max-w-5xl">
          <h1 className="mt-5 text-5xl lg:text-5xl font-bold text-center mb-8 lg:mb-12 text-[#98EAF3]">
            Envie de voyager ?
          </h1>

          {/* Search Form */}
          <div className="">
            
            {/* Mobile View */}
            <div className="lg:hidden">
              {/* Location Inputs with Swap Button */}
              <div className="relative mb-4">
                <div className="space-y-3">
                  {/* Ville départ */}
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ville départ"
                      className="w-full search-input text-white placeholder-gray-400 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-secondary/30"
                    />
                  </div>

                  {/* Ville arrivée */}
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ville arrivée"
                      className="w-full search-input text-white placeholder-gray-400 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-secondary/30"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-dark w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all">
                  <ArrowDownUp className="w-5 h-5" />
                </button>
              </div>

              {/* Date Tabs */}
              <div className="flex gap-2 mb-4">
                <button className="flex-1 search-input text-white py-4 px-4 rounded-xl font-medium flex items-center justify-center gap-2 border border-secondary/30">
                  <Calendar className="w-5 h-5" />
                  <span>Départ</span>
                </button>
                {showReturnDate ? (
                  <button 
                    onClick={() => setShowReturnDate(false)}
                    className="flex-1 search-input text-white py-4 px-4 rounded-xl font-medium flex items-center justify-center gap-2 relative hover:bg-dark transition-all border border-secondary/30"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Arrivée</span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold hover:bg-red-600 transition-all">
                      <Minus className="w-4 h-4" />
                    </span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowReturnDate(true)}
                    className="flex-1 search-input text-white py-4 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-dark transition-all border border-secondary/30"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter retour</span>
                  </button>
                )}
              </div>

              {/* Passagers */}
              <div className="relative mb-6">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Passagers"
                  className="w-full search-input text-white placeholder-gray-400 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all border border-secondary/30"
                />
              </div>

              {/* Search Button */}
              <button className="btn-primary w-full text-lg">
                Rechercher
              </button>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-3 font-medium">
                    Ville départ
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="D'où partez-vous ?"
                      className="search-input w-full pl-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-3 font-medium">
                    Ville arrivée
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Où allez-vous ?"
                      className="search-input w-full pl-12"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm text-gray-300 mb-3 font-medium">
                    Départ
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      className="search-input w-full pl-12"
                    />
                  </div>
                </div>
                {showReturnDate ? (
                  <div>
                    <label className="block text-sm text-gray-300 mb-3 font-medium flex items-center justify-between">
                      <span>Arrivée</span>
                      <button 
                        onClick={() => setShowReturnDate(false)}
                        className="bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        className="search-input w-full pl-12"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-gray-300 mb-3 font-medium">
                      &nbsp;
                    </label>
                    <button 
                      onClick={() => setShowReturnDate(true)}
                      className="w-full bg-dark/80 hover:bg-dark text-white rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all flex items-center justify-center gap-2 border border-secondary/30"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Ajouter retour</span>
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm text-gray-300 mb-3 font-medium">
                    Passagers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select className="search-input w-full pl-12 appearance-none cursor-pointer">
                      <option>1 passager</option>
                      <option>2 passagers</option>
                      <option>3 passagers</option>
                      <option>4+ passagers</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="btn-primary w-full text-lg">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>
      

      {/* Flight Section */}
      <section className="px-4 py-12 lg:py-16 bg-dark">
        <div className="max-w-md mx-auto lg:max-w-7xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Voyagez en avion</h2>
          <p className="text-gray-400 mb-6 lg:mb-8 text-sm lg:text-base">
            Trouvez le vol idéal pour votre prochaine destination.
          </p>
          
          <div className="relative rounded-2xl overflow-hidden h-56 lg:h-96 mb-6">
            <img
              src={nuage}
              alt="Nuages arrière gauche"
              className="absolute -left-20 -top-10 w-48 lg:w-96 opacity-90 z-0 pointer-events-none select-none"
            />
            <img
              src={nuage}
              alt="Nuages arrière droite"
              className="absolute -right-10 bottom-0 w-40 lg:w-80 opacity-80 z-0 pointer-events-none select-none"
            />
            <img
              src={nuage}
              alt="Nuage centre droit"
              className="absolute right-8 -top-6 w-56 lg:w-96 opacity-85 z-0 pointer-events-none select-none"
            />

            <img
              src={imageJeu}
              alt="Avion en vol"
              className="relative mx-auto h-full object-contain z-10"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent z-20"></div>
            <div className="absolute bottom-4 left-4 z-30">
              <p className="text-sm text-primary">Paris → New York à partir de 299€</p>
            </div>
          </div>

          <button className="btn-primary w-full lg:w-auto">
            Rechercher un vol
          </button>
        </div>
      </section>

      {/* Train Section */}
      <section className="px-4 py-12 lg:py-16 bg-secondary/10">
        <div className="max-w-md mx-auto lg:max-w-7xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Voyagez en train</h2>
          <p className="text-gray-400 mb-6 lg:mb-8 text-sm lg:text-base">
            Trouvez votre trajet en train, simplement et rapidement.
          </p>
          
          <div className="relative rounded-2xl overflow-hidden h-56 lg:h-96 mb-6">
            <img
              src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&h=600&fit=crop"
              alt="Train moderne"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-sm text-primary">Paris → Lyon à partir de 25€</p>
            </div>
          </div>

          <button className="btn-primary w-full lg:w-auto">
            Rechercher un trajet
          </button>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="px-4 py-12 lg:py-16 bg-dark">
        <div className="max-w-md mx-auto lg:max-w-7xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Prêt(e) à découvrir ?</h2>
          <p className="text-gray-400 mb-6 lg:mb-8 text-sm lg:text-base">
            Explorez nos destinations populaires et trouvez l'inspiration.
          </p>
          
          <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0 mb-8">
            {/* Rome */}
            <div className="destination-card">
              <div className="relative h-48 lg:h-56">
                <img
                  src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop"
                  alt="Rome Colisée"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold">Rome</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-lg font-semibold">4.5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Paris */}
            <div className="destination-card">
              <div className="relative h-48 lg:h-56">
                <img
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop"
                  alt="Paris"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold">Paris</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-lg font-semibold">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tokyo */}
            <div className="destination-card">
              <div className="relative h-48 lg:h-56">
                <img
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop"
                  alt="Tokyo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold">Tokyo</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="ml-1 text-lg font-semibold">4.7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primary w-full lg:w-auto lg:mx-auto lg:block">
            Voir toutes les destinations
          </button>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="px-4 py-12 lg:py-16 bg-secondary/10">
        <div className="max-w-md mx-auto lg:max-w-7xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Passez pas à côté de nos promotions
          </h2>
          <p className="text-gray-400 mb-6 lg:mb-8 text-sm lg:text-base">
            Réservez les meilleurs voyages au meilleurs prix
          </p>
          
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            {/* Pack American Dream */}
            <div className="bg-secondary rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop"
                alt="Plage tropicale"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-3">Pack American Dream</h3>
                <ul className="text-sm text-gray-300 space-y-1 mb-4">
                  <li>• Hôtel avec piscine, bar, mini-golf</li>
                  <li>• Tout-terrain en MIAMI ⭐</li>
                  <li>• Activités, petits-cadeaux print...</li>
                </ul>
                <p className="text-primary font-bold text-2xl mb-4">À partir de 1999€</p>
                <button className="btn-primary w-full">Voir Plus →</button>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center min-h-[140px]">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🎪</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">Spectacles</h4>
                <p className="text-xs text-gray-400">Concerts & Shows</p>
              </div>

              <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center min-h-[140px]">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">⚽</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">FIFA World Cup</h4>
                <p className="text-xs text-gray-400">Sports</p>
              </div>

              <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center min-h-[140px]">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🏎️</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">Racing</h4>
                <p className="text-xs text-gray-400">Compétitions</p>
              </div>

              <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center text-center min-h-[140px]">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">Notre-Dame</h4>
                <p className="text-xs text-gray-400">Culture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="px-4 py-12 lg:py-16 bg-dark">
        <div className="max-w-md mx-auto lg:max-w-7xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center">
            réservez votre porchain événement
          </h2>
          
          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            {/* Event 1 */}
            <div className="relative rounded-xl overflow-hidden h-56 lg:h-64 group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop"
                alt="Concert"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs text-primary mb-1 uppercase">Music</p>
                <h3 className="text-lg font-bold">Jazz en extérieur à Bordeaux</h3>
              </div>
            </div>

            {/* Event 2 */}
            <div className="relative rounded-xl overflow-hidden h-56 lg:h-64 group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop"
                alt="Sport"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs text-primary mb-1 uppercase">Sport</p>
                <h3 className="text-lg font-bold">Racing - Notre-Dame-des-dunes</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}