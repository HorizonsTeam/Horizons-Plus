import ReturnBtn from '../../../../assets/ReturnBtn.svg';
import clockIco from '../../../../assets/clock.svg';
import checkMarck from '../../../../assets/checkMarck.svg';
import ClassCard from '../components/Recap/Classcard.tsx';
import { useState } from 'react';
import Inclus from '../components/Recap/Inclus.tsx';
import icoWifi from '../../../../assets/wifi.svg';
import priseIco from '../../../../assets/Prises.svg';
import climatisation_Ico from '../../../../assets/climatisation.svg';
import Serinita_card from '../components/Recap/serenita_card.tsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useIsMobile from '../../../../components/layouts/UseIsMobile.tsx';
import type { LocationState } from '../types.ts';
import Correspendances from '../components/Recap/Correspendances.tsx';
import type { Stop, Leg } from '../components/Recap/Correspendances.tsx';
import RoadDetails from '../components/Recap/RoadDetails.tsx';
import PopUp from '../../../../components/AdditionalsComponents/PopUp.tsx';

const base = `${import.meta.env.VITE_API_URL || 'http://localhost:3005'}`;

function parseFrenchDate(str: string): string {
    const months: Record<string, number> = {
        janvier: 0,
        février: 1,
        mars: 2,
        avril: 3,
        mai: 4,
        juin: 5,
        juillet: 6,
        août: 7,
        septembre: 8,
        octobre: 9,
        novembre: 10,
        décembre: 11,
    };

    const parts = str.split(' ');
    const day = Number(parts[1]);
    const month = months[parts[2].toLowerCase()];
    const year = Number(parts[3]);

    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function combineDateAndTime(dateISO: string, time: string): string {
    return `${dateISO}T${time}:00`;
}

function randomSiegeRestant() {
    return String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
}

export default function Billet_Train_recap() {
    const { state } = useLocation();
    const { journey, passagersCount, formattedDepartureDate } = (state || {}) as LocationState;

    const isoDate = parseFrenchDate(formattedDepartureDate);
    const departTimestamp = combineDateAndTime(isoDate, journey.departureTime);
    const arriveeTimestamp = combineDateAndTime(isoDate, journey.arrivalTime);

    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [selectedClass, setSelectedClass] = useState('Économie');
    const [isAddedPanierDesplayed, setIsAddedPanierDesplayed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const stops: Stop[] = journey.stops;
    const legs: Leg[] = journey.legs;

    const classes = [
        { name: 'Économie', description: 'Sièges confortables, espace standard, restauration basique.' },
        { name: 'Confort', description: 'Sièges plus larges, prise électrique, restauration améliorée.' },
        { name: 'Business', description: 'Sièges spacieux, accès salon, repas gastronomique, service prioritaire.' },
        { name: 'Première', description: 'Sièges spacieux, accès salon, repas gastronomique, service prioritaire.' },
    ];

    const handleretour = () => {
        navigate(-1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    async function handleClick() {
        try {
            setIsLoading(true);
            setIsAddedPanierDesplayed(true);

            const siegeRestant = randomSiegeRestant();

            const res = await fetch(`${base}/api/panier/add`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    departHeure: departTimestamp,
                    departLieu: journey.departureName,
                    arriveeHeure: arriveeTimestamp,
                    arriveeLieu: journey.arrivalName,
                    classe: selectedClass,
                    siegeRestant,
                    prix: journey.price,
                    dateVoyage: isoDate,
                    transportType: journey.simulated ? 'AVION' : 'TRAIN',
                }),
            });

            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        } catch (error) {
            console.error('Erreur ajout panier :', error);
        } finally {
            setIsLoading(false);
        }
    }

    const BtnOverlay = (
        <button
            className="w-full h-16 bg-[#98EAF3] rounded-xl"
            onClick={() => {
                navigate('/panier');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
        >
            Accéder au panier
        </button>
    );

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* HEADER */}
            <div className="relative w-full flex justify-center items-center py-6">
                <button onClick={handleretour} className="absolute left-4">
                    <img src={ReturnBtn} alt="Retour" className="w-6 h-6" />
                </button>
                <h1 className="text-3xl text-[#98EAF3] font-medium">Récapitulatif</h1>
            </div>

            <div className="flex-1 w-full px-4 pb-8 space-y-5">
                {/* DESKTOP */}
                {!isMobile && (
                    <div className="grid grid-cols-2 gap-5 ">
                        <div className="rounded-2xl">
                            <Correspendances stops={stops} legs={legs} />
                        </div>

                        <div className="space-y-5">
                            <RoadDetails
                                journey={journey}
                                formattedDepartureDate={formattedDepartureDate}
                                passagersCount={passagersCount}
                                stops={stops}
                                legs={legs}
                            />

                            <div className="bg-[#133A40] rounded-2xl border-2 border-[#2C474B] p-4">
                                <p className="font-semibold text-center mb-4">Informations</p>
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-4">
                                        <img src={checkMarck} className="w-5 h-5" />
                                        <img src={checkMarck} className="w-5 h-5" />
                                        <img src={clockIco} className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <p>Billets téléchargeables immédiatement</p>
                                        <p>Bagages inclus</p>
                                        <p>7 places restantes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#133A40] rounded-2xl border-2 border-[#2C474B]">
                                <p className="font-semibold text-center p-4 border-b border-[#2C474B]">Classe</p>
                                <div className="flex flex-wrap justify-center gap-4 p-4">
                                    {classes.map((c) => (
                                        <div key={c.name} onClick={() => setSelectedClass(c.name)}>
                                            <ClassCard {...c} selected={selectedClass === c.name} IsMobile={false} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Serinita_card />

                            <div className='w-full'>
                                <div className="flex justify-between mb-4">
                                    <p className="text-3xl font-bold">Total :</p>
                                    <p className="text-3xl font-bold">{journey.price * passagersCount} €</p>
                                </div>

                                <button
                                    className="w-full h-16 bg-[#FFB856] rounded-xl mb-3"
                                    onClick={handleClick}
                                >
                                    Ajouter au panier
                                </button>

                                <Link
                                    to="/Infos_Passagers"
                                    state={{ journey, selectedClass, passagersCount, formattedDepartureDate }}
                                >
                                    <button className="w-full h-16 bg-[#98EAF3] rounded-xl">
                                        Continuer
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* MOBILE */}
                {isMobile && (
                    <div className="space-y-5">
                        

                        <div className="space-y-5">
                            <RoadDetails
                                journey={journey}
                                formattedDepartureDate={formattedDepartureDate}
                                passagersCount={passagersCount}
                                stops={stops}
                                legs={legs}
                            />
                            <div className="rounded-2xl overflow-hidden">
                                <Correspendances stops={stops} legs={legs} />
                            </div>

                            <div className="bg-[#133A40] rounded-2xl border-2 border-[#2C474B] p-4">
                                <p className="font-semibold text-center mb-4">Informations</p>
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-4">
                                        <img src={checkMarck} className="w-5 h-5" />
                                        <img src={checkMarck} className="w-5 h-5" />
                                        <img src={clockIco} className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <p>Billets téléchargeables immédiatement</p>
                                        <p>Bagages inclus</p>
                                        <p>7 places restantes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#133A40] rounded-2xl border-2 border-[#2C474B]">
                                <p className="font-semibold text-center p-4 border-b border-[#2C474B]">Classe</p>
                                <div className="flex flex-wrap justify-center gap-4 p-4">
                                    {classes.map((c) => (
                                        <div key={c.name} onClick={() => setSelectedClass(c.name)}>
                                            <ClassCard {...c} selected={selectedClass === c.name} IsMobile />
                                        </div>
                                    ))}
                                </div>

                                

                                
                            </div>
                            <Inclus
                                avantage1="WIFI"
                                Ico_path_Avantage1={icoWifi}
                                avantage2="Prise électrique"
                                Ico_path_Avantage2={priseIco}
                                avantage3="Climatisation"
                                Ico_path_Avantage3={climatisation_Ico}
                            />

                            <Serinita_card />
                            <div className="p-4">
                                <div className="flex justify-between mb-4">
                                    <p className="text-3xl font-bold">Total :</p>
                                    <p className="text-3xl font-bold">{journey.price * passagersCount} €</p>
                                </div>

                                <button
                                    className="w-full h-16 bg-[#FFB856] rounded-xl mb-3"
                                    onClick={handleClick}
                                >
                                    Ajouter au panier
                                </button>

                                <Link
                                    to="/Infos_Passagers"
                                    state={{ journey, selectedClass, passagersCount, formattedDepartureDate }}
                                >
                                    <button className="w-full h-16 bg-[#98EAF3] rounded-xl">
                                        Continuer
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {isAddedPanierDesplayed && (
                    <PopUp
                        message="Votre produit est bien ajouté au panier"
                        setPopupIsDisplayed={setIsAddedPanierDesplayed}
                        Btn={BtnOverlay}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
}
