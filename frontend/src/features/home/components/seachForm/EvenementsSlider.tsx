import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveDestinationFromCity, guessSearchableCityName } from '../../../../lib/eventLocation';

interface SportEvent {
  idEvent: string;
  strEvent: string;
  strSport: string;
  strThumb: string;
  dateEvent: string;
  strTime: string;
  strLeague?: string;
  strVenue?: string;
  strCountry?: string;
}

export default function EvenementSlider() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const leagueIds = [
    '4328', '4335', '4334', '4332', '4331', // Foot
    '4387',                                 // Basketball
    '4370',                                  // F1
    '4408'                                   // Tennis
  ];

  useEffect(() => {
    setMounted(true);
    const fetchEvenementSportif = async () => {
      try {
        const promises = leagueIds.map(id =>
          fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${id}`)
            .then(res => res.json())
        );

        const results = await Promise.all(promises);

        const allEvents: SportEvent[] = results
          .flatMap(result => result.events || [])
          .filter(e => e !== null)
          .sort((a, b) => new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime());

        setEvents(allEvents);
      } catch (error) {
        console.error('Erreur API :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvenementSportif();
  }, []);

  const handleEventClick = async (event: SportEvent) => {
    if (resolvingId) return; 

    setResolvingId(event.idEvent);

    const cityName = await guessSearchableCityName(event);
    if (!cityName) {
      console.warn(`Pas de ville déductible pour ${event.strEvent}`);
      setResolvingId(null);
      return;
    }

    const destination = await resolveDestinationFromCity(cityName);
    setResolvingId(null);

    if (!destination) {
      alert("Désolé, aucun trajet n'est disponible pour cette destination pour le moment.");
      return;
    }

    navigate(
      `/Recherche?toId=${encodeURIComponent(destination.id)}` +
      `&toName=${encodeURIComponent(destination.name)}` +
      `&toLat=${encodeURIComponent(destination.lat)}` +
      `&toLon=${encodeURIComponent(destination.lon)}` +
      `&toSource=${encodeURIComponent(destination.source)}` +
      `&departureDate=${encodeURIComponent(event.dateEvent)}`
    );
  };

  if (!mounted) return null;
  if (loading) return <div className="text-center py-20 text-white font-bold">Chargement...</div>;

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center text-white">
          Réservez votre prochain évènement
        </h2>

        {events.length > 0 ? (
          <Swiper
            spaceBetween={24}
            slidesPerView="auto"
            loop={events.length > 2}
            className="pb-12"
          >
            {events.map((event) => (
              <SwiperSlide key={event.idEvent} className="w-80! md:w-[580px]!">
                <div
                  className="relative rounded-xl overflow-hidden h-56 lg:h-64 group cursor-pointer"
                  onClick={() => handleEventClick(event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleEventClick(event);
                  }}
                  aria-busy={resolvingId === event.idEvent}
                >
                  <img
                    src={event.strThumb || "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop"}
                    alt={event.strEvent}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

                  {resolvingId === event.idEvent && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Recherche du trajet...</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] md:text-xs mb-1 uppercase font-bold tracking-widest" style={{ color: '#98EAF3' }}>
                      {event.strSport === 'Soccer' ? 'Football' : event.strSport}
                      <span className="text-gray-500 mx-2">|</span>
                      <span className="text-white">{event.strLeague}</span>
                    </p>
                    <h3 className="text-lg font-bold text-white">
                      {event.strEvent}
                    </h3>

                    <div className="flex items-center gap-2">
                      <div className="bg-[#98EAF3]/90 backdrop-blur-sm px-3 py-1 rounded-md border border-white/5 shadow-inner">
                        <p className="text-[12px] text-[white] font-semibold">
                          {new Date(event.dateEvent).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>

                      <span className="text-gray-400 text-xs">•</span>

                      <div className="bg-[#98EAF3]/90 backdrop-blur-sm px-3 py-1 rounded-md border border-white/5 shadow-inner">
                        <p className="text-[12px] text-white font-semibold">
                          {event.strTime.substring(0, 5)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-400">Aucun match prévu.</p>
        )}
      </div>
    </div>
  );
}