
import { useState } from 'react';
import ReturnBtn from '../../../assets/ReturnBtn.svg';
import ModeDePaiementCard from './components/paiement/ModeDePaiementCard';
import { useNavigate } from 'react-router-dom';
import assurance_Ico from '../../../assets/assurance.svg'
import useIsMobile from '../../../components/layouts/UseIsMobile';


export default function PaymentPage  ()

{   const [IsSelected, setIsSelected] = useState(false);
    const onClick = () => {
        setIsSelected(!IsSelected);
    };
    const navigate = useNavigate();
    const handleretour = () =>
    {
        navigate(-1);
    }
    

    return (
        <>
            <div className={` ${useIsMobile() ? 'w-full px-4' : 'w-full'} justify-center flex flex-col items-center min-h-screen  mb-10 `}>
                <div className="w-80  h-15  rounded-xl mt-4">

                    <button onClick={handleretour}><img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-5 transform -translate-y-1/2' /></button>
                    < h1 className='text-3xl text-[#98EAF3] font-medium text-center'>Paiement</h1>
                </div>
                <div className='w-full items-center h-70 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-15 gap-2'>
                    <p className='font-bold m-3 '>Récapitulatif de votre réservation</p>
                    <div className=' w-full h-70  mt-6 border-t-[#2C474B] border-b-[#2C474B] border-t-2 border-b-2 grid grid-cols  text-[15px]'>
                        <ul className='space-y-7 text-left m-2 font-bold'>
                            <li><p className='font-bold h-3'>Tajet : <span className='font-semibold'>Moulins-sur-Allier -- Nevers</span> </p></li>
                            <li><p className='h-3 mb-10'>Date :  <span className='font-semibold'>Jeudi 18 septembre 2025 • <span className=' -mt-10'>6h50 -7h37 </span></span> </p></li>
                            <li><p className='h-3'>Class : <span className='font-semibold'>Économie</span></p></li>
                            <li><p className='h-3'>Passagers : <span className='font-semibold'>Pirre Dupont</span></p></li>
                            <li><p className='h-3'>Prix Total : <span className='font-bold text-xl'>59,00 € </span></p></li>

                        </ul>
                        
                        
                    </div>
                    


                </div>
                <ModeDePaiementCard />
            
            <div className=' items-center h-70 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 gap-2'>
                <p className='font-bold m-3 '>Options supplémentaires</p>
                
                <div className=' w-full h-70  mt-6 border-t-[#2C474B]  border-t-2  grid grid-cols p-5 '>
                    <button
                        onClick={onClick}
                        className={`w-80 h-20 rounded-xl p-4 text-left transition  border-3
                        ${IsSelected ? "border-[#98EAF3] text-[#98EAF3]" : "border-[#2C474B] text-white"}
                            hover:border-[#98EAF3]`}
                    >
                        <div className="flex justify-between">
                            <img src={assurance_Ico} alt="" className='h-6 w-6 ' />

                            
                            <p className="font-semibold text-xs  w-40">Assurance annulation (+3,50 €)</p>
                            
                            <div className={` h-7 w-7  rounded-3xl border-3 border-[#2C474B] ${IsSelected && 'bg-[#98EAF3]'}`}>

                            </div>
                        </div>
                    </button>
                    <div className='flex display-center gap-3 -mt-5 h-20'>
                        <p className='font-bold  w-40 h-5 mt-4 text-left ml-2'>Code promo</p>
                        <input type="text" className='w-full bg-[#103035] h-15 rounded-2xl focus:ring-2 focus:ring-[#98EAF3] outline-none p-2 text-xl font-bold' />

                    </div>
               
            </div>
                
            </div>
            <div className='flex justify-between items-center mt-10 w-full px-4 '>
                <p className='text-2xl font-bold '>Total : </p>
                <p className='text-2xl font-bold '>59,00 €</p>
            </div>
            
            <button className="w-80  h-15 bg-[#98EAF3] rounded-xl mt-4 ml-8 mb-10">
                    <span className="text-[#115E66] font-bold text-3xl">Payer</span>
            </button>
            </div>
            
          
        </>

    );
}