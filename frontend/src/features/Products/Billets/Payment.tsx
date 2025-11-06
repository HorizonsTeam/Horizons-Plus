
import ReturnBtn from '../../../assets/ReturnBtn.svg';
import ModeDePaiementCard from './components/paiement/ModeDePaiementCard.tsx';
import { useNavigate } from 'react-router-dom';


export default function PaymentPage  ()

{   
    const navigate = useNavigate();
    const handleretour = () =>
    {
        navigate(-1);
    }
    

    return (
        <>
            <div>
                <div className='relative mt-4'>

                    <button onClick={handleretour}><img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-5 transform -translate-y-1/2' /></button>
                    < h1 className='text-3xl text-[#98EAF3] font-medium text-center'>Paiement</h1>
                </div>
                <div className='w-full items-center h-70 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 gap-2'>
                    <p className='font-bold m-3 '>Récapitulatif de votre réservation</p>
                    <div className=' w-full h-70  mt-6 border-t-[#2C474B] border-b-[#2C474B] border-t-2 border-b-2 grid grid-cols  '>
                        <ul className='space-y-7 text-left m-2 font-bold'>
                            <li><p className='font-bold h-3'>Tajet : <span className='font-semibold'>Moulins-sur-Allier -- Nevers</span> </p></li>
                            <li><p className='h-3'>Date :  <span className='font-semibold'>Jeudi 18 septembre 2025 • <span className=' -mt-10'>6h50 -7h37 </span></span> </p></li>
                            <li><p className='h-3'>Class : <span className='font-semibold'>Économie</span></p></li>
                            <li><p className='h-3'>Passagers : <span className='font-semibold'>Pirre Dupont</span></p></li>
                            <li><p className='h-3'>Prix Total : <span className='font-bold text-xl'>59,00 € </span></p></li>

                        </ul>
                        
                        
                    </div>
                    


                </div>
                <ModeDePaiementCard />
            </div>
        </>

    );
}