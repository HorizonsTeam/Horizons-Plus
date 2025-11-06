
import ReturnBtn from '../../../assets/ReturnBtn.svg';



export default function PaymentPage  ()

{   
    return (
        <>
            <div>
                <div className='relative mt-4'>
                    <img src={ReturnBtn}     alt="Return Button" className='absolute left-4 mt-5 transform -translate-y-1/2' />
                    < h1 className='text-3xl text-[#98EAF3] font-medium text-center'>Paiement</h1>
                </div>
                <div className='w-full items-center h-70 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10 gap-2'>
                    <p className='font-bold m-3 '>Récapitulatif de votre réservation</p>
                    <div className=' w-full h-70  mt-6 border-t-[#2C474B] border-b-[#2C474B] border-t-2 border-b-2 grid grid-cols  '>
                        <p className='font-bold h-3'>Tajet : <span>Moulins-sur-Allier -- Nevers</span> </p>
                        <p className='h-3'>Date :  </p>
                        <p className='h-3'>Class : </p>
                        <p className='h-3'>Passagers : </p>
                        <p className='h-3'>Prix Total : </p>
                        
                        
                    </div>
                    


                </div>
            </div>
        </>

    );
}