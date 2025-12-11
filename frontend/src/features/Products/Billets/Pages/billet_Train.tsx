import ReturnBtn from '../../../../assets/ReturnBtn.svg';
import clockIco from '../../../../assets/clock.svg';
import checkMarck from '../../../../assets/checkMarck.svg';
import ClassCard from '../components/Recap/Classcard.tsx';
import { useState } from 'react';
import Inclus  from '../components/Recap/Inclus.tsx';
import icoWifi from '../../../../assets/wifi.svg'
import priseIco from'../../../../assets/Prises.svg'
import climatisation_Ico from '../../../../assets/climatisation.svg'   
import Serinita_card from '../components/Recap/serenita_card.tsx';
import AjouterPanierBtn from '../components/Recap/AjouterPanierBtn.tsx';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../../../../components/layouts/UseIsMobile.tsx';
import type { LocationState } from '../types.ts';


export default function Billet_Train_recap()
{
    const { state } = useLocation();
    const { journey, passagersCount, formattedDepartureDate } = (state || {}) as LocationState;
    
    const navigate = useNavigate();
    const handleretour = () =>
    {
        navigate(-1);
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

    return (
        <div className='m-2 p-3  -mt-3 justify-center items-center '>
            <div className='relative mt-4 display flex justify-center items-center '>
                <button onClick={handleretour}><img src={ReturnBtn} alt="Return Button" className='absolute left-1 mt-5 transform -translate-y-1/2'  /></button>
                < h1 className='text-3xl text-[#98EAF3] font-medium text-center'>Récapitulatif</h1>
            </div>
            <div className='w-full  px-4 items-center h-70 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-15 '>
                <p className='font-bold h-auto w-full text-center mt-5'>{formattedDepartureDate}</p>
                <div className=' w-full h-40  mt-6 border-t-[#2C474B] border-b-[#2C474B] border-t-2 border-b-2 flex justify-between items-center'>
                    <div className='grid grid-cols gap-15 p-4'>
                        <span className='font-bold'>{journey.departureTime}</span>
                        <span className='font-bold'>{journey.arrivalTime}</span>
                    </div>
                    <div className='grid grid-cols gap-1 p-4'>
                        <div className='h-4 w-4 bg-gray-400 border-white border-2 rounded-2xl'></div>
                        <div className='border-l-3  border-dashed border-white h-14 w-1 ml-1.5'></div>
                        <div className='h-4 w-4 bg-black border-white border-2 rounded-2xl'></div>
                    </div>
                    <div className='grid grid-cols  gap-6 p-4 -ml-6'>
                        <div className='grid grid-cols'>
                            <span className='font-bold'>{journey.departureName}</span>
                            {/* <span className='text-xs font-light'>Gare de Moulins </span> */}
                        </div>
                        <div className='grid grid-cols'>
                            <span className='font-bold'>{journey.arrivalName}</span>
                            {/* <span className='text-xs font-light'>Gare de Nevers</span> */}
                        </div>
                    </div>
                    <div className='flex  gap-2 p-4 m-3'>
                        <img src={clockIco} className='h-5 w-5 mt-1' />
                        <span className='font-bold text-xl'>{journey.duration}</span>
                    </div>
                </div>
                <p className='m-4'>Total pour {passagersCount} passager{(passagersCount ?? 1) > 1 ? 's' : ''} : <span className='font-bold'>{journey.price * (passagersCount ?? 1)} €</span></p>


            </div>
            <div className='w-full items-center h-55 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-5'>
                <div className='border-b-3 border-[#2C474B] '>
                    <p className='m-4 font-semibold text-center -ml-2'>Informations</p>
                </div>
                <div className='flex justify-between'>
                    <div className='grid grid-cols gap-7 p-6'>
                        <img src={checkMarck} alt="" />
                        <img src={checkMarck} alt="" className='mt-2' />
                        <img src={clockIco} alt="" className='w-5 h-5'/>

                    </div>
                    <div className='grid grid-cols  '>
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
            <AjouterPanierBtn/>
                <Link to="/Infos_Passagers" state={{ journey, selectedClass, passagersCount, formattedDepartureDate }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} >
                    <button className="w-80  h-15 bg-[#98EAF3] rounded-xl mt-4">
                        <span className="text-[#115E66] font-bold text-xl">Continuer</span>
                    </button>
            </Link>
                
            </div>
                

        </div>
    )
}