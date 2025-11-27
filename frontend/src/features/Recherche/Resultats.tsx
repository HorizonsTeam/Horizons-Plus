
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ReturnBtn from '../../assets/ReturnBtn.svg';
import Right_ico from '../../assets/Right_Ico.svg';
import Left_ico from '../../assets/Left_Ico.svg';
import Train_Ico from '../../assets/train_ico2.svg';
import Plane_Ico from '../../assets/plane_ico2.svg';

import Productcard from './ProductCard/ProductCard.tsx';
import BestPrice from './ProductCard/bestPrice.tsx';
import Date_String from './Date.tsx';
import type { Journey } from './ProductCard/types.ts';

export default function Resultats() {
    const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

    const navigate = useNavigate();

    const [transport, setTransport] = useState<'plane' | 'train'>('train');

    const handleretour = () => navigate(-1);

    const [searchParams] = useSearchParams();
    const fromId = searchParams.get('fromId') || '';
    const fromName = searchParams.get('fromName') || '';
    const toId = searchParams.get('toId') || '';
    const toName = searchParams.get("toName") || '';
    const [departureDate, setDepartureDate] = useState<string>(
        searchParams.get('departureDate') || new Date().toISOString().split('T')[0]
    );
    const arrivalDate = searchParams.get('arrivalDate') || '';

    const [journeyData, setJourneyData] = useState<Journey[]>([]);

    const changeDate = (delta: number) => {
        const current = new Date(departureDate);
        current.setDate(current.getDate() + delta);
        setDepartureDate(current.toISOString().split('T')[0]);
    };

    useEffect(() => {
        if (!fromId || !toId || !departureDate) return;

        console.log("departureDate:", departureDate);
        
        fetch(`${base}/api/search/journeys?from=${encodeURIComponent(fromId)}&to=${encodeURIComponent(toId)}&datetime=${encodeURIComponent(departureDate)}`)
            .then(res => res.json())
            .then(data => {
                console.log('API journeys response:', data);
                setJourneyData(data);
            })
            .catch(err => console.error('Fetch journeys error:', err));
    }, [fromId, toId, departureDate, arrivalDate]);

    console.log('journeyData:', journeyData);
    
    return (
        <>
            <div className=" flex items-center justify-center mt-6">
                <button onClick={handleretour}><img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-10 transform -translate-y-1/2' /></button>
                <div className="flex flex-col items-center">
                    <h3 className='font-bold text-primary text-xl truncate max-w-[200px]'>{fromName} - {toName}</h3>
                    <h4 className='text-primary'>1 passagers</h4>
                </div>
            </div>

            <div className="flex items-center justify-center space-x-4 bg-dark p-4">
                <button
                className="border-4 border-primary rounded-xl p-2 w-13"
                onClick={() => changeDate(-1)}
                >
                <img src={Left_ico} alt="Previous Day" className="ml-2" />
                </button>

                <Date_String date={new Date(departureDate)} />

                <button
                className="border-4 border-primary rounded-xl p-2 w-13"
                onClick={() => changeDate(1)}
                >
                <img src={Right_ico} alt="Next Day" className="ml-2" />
                </button>
            </div>

            <div className="flex items-center justify-between w-full my-10 ">
                <button
                onClick={() => setTransport('train')}
                className={`w-2/3 h-[68px] flex justify-center items-center border-b-4 border-b-white rounded-tr-3xl transition-colors duration-300 ${
                    transport === 'train' ? 'bg-[#133A40]' : 'bg-transparent'
                }`}
                >
                <div className="flex flex-col items-center">
                    <img src={Train_Ico} alt="Train" />
                    {transport === 'train' && <BestPrice />}
                </div>
                </button>

                <button
                onClick={() => setTransport('plane')}
                className={`w-2/3 h-[68px] flex justify-center items-center border-b-4 border-b-white rounded-tl-3xl transition-colors duration-300 ${
                    transport === 'plane' ? 'bg-[#133A40]' : 'bg-transparent'
                }`}
                >
                <div className="flex flex-col items-center">
                    <img src={Plane_Ico} alt="Avion" />
                    {transport === 'plane' && <BestPrice />}
                </div>
                </button>
            </div>

            <div className="bg-[#133A40] px-2 pt-5 -mt-10 w-full  h-300  ">
                <div className="flex  gap-2  -ml-3">
                    <button className="flex items-center gap-1 border-primary border-2 px-4 py-2 rounded-full text-primary  rounded-full text-sm w-24">
                    <span className='-ml-1'>Horaires </span>
                    <span className="text-primary">▼</span>
                    </button>

                
                    <button className="flex items-left  gap-1 border-primary border-2 px-4 py-2 rounded-full text-primary px-4 py-2 rounded-full text-sm w-20">
                    <span className='-ml-1'>Gares </span>
                    <span className="text-primary">▼</span>
                    </button>

                    <button className="flex items-center gap-1 border-primary border-2 px-4 py-2 rounded-full text-primary text-primary px-4 py-2 rounded-full text-sm w-24">
                    <span className='-ml-1'>Départs </span>
                    <span className="text-primary">▼</span>
                    </button>

                    <button className="flex items-center gap-2 text-[#133A40] bg-primary px-4 py-2 rounded-full text-sm w-20">
                    <span className='-ml-1'>Direct</span>
                    <span className="text-[#133A40]">▼</span>
                    </button>
                </div>

                {/* Product cards */}
                {[...Array(6)].map((_, idx) => (
                    <Productcard key={idx} isAirPlane={transport === 'plane'} journey={journeyData[idx]} />
                ))}
            
            </div>
        </>
    )
}