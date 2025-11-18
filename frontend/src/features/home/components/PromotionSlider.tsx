import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';


const destinations = [
  {
    id: 1,
    title: "Pack American Dream",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    features: [
      { icon: "✈️", text: "Billets d'avion aller-retour inclus" },
      { icon: "🏨", text: "7 nuits en hôtel 4 étoiles" },
      { icon: "🏄", text: "Activités incluses : jet-ski, soirées privées, et plus" }
    ],
    price: "1999 €"
  },
  {
    id: 2,
    title: "Pack Riviera Française",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    features: [
      { icon: "✈️", text: "Billets d'avion aller-retour inclus" },
      { icon: "🏨", text: "5 nuits en hôtel 5 étoiles" },
      { icon: "🍽️", text: "Dîners gastronomiques et visites guidées" }
    ],
    price: "2499 €"
  },
  {
    id: 3,
    title: "Pack Caraïbes Paradise",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    features: [
      { icon: "✈️", text: "Billets d'avion aller-retour inclus" },
      { icon: "🏨", text: "6 nuits en resort tout inclus" },
      { icon: "🤿", text: "Plongée sous-marine et sports nautiques" }
    ],
    price: "1799 €"
  },
  {
    id: 4,
    title: "Pack Méditerranée",
    image: "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=800&q=80",
    features: [
      { icon: "✈️", text: "Billets d'avion aller-retour inclus" },
      { icon: "🏨", text: "7 nuits en villa privée" },
      { icon: "⛵", text: "Excursions en yacht et visites culturelles" }
    ],
    price: "2899 €"
  }
];

export default function PromotionSlider() {
  return (
    <div className="w-full  py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-teal-100 mb-4">
            Ne passez pas à côté de nos promotions
          </h2>
          <p className="text-xl text-teal-200">
            Réservez des milliers de voyages à des milliers de prix
          </p>
        </div>

        {/* Slider */}
        <Swiper
       
          spaceBetween={24}
          slidesPerView="auto"
          
         
          className="pb-12"
        >
          {destinations.map((destination) => (
            <SwiperSlide key={destination.id} className="!w-80 md:!w-96">
              <div className="bg-[#2C474B] rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
                {/* Image */}
                <div className="h-50 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Contenu */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {destination.title}
                  </h3>
                  
                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {destination.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-white-100">
                        <span className="mr-2 text-lg">{feature.icon}</span>
                        <span className="text-sm mt-1">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Prix */}
                  <div className="text-center pt-1">
                    <p className="text-sm mb-1 text-end">À partir de <span className="text-teal-200 font-bold">{destination.price}</span></p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bouton CTA */}
        <div className="text-center mt-8">
          <button className="btn-primary w-full lg:w-auto lg:mx-auto lg:block bg-amber-400 hover:bg-amber-500 text-[#115E66] font-semibold px-12 py-4 rounded-xl transition-colors duration-200 text-base shadow-lg cursor-pointer">
            Découvrir nos promotions
          </button>
        </div>
      </div>

      {/* Styles personnalisés pour Swiper */}
      <style>{`
        .swiper-slide {
          width: auto !important;
          height: auto;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          color: #fbbf24;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
        
        .swiper-pagination-bullet {
          background: #fbbf24;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 32px;
          border-radius: 6px;
        }
        
        .swiper-scrollbar {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .swiper-scrollbar-drag {
          background: #fbbf24;
        }
      `}</style>
    </div>
  );
}