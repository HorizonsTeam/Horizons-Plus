
import { Link } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import PromotionSlider from './components/PromotionSlider';
import ImagesSwiper from '../../components/AdditionalsComponents/swipeImges';
import Plane1 from '../../assets/Plane.png';
import Plane2 from '../../assets/Plane2.jpg';
import Plane3 from '../../assets/Plane3.jpg';
import CardFan from '../../components/AdditionalsComponents/ImagesCards.tsx';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import TrainNoel from '../../assets/TrainImage.jpeg'
import TrainMontagne from '../../assets/TrainMontagne.jpg'
import TrainStation from '../../assets/TrainStation.jpg'
import { motion, type Variants } from "framer-motion";

import PlaneAnim from '../../assets/Avion.png'; 
import { useState } from 'react';



const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,     
    },
  },
};




export default function HomePage() {
  const [isPlaneAnimating, setIsPlaneAnimating] = useState(false);
  const PLANE_ANIM_DURATION_MS = 2000; 
  



  return (

    <div className="min-h-screen  w-full ">
      <section className="">
        {/* ✈️ Avion animé */}
        <motion.img
          src={PlaneAnim}
          alt="Avion animation"
          className="pointer-events-none fixed  z-50 w-16 lg:w-24 h-auto"
          initial={false}
          animate={

            isPlaneAnimating
              ? {
                
                x: [
                  "220%", "240%", "260%", "280%", "300%",
                  "320%", "340%", "360%", "380%", "400%",
                  "420%", "440%", "460%", "480%", "500%",
                  "520%", "540%", "560%", "580%", "600%",
                  "620%", "640%", "660%", "680%", "700%",
                  "720%", "740%", "760%", "780%", "800%",
                  "820%", "840%", "860%", "880%", "900%",
                  "920%", "940%", "960%", "980%", "1000%",
                  "1020%", "1040%", "1060%", "1080%", "1100%",
                  "1120%", "1140%", "1160%", "1180%", "1200%",
                  "1220%", "1240%", "1260%", "1280%", "1300%",
                  "1320%", "1340%", "1360%", "1380%", "1400%",
                  "1420%", "1440%", "1460%", "1480%", "1500%",
                  "1520%", "1540%", "1560%", "1580%", "1600%",
                  "1620%", "1640%", "1660%", "1680%", "1700%"
        
                ],

                y: [
                  "100%", "100%","100%","100%","100%","100%",
                  "100%","100%","100%","100%","100%","100%",
                  "100%","100%","100%","100%","100%","100%",
                  "100%","100%","100%","100%","100%","100%",
                  "100%","100%","100%","100%","100%","100%",
                  "100%","100%","100%","100%","100%","100%",
                  "100%","100%","100%","100%","100%","100%"
                  
                ],

           
                scale: [
                  1.15, 1.25, 1.35, 1.45, 1.55,
                  1.65, 1.75, 1.85, 1.95, 2.05,
                  2.15, 2.25, 2.35, 2.45, 2.55,
                  2.65, 2.75, 2.85, 2.95, 3.05,
                  3.15, 3.25, 3.35, 3.45, 3.55,
                  3.65, 3.75, 3.85, 3.95, 4.05,
                  4.15, 4.25, 4.35, 4.45, 4.55,
                  4.65, 4.75, 4.85, 4.95, 5.05,
                  5.15, 5.25, 5.35, 5.45, 5.55,
                  5.65, 5.75, 5.85, 5.95, 6.05,
                  6.15, 6.25, 6.35, 6.45, 6.55,
                  6.65, 6.75, 6.85, 6.95, 7.05,
                  7.15, 7.25, 7.35, 7.45, 7.55,
                  7.65, 7.75, 7.85, 7.95, 8.05,
                  8.15, 8.25, 8.35, 8.45, 8.55,
                  8.65, 8.75, 8.85, 8.95, 9.05,
                  9.15, 9.25, 9.35, 9.45, 9.55,
                  9.65, 9.75, 9.85, 9.95, 10.05
                
                ],

                
                rotate: [
                  -18,-18,-18,-18,-18,
                  -18,-18,-18,-18,-18,
                  -18,-18,-18,-18,-18

                  
                  
                  
                  

                ],

                
                opacity: [
                  0, 0.1, 0.2, 0.3, 0.4,
                  0.5, 0.6, 0.7, 0.8, 0.9,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1,
                  0.9, 0.8, 0.7, 0.6, 0.5,
                  0.4, 0.35, 0.3, 0.25, 0.2,
                  0.18, 0.16, 0.14, 0.12, 0.1,
                  0.08, 0.06, 0.05, 0.04, 0.03,
                  0.02, 0.015, 0.01, 0.008, 0.005,
                  0.003, 0.002, 0.001, 0
                ],
              }
              : { opacity: 0 }
          }

          transition={{
            duration: PLANE_ANIM_DURATION_MS / 1000,
            ease: "linear",
          }}
        />
      </section>
      <motion.section
        className="lg:py-20 "
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <SearchForm
          onPlaneAnimation={setIsPlaneAnimating}
          planeAnimDurationMs={PLANE_ANIM_DURATION_MS}
        />
              </motion.section>
     

      {/* Flight Section */}
      <motion.section
        className="lg:py-20 mt-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Version Mobile */}
          <div className="lg:hidden">
              <div
                className="relative overflow-hidden mb-6 max-h-screen h-150 mx-4 rounded-xl bg-no-repeat bg-cover bg-center flex flex-col"
                style={{ backgroundImage: `url(${Plane1})` }}
              >
                {/* Overlay sombre pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                {/* Contenu haut */}
                <div className="relative px-6 pt-8">
                  <h2 className="text-[32px] font-bold mb-4 text-white leading-tight">
                    Voyagez<br />en avion
                  </h2>
                  <p className="text-white/90 mb-2 text-[15px] leading-relaxed">
                    Trouvez le vol idéal pour<br />votre prochaine<br />destination.
                  </p>
                </div>

                {/* Contenu bas */}
                <div className="relative mt-auto px-4 pb-8">
                  <p className="text-sm text-center text-white font-medium mb-4">
                    Paris → New York à partir de 299€
                  </p>
                  <button className="w-full bg-primary hover:cursor-pointer active:bg-cyan-300 text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg" onClick={() => window.scroll({top: 0, behavior: 'smooth'})}>
                    Rechercher un vol
                  </button>
                </div>
            </div>

           
          </div>

          {/* Version Desktop */}
          <div className="hidden overflow-hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:px-12">
            {/* Colonne gauche - Texte et CTA */}
            <motion.section
              className="flex flex-col justify-center space-y-8"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <div>
                <h2 className="text-5xl xl:text-6xl font-bold mb-6 text-primary leading-tight">
                  Voyagez en avion
                </h2>
                <p className="text-primary/90 text-xl leading-relaxed max-w-md">
                  Trouvez le vol idéal pour votre prochaine destination.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-primary font-medium">
                  Paris → New York à partir de 299€
                </p>
                <button className="w-full bg-[#FFB856] hover:bg-[#C38C41] hover:drop-shadow-lg text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg cursor-pointer" onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'});}}>
                  Rechercher un vol
                </button>
              </div>
            </motion.section>

              
              <motion.section
                className="relative  w-full h-[600px]"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <CardFan
                  images={[Plane3, Plane2, Plane1]}
                  maxSpreadDeg={35}
                  cardWidth={260}
                  cardHeight={350}
                />
              </motion.section>
             

          </div>
        </div>
      </motion.section>
      

      {/* Train Section */}
      <motion.section
        className="lg:py-20 mt-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="max-w-7xl mx-auto">
         
          {/* Version Mobile */}
          <div className="lg:hidden">
            <div className="px-6 py-8">
              <h2 className="text-[32px] font-bold mb-4 text-primary ">
                Voyagez<br />en train
              </h2>
              <p className="text-primary/90 mb-2 text-[15px] leading-relaxed">
                Trouvez votre trajet en train, simplement et rapidement.
              </p>
            </div>
            <div className="relative mx-4 h-[472px] overflow-hidden rounded-xl">
              <Swiper
                modules={[Autoplay, Pagination]}
                loop={true}
                autoplay={{
                  delay: 2800,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                slidesPerView={1}
                spaceBetween={0}
                className="w-full h-full"
              >
                {[TrainNoel, TrainMontagne, TrainStation].map((img, index) => (
                  <SwiperSlide
                    key={index}
                    className="!w-full !h-full flex"  // 👈 force full width/height
                  >
                    <div className="w-full h-full">
                      <img
                        src={img}
                        alt={`Train en voyage ${index + 1}`}
                        className="w-full h-full object-cover border border-slate-200 rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>


           

            <div className="px-4 py-6 pb-8">
              <button className="w-full bg-primary active:bg-cyan-300 text-[#115E66] hover:cursor-pointer font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg" onClick={() =>window.scroll({top:0 , behavior: 'smooth'})}>
                Rechercher un trajet
              </button>
            </div>
          </div>


          {/* Version Desktop */}
          <div className="hidden overflow-hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:px-12">
            {/* Colonne gauche - Image */}
            <div
              className="relative overflow-hidden  w-full h-full lg:order-first p-4 bg-cover bg-center rounded-xl ">

              <ImagesSwiper
                baseWidth={550}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={false}
                loop={true}
                round={false}
              />
            </div>

            {/* Colonne droite - Texte et CTA */}
            <div className="flex flex-col justify-center space-y-8 lg:order-last w-full">
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
                <button className="w-full bg-[#FFB856] hover:bg-[#C38C41] hover:drop-shadow-lg text-[#115E66] font-semibold py-4 px-6 rounded-xl transition-colors duration-200 text-base shadow-lg cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Rechercher un trajet
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Destinations Section */}
      <motion.section
        className="px-4 py-12 lg:py-16 bg-dark"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
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
      </motion.section>
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
      {/* Promotions Section */}
      <PromotionSlider />
      </motion.section>

      {/* Events Section */}
      <motion.section
        className="px-4 py-12 lg:py-16 bg-dark"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
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
      </motion.section>
    </div>
  );
}