import clockIco from '../../../../assets/clock.svg';
import checkMarck from '../../../../assets/checkMarck.svg';
import ClassCard from '../components/Recap/Classcard.tsx';
import { useState } from 'react';
import Inclus from '../components/Recap/Inclus.tsx';
import icoWifi from '../../../../assets/wifi.svg'
import priseIco from '../../../../assets/Prises.svg'
import climatisation_Ico from '../../../../assets/climatisation.svg'
import Serinita_card from '../components/Recap/serenita_card.tsx';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../../../components/layouts/UseIsMobile.tsx';
import type { LocationState } from '../types.ts';
import Correspendances from '../components/Recap/Correspendances.tsx';
import type { Stop, Leg } from '../components/Recap/Correspendances.tsx';
import RoadDetails from '../components/Recap/RoadDetails.tsx';
import PopUp from '../../../../components/AdditionalsComponents/PopUp.tsx';
import Header from '../components/Header.tsx';
import { useOutletContext } from 'react-router-dom';
import type { PanierItem } from '../../../panier/types.ts';



const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

function parseFrenchDate(str: string): string {
    const months: Record<string, number> = {
        janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
        juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11
    };

    const parts = str.split(" ");
    const day = Number(parts[1]);
    const month = months[parts[2].toLowerCase()];
    const year = Number(parts[3]);

    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    return `${year}-${mm}-${dd}`;
}

function combineDateAndTime(dateISO: string, time: string): string {
    return `${dateISO}T${time}:00`;
}

function randomSiegeRestant() {
    const numero = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return numero;
}

