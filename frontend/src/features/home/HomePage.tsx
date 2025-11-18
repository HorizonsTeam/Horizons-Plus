import { useState } from 'react'; 
import PlaneImage from '../../assets/avion-deco.png';
import PlaneImageDesktop from '../../assets/flight.png';
import TrainImage from '../../assets/train.png';
import { Link } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import PromotionSlider from './components/PromotionSlider';
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'depart' | 'arrivee'>('depart');

  return (
    <div className="min-h-screen ">
      <SearchForm />
      
     

      {/* Flight Section */}
      <section className="px-0 py-12 lg:py-16 w-screen h-screen -ml-5 bg-dark">
        <div className="min-h-200 lg:max-w-7xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Voyagez en avion</h2>
          <p className="text-gray-400 mb-6 lg:mb-8 text-sm lg:text-base">
            Trouvez le vol idéal pour votre prochaine destination.
          </p>
          
          <div className="relative rounded-2xl overflow-hidden h-56 lg:h-96 mb-6 w-full">
            {/* Clouds behind and to the sides (adjust positions/sizes as needed) */}
            <img src={PlaneImage} className='scale-125  min-w-110 '
            />
            

            {/* Overlay gradient and caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent z-20"></div>
            <div className="absolute bottom-4 left-4 z-30">
              <p className="text-sm text-primary">Paris → New York à partir de 299€</p>
            </div>
          </div>

          <button className="btn-primary  w-80">
            Rechercher un vol
          </button>
        </div>
      </section>

      {/* Train Section */}
      <section className="lg:py-20 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Version Mobile */}
          <div className="lg:hidden">
            <div className="px-6 py-8">
              <h2 className="text-[32px] font-bold mb-4 text-primary leading-tight">
                Voyagez<br />en train
              </h2>
              <p className="text-primary/90 mb-2 text-[15px] leading-relaxed">
                Trouvez votre trajet en train, simplement et rapidement.
              </p>
            </div>
            <div className="relative overflow-hidden mb-6 w-full h-[472px]">
              <img 
                src={TrainImage} 
                alt="Avion dans les nuages"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-center text-primary font-medium mb-6 px-4">
              Paris → Lyon à partir de 25€
            </p>

            <div className="px-4 pb-8">
              <button className="w-full bg-primary active:bg-cyan-300 text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg">
                Rechercher un trajet
              </button>
            </div>
          </div>

          {/* Version Desktop */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:px-12">
            {/* Colonne gauche - Image */}
            <div className="relative overflow-hidden h-[600px] lg:order-first">
              <img 
                src={TrainImage} 
                alt="Train dans les nuages"
                className="absolute inset-0 w-full h-full object-contain object-center"
              />
            </div>

            {/* Colonne droite - Texte et CTA */}
            <div className="flex flex-col justify-center space-y-8 lg:order-last">
              <div>
                <h2 className="text-5xl xl:text-6xl font-bold mb-6 text-primary leading-tight">
                  Voyagez en train
                </h2>
                <p className="text-primary/90 text-xl leading-relaxed max-w-md">
                  Trouvez votre trajet en train, simplement et rapidement.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-primary font-medium">
                  Paris → Lyon à partir de 25€
                </p>
                <button className="w-full bg-primary hover:bg-cyan-300 text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg cursor-pointer">
                  Rechercher un trajet
                </button>
              </div>
            </div>
          </div>
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
            <Link to="/Ville" className="text-primary">
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

          <button className="btn-primary w-full lg:w-auto lg:mx-auto lg:block hover:bg-cyan-300 text-[#115E66] font-semibold px-12 py-4 rounded-xl shadow-lg cursor-pointer">
            Voir toutes les destinations
          </button>
        </div>
      </section>

      {/* Promotions Section */}
      <PromotionSlider />

      {/* Events Section */}
      <section className="px-4 py-12 lg:py-16 bg-dark">
        <div className="max-w-md mx-auto lg:max-w-7xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center">
            Réservez votre prochain évènement           
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