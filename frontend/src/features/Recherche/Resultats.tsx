
import { useState, useEffect, useMemo} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FiltreBloc from './Filtres/FiltresBloc.tsx';
import ReturnBtn from '../../assets/ReturnBtn.svg';
import Right_ico from '../../assets/Right_Ico.svg';
import Left_ico from '../../assets/Left_Ico.svg';
import Train_Ico from '../../assets/train_ico2.svg';
import Plane_Ico from '../../assets/plane_ico2.svg';

import Productcard from './ProductCard/ProductCard.tsx';
import BestPrice from './ProductCard/bestPrice.tsx';
import Date_String from './Date.tsx';
import type { Journey } from './ProductCard/types.ts';
import Error from '../../components/AdditionalsComponents/Error.tsx';

import QouickModificationOverlay from './ModificationRapide/QuickSearchModif.tsx';

import useIsMobile from '../../components/layouts/UseIsMobile.tsx';
import type { StopType } from './Filtres/FiltresBloc.tsx';
import useIsScrolling from '../../components/layouts/UseScrolle.tsx';
import Caret from '../../assets/caret-down-arrow-south 1.svg';



export default function Resultats() {
    const [BoxIsOn, setBoxIsOn] = useState(false);

    const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

    const navigate = useNavigate();

    const [transport, setTransport] = useState<"plane" | "train">();

    const handleRetour = () => navigate(-1);

    const [searchParams] = useSearchParams();
    const fromId = searchParams.get("fromId") || '';
    const fromName = searchParams.get("fromName") || '';
    const toId = searchParams.get("toId") || '';
    const toName = searchParams.get("toName") || '';
    const passagerCount = Number(searchParams.get("passagers") || 1);
    const fromLat = searchParams.get("fromLat") || '';
    const fromLon = searchParams.get("fromLon") || '';
    const toLat = searchParams.get("toLat") || '';
    const toLon = searchParams.get("toLon") || '';
    const fromSource = searchParams.get("fromSource") || '';
    const toSource = searchParams.get("toSource") || '';

    const [departureDate, setDepartureDate] = useState<string>(
        searchParams.get("departureDate") || new Date().toISOString().split('T')[0]
    );

    const [formattedDepartureDate, setFormattedDepartureDate] = useState<string>(
        formatDateToFrench(departureDate)
    );

    useEffect(() => {
        setFormattedDepartureDate(formatDateToFrench(departureDate));
    }, [departureDate]);

    const arrivalDate = searchParams.get("arrivalDate") || '';

    const today = new Date().toISOString().split('T')[0];
    const isPrevDisabled = new Date(departureDate) <= new Date(today);

    const [journeyData, setJourneyData] = useState<Journey[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    function formatDateToFrench(dateString: string): string {
        const date = new Date(dateString);
        const formatted = new Intl.DateTimeFormat("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);

        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    const changeDate = (delta: number) => {
        const current = new Date(departureDate);
        current.setDate(current.getDate() + delta);
        setDepartureDate(current.toISOString().split('T')[0]);
    };

    useEffect(() => {
        if (!fromId || !toId || !departureDate) return;
        setIsLoading(true);
        setErrorMessage(null);

        const query = new URLSearchParams({
            fromId,
            fromName,
            fromLat,
            fromLon,
            toId,
            toName,
            toLat,
            toLon,
            fromSource,
            toSource,
            datetime: departureDate,
        });

        if (arrivalDate) query.append("arrivalDate", arrivalDate);

        fetch(`${base}/api/search/journeys?${query.toString()}`)
            .then(res => res.json())
            .then(data => {
                console.log('API journeys response:', data);

                if (data.error) {
                    setErrorMessage(data.error);
                    setJourneyData([]);
                } else {
                    setErrorMessage(null);
                    setJourneyData(data);
                }

                
            })
            .catch(err => {
                console.error('Fetch journeys error:', err);
                setErrorMessage("Erreur serveur, réessayez plus tard");
                setJourneyData([]);
            })
            .finally(() => setIsLoading(false));

    }, [fromId, toId, departureDate, arrivalDate]);


    const uniqueJourneys = journeyData.filter((journey, index, self) => {
        const id = `${journey.departureName}-${journey.arrivalName}-${journey.departureTime}-${journey.arrivalTime}`;
        return self.findIndex(j =>
            `${j.departureName}-${j.arrivalName}-${j.departureTime}-${j.arrivalTime}` === id
        ) === index;
    });

    const journeyList: Journey[] = uniqueJourneys.filter((journey) => {
        const now = new Date();

        // Combine departureDate (YYYY-MM-DD) + departureTime (HH:mm)
        const [hours, minutes] = journey.departureTime
            .split(":")
            .map(Number);
        const [year, month, day] = departureDate.split("-").map(Number);

        const departure = new Date(year, month - 1, day, hours, minutes);

        // Si la date est différente d'aujourd'hui → on garde toujours
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        const journeyDay = new Date(year, month - 1, day);

        if (journeyDay.getTime() !== today.getTime()) {
            return true;
        }

        // Si c'est aujourd'hui → on compare l'heure
        return departure >= now;
    })

    const lowestPrice = useMemo(() => {
        if (!journeyList?.length) return null;
        return Math.min(...journeyList.map(j => j.price));
    }, [journeyList]);
    const isMobile = useIsMobile();


   


    const timeToMinutes = (hhmm: string) => {
        const [h, m] = hhmm.split(":").map(Number);
        return h * 60 + m;
    };

    const matchBucket = (hhmm: string, bucket: string) => {
        if (!bucket) return true;

        const t = timeToMinutes(hhmm);

        // Matin: 05:00 - 11:59
        if (bucket === "Matin") return t >= 5 * 60 && t < 12 * 60;

        // Après-midi: 12:00 - 17:59
        if (bucket === "Après-midi") return t >= 12 * 60 && t < 18 * 60;

        // Soir: 18:00 - 04:59 (donc 18:00-23:59 OU 00:00-04:59)
        if (bucket === "Soir") return t >= 18 * 60 || t < 5 * 60;

        return true;
    };
    type Filters = {
        stopType: StopType;
        priceOption: string;
        timeDeparturOption: string;
        timeArrivalOption: string;
    };

    const [filters, setFilters] = useState<Filters>({
        stopType: "Tout type",
        priceOption: "",
        timeDeparturOption: "",
        timeArrivalOption: "",
    });



    const applyFilters = (
        list: Journey[],
        filters: Filters,
        transport?: "train" | "plane"
    ) => {
        let out = [...list];

        // Transport (autorisé car tu as déjà journey.simulated dans ton code)
        if (transport === "plane") {
            out = out.filter(j => j.simulated === true);
        } else if (transport === "train") {
            out = out.filter(j => j.simulated === false);
        }

        // Escales
        if (filters.stopType === "Direct") {
            out = out.filter(j => j.numberOfTransfers === 0);
        } else if (filters.stopType === "Correspondance") {
            out = out.filter(j => j.numberOfTransfers > 0);
        }
        else if (filters.stopType === "Tout type") {
            // ne rien faire
        }

        // Horaires (bucket)
        if (filters.timeDeparturOption) {
            out = out.filter(j => matchBucket(j.departureTime, filters.timeDeparturOption));
        }
        if (filters.timeArrivalOption) {
            out = out.filter(j => matchBucket(j.arrivalTime, filters.timeArrivalOption));
        }

        // Prix (tri)
        if (filters.priceOption === "Prix croissant") {
            out.sort((a, b) => a.price - b.price);
        }
        if (filters.priceOption === "Prix décroissant") {
            out.sort((a, b) => b.price - a.price);
        }


        return out;
    };
    const displayedJourneys = useMemo(() => {
        return applyFilters(journeyList, filters, transport);
    }, [journeyList, filters, transport]);


    const ErrorBtn = 
            <div className=' flex w-full gap-10'>
                <button className="text-sm font-bold bg-primary text-secondary p-4 rounded-lg hover:bg-[#6ACDD8] transition-all duration-300 cursor-pointer " onClick={() => { setBoxIsOn(!BoxIsOn); scrollTo({ top: 0, behavior: "smooth" }) }}>Modifier le trajet</button>
                <button className="text-sm font-bold bg-[#FFB856] text-secondary p-4 rounded-lg hover:bg-[#C28633] transition-all duration-300 cursor-pointer " onClick={() => { setTransport("plane"); scrollTo({ top: 0, behavior: "smooth" }) }}>Voir les vols</button>
            </div>
      

    const [FiltreMobileIsOn, setFiltreMobileIsOn] = useState<boolean>(false);
    const Onscrolle = useIsScrolling();
    return (
        < >
            <div>
                <button onClick={handleRetour}>
                    <img
                        src={ReturnBtn}
                        alt="Return Button"
                        className=" cursor-pointer absolute left-4 mt-10 transform -translate-y-1/2"
                    />
                </button>
                <div className="flex items-center justify-center mt-6" onClick={() => setBoxIsOn(!BoxIsOn)}>

                    <div className="cursor-pointer flex flex-col items-center" onClick={() => BoxIsOn && setBoxIsOn(false)}>
                        <h3 className="font-bold text-primary text-xl truncate max-w-[200px]">
                            {fromName} - {toName}
                        </h3>
                        <h4 className="text-primary">

                            {passagerCount} passager{passagerCount > 1 ? "s" : ""}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-4 bg-dark p-4" onClick={() => BoxIsOn && setBoxIsOn(false)} >
                    <button
                        onClick={() => { changeDate(-1); }}
                        disabled={isPrevDisabled}
                        className={`cursor-pointer border-4 rounded-xl p-2 w-13 ${isPrevDisabled
                            ? "border-gray-400 opacity-50 cursor-not-allowed"
                            : "border-primary"
                            }`}
                    >
                        <img src={Left_ico} alt="Previous Day" className="ml-2" />
                    </button>

                    <Date_String date={new Date(departureDate)} />

                    <button
                        className="cursor-pointer border-4 border-primary rounded-xl p-2 w-13"
                        onClick={() => changeDate(1)}
                    >
                        <img src={Right_ico} alt="Next Day" className="ml-2" />
                    </button>
                </div>

                <div className="flex items-center justify-between w-full my-10 " onClick={() => BoxIsOn && setBoxIsOn(false)}>
                    <button
                        onClick={() => setTransport('train')}
                        className={`cursor-pointer w-2/3 h-[68px] flex justify-center items-center border-b-4  rounded-tr-3xl transition-colors duration-300 ${transport === "train" ? "bg-[#133A40] border-[#98EAF3]" : "bg-transparent border-b-white"
                            }`}
                    >
                        <div className="flex flex-col items-center" onClick={() => BoxIsOn && setBoxIsOn(false)}>
                            <img src={Train_Ico} alt="Train" />
                            {transport === "train" && <BestPrice value={lowestPrice} />}
                        </div>
                    </button>

                    <button
                        onClick={() => setTransport("plane")}
                        className={`cursor-pointer w-2/3 h-[68px] flex justify-center items-center border-b-4  rounded-tl-3xl transition-colors duration-300 ${transport === "plane" ? "bg-[#133A40] border-[#98EAF3]" : "bg-transparent border-b-white"
                            }`}
                    >
                        <div className="flex flex-col items-center">
                            <img src={Plane_Ico} alt="Avion" />

                            {transport === "plane" && <BestPrice value={lowestPrice} />}
                        </div>
                    </button>
                </div>



                <div
                    className={`bg-[#133A40] px-2 pt-5 -mt-10 w-full pb-10 ${IsLoading ? "flex justify-center" : "flex"}`}
                    onClick={() => BoxIsOn && setBoxIsOn(false)}
                >
                    {!isMobile && 

                        <FiltreBloc
                            stopType={filters.stopType}
                            setStopType={(v) =>
                                setFilters(prev => ({ ...prev, stopType: v }))
                            }

                            priceOption={filters.priceOption}
                            setPriceOption={(v) =>
                                setFilters(prev => ({ ...prev, priceOption: v }))
                            }

                            timeDeparturOption={filters.timeDeparturOption}
                            setTimedeparturOption={(v) =>
                                setFilters(prev => ({ ...prev, timeDeparturOption: v }))
                            }

                            timeArrivalOption={filters.timeArrivalOption}
                            setTimeArrivalOption={(v) =>
                                setFilters(prev => ({ ...prev, timeArrivalOption: v }))
                            }

                            resetFilters={() =>
                                setFilters({
                                    stopType: "Tout type",
                                    priceOption: "",
                                    timeDeparturOption: "",
                                    timeArrivalOption: "",
                                })
                            }

                            Isloading={IsLoading}
                        />



                    }
                    {isMobile && (
                        <>
                            {/* Bouton */}
                            <button
                                className={`fixed top-55 left-0 z-15 h-10 ${Onscrolle ? "w-6 " : "w-16 "} rounded-tr-xl rounded-br-xl bg-primary text-[#2C474B] font-bold hover:bg-blue-300`}
                                onClick={() => setFiltreMobileIsOn(true)}
                            >
                                {Onscrolle ? <img src={Caret} alt="caret" className="w-7 h-8" /> : "Filtres"}
                            </button>

                            {/* Backdrop */}
                            <div
                                onClick={() => setFiltreMobileIsOn(false)}
                                className={[
                                    "fixed inset-0 z-40 bg-black/30",
                                    "transition-opacity duration-300 ease-in-out",
                                    FiltreMobileIsOn ? "opacity-100" : "opacity-0 pointer-events-none",
                                ].join(" ")}
                            />

                            {/* Sidebar  */}
                            <div
                                className={[
                                    "fixed inset-0 z-50",
                                    "transform-gpu transition-transform duration-300 ease-in-out will-change-transform",
                                    FiltreMobileIsOn ? "translate-x-0" : "-translate-x-full pointer-events-none",
                                ].join(" ")}
                            >
                                <div className="h-full w-full max-w-sm">
                                    <FiltreBloc
                                        stopType={filters.stopType}
                                        setStopType={(v) =>
                                            setFilters(prev => ({ ...prev, stopType: v }))
                                        }

                                        priceOption={filters.priceOption}
                                        setPriceOption={(v) =>
                                            setFilters(prev => ({ ...prev, priceOption: v }))
                                        }

                                        timeDeparturOption={filters.timeDeparturOption}
                                        setTimedeparturOption={(v) =>
                                            setFilters(prev => ({ ...prev, timeDeparturOption: v }))
                                        }

                                        timeArrivalOption={filters.timeArrivalOption}
                                        setTimeArrivalOption={(v) =>
                                            setFilters(prev => ({ ...prev, timeArrivalOption: v }))
                                        }

                                        resetFilters={() =>
                                            setFilters({
                                                stopType: "Tout type",
                                                priceOption: "",
                                                timeDeparturOption: "",
                                                timeArrivalOption: "",
                                            })
                                        }

                                        Isloading={IsLoading}
                                    />



                            </div>
                        </div>
                        </>
                    )}

                     
                    

                    
                    {
                        displayedJourneys.length === 0 && !IsLoading ? (
                            <Error errorMessage={errorMessage}  errorBtns={ErrorBtn}   />




                        ) :  (
                            <div className='w-full px-4 py-4'>


                                {displayedJourneys.map((journey, idx) => (
                                    <Productcard
                                        key={`${journey.departureName}-${journey.arrivalName}-${journey.departureTime}-${journey.arrivalTime}-${idx}`}
                                        journey={journey}
                                        passagersCount={passagerCount}
                                        formattedDepartureDate={formattedDepartureDate}
                                        index={idx}
                                        IsLoading={IsLoading}
                                    />
                                ))}

                            </div>
                        )}
                </div>
                <QouickModificationOverlay
                    villeDepart={fromName}
                    villeArrivee={toName}
                    Passagers={passagerCount}
                    dateSearch={departureDate}
                    BoxIsOn={BoxIsOn}
                    setBoxIsOn={setBoxIsOn}
                    setIsLoading={setIsLoading}
                    setErrorMessage={setErrorMessage}
                    setJourneyData={setJourneyData}
                    setTransport={setTransport}
                />
                

            </div>

        </>
    );
}