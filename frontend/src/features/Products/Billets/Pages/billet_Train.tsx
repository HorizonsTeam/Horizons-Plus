import ReturnBtn from '../../../../assets/ReturnBtn.svg';
import clockIco from '../../../../assets/clock.svg';
import checkMarck from '../../../../assets/checkMarck.svg';
import ClassCard from '../components/Recap/Classcard.tsx';
import {  useState } from 'react';
import Inclus  from '../components/Recap/Inclus.tsx';
import icoWifi from '../../../../assets/wifi.svg'
import priseIco from'../../../../assets/Prises.svg'
import climatisation_Ico from '../../../../assets/climatisation.svg'   
import Serinita_card from '../components/Recap/serenita_card.tsx';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../../../components/layouts/UseIsMobile.tsx';
import type { LocationState } from '../types.ts';
import Correspendances from '../components/Recap/Correspendances.tsx';
import type { Stop, Leg } from '../components/Recap/Correspendances.tsx';
import RoadDetails from '../components/Recap/RoadDetails.tsx';


export default function Billet_Train_recap()
{
    
    
    const { state } = useLocation();
    const { journey, passagersCount, formattedDepartureDate } = (state || {}) as LocationState;
    
    const navigate =useNavigate();
    const handleretour = () =>
    {
        navigate(-1);
        window.scrollTo({ top: 0, behavior: "smooth" }); 
    };
    const isMobile : boolean = useIsMobile();
    
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
    //ex : 
    // Paris -> Lyon -> Avignon -> Aix -> Marseille (train)
    // Marseille Airport (MRS) -> New York JFK (flight)
    const stops: Stop[] = [
        { kind: "station", city: "Paris", placeName: "Paris Gare de Lyon", arrival: "08:12", lat: 48.8443, lng: 2.3730 },
        { kind: "station", city: "Lyon", placeName: "Lyon Part-Dieu", arrival: "10:05", lat: 45.7606, lng: 4.8619 },
        { kind: "station", city: "Avignon", placeName: "Avignon TGV", arrival: "11:13", lat: 43.9210, lng: 4.7860 },
        { kind: "station", city: "Aix-en-Provence", placeName: "Aix-en-Provence TGV", arrival: "11:45", lat: 43.4550, lng: 5.3170 },
        { kind: "station", city: "Marseille", placeName: "Marseille Saint-Charles", arrival: "12:10", lat: 43.3026, lng: 5.3796 },


        { kind: "airport", city: "Marignane", placeName: "Marseille Provence Airport (MRS)", arrival: "13:05", lat: 43.4393, lng: 5.2214 },


        { kind: "airport", city: "New York", placeName: "John F. Kennedy Intl Airport (JFK)", arrival: "16:40", lat: 40.6413, lng: -73.7781 },
    ];

    const legs: Leg[] = [
        //rail pour train , air pour vol
        { fromIndex: 0, toIndex: 1, mode: "rail" },
        { fromIndex: 1, toIndex: 2, mode: "rail" },
        { fromIndex: 2, toIndex: 3, mode: "rail" },
        { fromIndex: 3, toIndex: 4, mode: "rail" },

        { fromIndex: 4, toIndex: 5, mode: "rail" },

        // FLIGHT leg 
        { fromIndex: 5, toIndex: 6, mode: "air" },
    ];

    return (
        <div className='m-2 p-3  -mt-3 justify-center items-center '>
            <div className='relative mt-4 display flex justify-center items-center '>
                <button onClick={handleretour}><img src={ReturnBtn} alt="Return Button" className='absolute left-1 mt-5 transform -translate-y-1/2'  /></button>
                < h1 className='text-3xl text-[#98EAF3] font-medium text-center'>Récapitulatif</h1>
            </div>

            <div className='flex  justify-center gap-6 mt-4'>
            {!isMobile &&
                    <div className='w-full h-full border-4 rounded-3xl border-[#FFB856] overflow-hidden mt-15 shadow-2xl'>
                <Correspendances stops={stops} legs={legs} />
            </div>
            }
            
            <RoadDetails journey={journey} formattedDepartureDate={formattedDepartureDate} passagersCount={passagersCount}  stops={stops} legs={legs}  />



            </div>
            {isMobile &&

                <div className='w-full h-full py-4'>
                    <Correspendances stops={stops} legs={legs} />
                </div>
             }
            <div className=' items-center h-55 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-5 '>
                <div className='border-b-3 border-[#2C474B] '>
                    <p className='m-4 font-semibold text-center -ml-2'>Informations</p>
                </div>
                <div className='flex justify-start  gap-10'>
                    <div className='grid grid-cols gap-7 p-6'>
                        <img src={checkMarck} alt="" />
                        <img src={checkMarck} alt="" className='mt-2' />
                        <img src={clockIco} alt="" className='w-5 h-5'/>

                    </div>
                    <div className='grid grid-cols  mt-2'>
                        <p className='text-left mt-2 '>Billets téléchargeables immédiatement après l’achat</p>
                        <p className='text-left mb-1'>Bagages inclus</p>
                        <p className='text-left mb-1 '>7 places restantes</p>
                    </div>
                </div>
            </div>
            <div className='w-full justify-center  bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-5 '>
                <div className='border-b-3 border-[#2C474B] '>
                    <p className='m-4 font-semibold text-center -ml-0.5'>Classe</p>
                </div>
                <div className={`flex ${isMobile ? 'flex-wrap    gap-5 ' : 'flex-wrap gap-8'} w-full   justify-center py-5 p-3`}>
                    {classes.map((classe) => (
                        <div key={classe.name} onClick={() => setSelectedClass(classe.name)}>
                            <ClassCard
                                name={classe.name}
                                description={classe.description}
                                selected={selectedClass == classe.name}
                                IsMobile={isMobile}
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            <Inclus avantage1='WIFI' Ico_path_Avantage1={icoWifi} avantage2='Prise électrique' Ico_path_Avantage2={priseIco} 
            avantage3='Climatisation' Ico_path_Avantage3={climatisation_Ico}/>

            <Serinita_card/>

            <div className=' flex justify-between m-5 '>
                <p className='font-bold text-3xl'>Total : </p>
                <p className='font-bold text-3xl'>{journey.price * (passagersCount ?? 1)} €</p>

            </div>
            <div className='grid grid-cols gap-2 m-4 justify-center items-center '>
                <Link to="/Infos_Passagers" state={{ journey, selectedClass, passagersCount, formattedDepartureDate }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} >
                    <button className="w-80  h-15 bg-[#98EAF3] rounded-xl mt-4">
                        <span className="text-[#115E66] font-bold text-xl">Continuer</span>
                    </button>
            </Link>
                
            </div>
                

        </div>
    )
}