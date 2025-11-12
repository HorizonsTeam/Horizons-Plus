import PlaneImage from '../../assets/avion-deco.png';
import PlaneImageDesktop from '../../assets/flight.png';
import { Link } from 'react-router-dom';
import SearchForm from './components/SearchForm';
export default function HomePage() {
  

  return (
    <div className="min-h-screen ">
      <SearchForm />
      
      {/* Flight Section */}
      <section className="lg:py-20 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Version Mobile */}
          <div className="lg:hidden">
            <div className="px-6 py-8">
              <h2 className="text-[32px] font-bold mb-4 text-[#98EAF3] leading-tight">
                Voyagez<br />en avion
              </h2>
              <p className="text-[#98EAF3]/90 mb-2 text-[15px] leading-relaxed">
                Trouvez le vol idéal pour<br />votre prochaine<br />destination.
              </p>
            </div>
            <div className="relative overflow-hidden mb-6 w-full h-[472px]">
              <img 
                src={PlaneImage} 
                alt="Avion dans les nuages"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-center text-[#98EAF3] font-medium mb-6 px-4">
              Paris → New York à partir de 299€
            </p>

            <div className="px-4 pb-8">
              <button className="w-full bg-[#7dd3c0] hover:bg-[#6bc4b1] text-[#1a3d3d] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg">
                Rechercher un vol
              </button>
            </div>
          </div>

          {/* Version Desktop */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:px-12">
            {/* Colonne gauche - Texte et CTA */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h2 className="text-5xl xl:text-6xl font-bold mb-6 text-[#98EAF3] leading-tight">
                  Voyagez en avion
                </h2>
                <p className="text-[#98EAF3]/90 text-xl leading-relaxed max-w-md">
                  Trouvez le vol idéal pour votre prochaine destination.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-[#98EAF3] font-medium">
                  Paris → New York à partir de 299€
                </p>
                <button className="bg-[#7dd3c0] hover:bg-[#6bc4b1] text-[#1a3d3d] font-semibold py-4 px-10 rounded-xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl hover:scale-105">
                  Rechercher un vol
                </button>
              </div>
            </div>
            {/* Colonne droite - Image */}
            <div className="relative overflow-hidden  h-[600px]">
              <img 
                src={PlaneImageDesktop} 
                alt="Avion dans les nuages"
                className="absolute inset-0 w-full h-full object-contain object-center"
              />
            </div>

          </div>
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
            <Link to="/Ville" className="text-[#98EAF3]">
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
            </Link>

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