export default function Billet_Train_recap() {
    const { setPanierItems } = useOutletContext<{ panierItems: PanierItem[], setPanierItems: React.Dispatch<React.SetStateAction<PanierItem[]>> }>();

    const { state } = useLocation();
    const { journey, passagersCount, formattedDepartureDate } = (state || {}) as LocationState;

    const isoDate = parseFrenchDate(formattedDepartureDate);
    const departTimestamp = combineDateAndTime(isoDate, journey.departureTime);
    const arriveeTimestamp = combineDateAndTime(isoDate, journey.arrivalTime);

    const navigate = useNavigate();
    
    const isMobile: boolean = useIsMobile();

    const [selectedClass, setSelectedClass] = useState('Économie');
    const classes = [
        {
            name: 'Économie',
            description: 'Sièges confortables, espace standard, restauration basique.',
        },
        {
            name: 'Confort',
            description: 'Sièges plus larges, prise électrique, restauration améliorée.',
        },
        {
            name: 'Business',
            description: 'Sièges spacieux, accès salon, repas gastronomique, service prioritaire.',
        },
        {
            name: 'Première',
            description: 'Sièges spacieux, accès salon, repas gastronomique, service prioritaire.',
        },
    ];

    // const stops: Stop[] = [
    //     { kind: "station", city: "Paris", placeName: "Paris Gare de Lyon", arrival: "08:12", lat: 48.8443, lng: 2.3730 },
    //     { kind: "station", city: "Lyon", placeName: "Lyon Part-Dieu", arrival: "10:05", lat: 45.7606, lng: 4.8619 },
    //     { kind: "station", city: "Avignon", placeName: "Avignon TGV", arrival: "11:13", lat: 43.9210, lng: 4.7860 },
    //     { kind: "station", city: "Aix-en-Provence", placeName: "Aix-en-Provence TGV", arrival: "11:45", lat: 43.4550, lng: 5.3170 },
    //     { kind: "station", city: "Marseille", placeName: "Marseille Saint-Charles", arrival: "12:10", lat: 43.3026, lng: 5.3796 },
    //     { kind: "airport", city: "Marignane", placeName: "Marseille Provence Airport (MRS)", arrival: "13:05", lat: 43.4393, lng: 5.2214 },
    //     { kind: "airport", city: "New York", placeName: "John F. Kennedy Intl Airport (JFK)", arrival: "16:40", lat: 40.6413, lng: -73.7781 },
    // ];

    // const legs: Leg[] = [
    //     { fromIndex: 0, toIndex: 1, mode: "rail" },
    //     { fromIndex: 1, toIndex: 2, mode: "rail" },
    //     { fromIndex: 2, toIndex: 3, mode: "rail" },
    //     { fromIndex: 3, toIndex: 4, mode: "rail" },
    //     { fromIndex: 4, toIndex: 5, mode: "rail" },
    //     { fromIndex: 5, toIndex: 6, mode: "air" },
    // ];

    const stops: Stop[] = journey.stops;
    const legs: Leg[] = journey.legs;
    const [isAddedPanierDesplayed, setisAddesPanierDesplayed] = useState(false);
    const [Isloading, SetIsloading] = useState(false)


    async function handleClick() {

        try {

            SetIsloading(true);
            setisAddesPanierDesplayed(true);
            console.log('debut')
            const siegeRestant = randomSiegeRestant();

            const res = await fetch(`${base}/api/panier/add`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    departHeure: departTimestamp,
                    departLieu: journey.departureName,
                    arriveeHeure: arriveeTimestamp,
                    arriveeLieu: journey.arrivalName,
                    classe: selectedClass,
                    siegeRestant,
                    prix: journey.price,
                    dateVoyage: isoDate,
                    transportType: journey.simulated === true ? "AVION" : "TRAIN",
                }),


            });

            SetIsloading(false);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            if (res.ok) {
                const newItem: PanierItem = {
                    id: Math.random(), // temporaire
                    panierId: 0,       // temporaire
                    passagerId: 0,     // temporaire
                    departHeure: journey.departureTime,
                    departLieu: journey.departureName,
                    arriveeHeure: journey.arrivalTime,
                    arriveeLieu: journey.arrivalName,
                    classe: selectedClass,
                    siegeRestant: randomSiegeRestant(),
                    prix: journey.price,
                    ajouteLe: new Date(),
                    dateVoyage: new Date(isoDate),
                    typeTransport: journey.simulated ? "AVION" : "TRAIN",
                };
                setPanierItems(prev => [...prev, newItem]);
            }
            
            console.log("fin")

            console.log("Billet ajouté au panier avec succès.");
        } catch (error) {
            console.error("Erreur lors de l'ajout au panier :", error);
        }
    }


    const BtnOverlay = <>
        <button className="w-full h-16 bg-[#98EAF3] rounded-xl hover:bg-[#98EAF3]/90 transition" onClick={() => { navigate('/panier'); window.scroll({ top: 0, behavior: "smooth" }) }}> Accéder au panier </button>
    </>
    

    return (
        <div className="w-full  min-h-screen flex flex-col">
            <Header Titre='Récapitulatif'/>

            <div className="flex-1 w-full px-4 pb-8 space-y-5">

                <div className={`w-full grid gap-5 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {!isMobile && (
                        <div className="w-full rounded-2xl  overflow-hidden">
                            <Correspendances stops={stops} legs={legs} />
                        </div>
                    )}
                    <div className="w-full">
                        <RoadDetails
                            journey={journey}
                            formattedDepartureDate={formattedDepartureDate}
                            passagersCount={passagersCount}
                            stops={stops}
                            legs={legs}
                        />
                    </div>
                </div>

                {/* Mobile: Carte en pleine largeur */}
                {isMobile && (
                    <div className="w-full  rounded-2xl  overflow-hidden shadow-2xl">
                        <Correspendances stops={stops} legs={legs} />
                    </div>
                )}

                {/*Informations */}
                <div className="w-full px-4 py-5 bg-[#133A40] rounded-2xl border-2 border-[#2C474B]">
                    <div className="border-b-2 border-[#2C474B] pb-4 mb-4">
                        <p className="font-semibold text-center">Informations</p>
                    </div>
                    <div className="flex gap-8">
                        <div className="flex flex-col gap-6">
                            <img src={checkMarck} alt="" className="w-5 h-5" />
                            <img src={checkMarck} alt="" className="w-5 h-5" />
                            <img src={clockIco} alt="" className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-left">Billets téléchargeables immédiatement après l'achat</p>
                            <p className="text-left">Bagages inclus</p>
                            <p className="text-left">7 places restantes</p>
                        </div>
                    </div>
                </div>

                {/* Classe de voyage */}
                <div className="w-full bg-[#133A40] rounded-2xl border-2 border-[#2C474B]">
                    <div className="border-b-2 border-[#2C474B] p-4">
                        <p className="font-semibold text-center">Classe</p>
                    </div>
                    <div className="flex flex-wrap gap-5 justify-center py-5 px-3">
                        {classes.map((classe) => (
                            <div
                                key={classe.name}
                                onClick={() => setSelectedClass(classe.name)}
                                className="cursor-pointer"
                            >
                                <ClassCard
                                    name={classe.name}
                                    description={classe.description}
                                    selected={selectedClass === classe.name}
                                    IsMobile={isMobile}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inclus */}
                <Inclus
                    avantage1='WIFI'
                    Ico_path_Avantage1={icoWifi}
                    avantage2='Prise électrique'
                    Ico_path_Avantage2={priseIco}
                    avantage3='Climatisation'
                    Ico_path_Avantage3={climatisation_Ico}
                />

                <Serinita_card />

                {/*Total et boutons */}
                <div className="w-full">
                    <div className="flex justify-between items-center mb-6 px-4">
                        <p className="font-bold text-3xl">Total :</p>
                        <p className="font-bold text-3xl">{journey.price * passagersCount} €</p>
                    </div>

                    <div className={`flex ${isMobile ? 'flex-col' : 'flex justify-center'} gap-3 items-center`}>
                        <button
                            className="w-full max-w-xs h-16 bg-[#FFB856] rounded-xl hover:bg-[#FFB856]/90 transition"
                            onClick={handleClick}
                        >
                            <span className="text-[#115E66] font-bold text-lg">Ajouter au panier</span>
                        </button>

                        <Link
                            to="/Infos_Passagers"
                            state={{ journey, selectedClass, passagersCount, formattedDepartureDate }}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="w-full max-w-xs"
                        >
                            <button className="w-full h-16 bg-[#98EAF3] rounded-xl hover:bg-[#98EAF3]/90 transition">
                                <span className="text-[#115E66] font-bold text-lg">Continuer</span>
                            </button>
                        </Link>
                    </div>
                </div>
                {
                    isAddedPanierDesplayed &&

                    <PopUp message='Votre produit est bien ajouter au Panier ' setPopupIsDisplayed={setisAddesPanierDesplayed} Btn={BtnOverlay} isLoading={Isloading}  />
                }

            </div>
        </div>
    );
}