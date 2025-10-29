import ReturnBtn from '../../../assets/ReturnBtn.svg';
import clockIco from '../../../assets/clock.svg';
import checkMarck from '../../../assets/checkMarck.svg';



export default function Billet_Train_recap ()
{
    return (
        <div>
            <div className='relative mt-4'>
                <img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-5 transform -translate-y-1/2' />
                < h1 className='text-3xl text-[#98EAF3] font-medium text-center'>Récapitulatif</h1>
            </div>
            <div className='w-full items-center h-70 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-10'>
                <p className='font-bold m-3 '>Jeudi 18 septembre 2025</p>
                <div className=' w-full h-40  mt-6 border-t-[#2C474B] border-b-[#2C474B] border-t-2 border-b-2 flex justify-between items-center'>
                    <div className='grid grid-cols gap-15 p-4'>
                        <span className='font-bold'>6h50</span>
                        <span className='font-bold'>7h37</span>
                    </div>
                    <div className='grid grid-cols gap-1 p-4'>
                        <div className='h-4 w-4 bg-gray-400 border-white border-2 rounded-2xl'></div>
                        <div className='border-l-3  border-dashed border-white h-14 w-1 ml-1.5  '></div>
                        <div className='h-4 w-4 bg-black border-white border-2 rounded-2xl'></div>
                    </div>
                    <div className='grid grid-cols  gap-6 p-4 -ml-6'>
                        <div className='grid grid-cols'>
                        <span className='font-bold'>Moulins-sur-Allier</span>
                            <span className='text-xs font-light'>Gare de Moulins </span>
                        </div>
                        <div className='grid grid-cols'>
                        <span className='font-bold'>Nevers</span>
                        <span className='text-xs font-light'>Gare de Nevers</span>
                        </div>
                    </div>
                    <div className='flex  gap-2 p-4 m-3'>
                        <img src={clockIco} className='h-5 w-5 mt-1' />
                        <span className='font-bold text-xl'>1h30</span>
                    </div>
                </div>
                <p className='m-4'>Total pour un passager : <span className='font-bold'>59,50 €</span></p>


            </div>
            <div className='w-full items-center h-55 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-5'>
                <div className='border-b-3 border-[#2C474B] '>
                    <p className='m-4 font-semibold '>Informations </p>
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
            <div className='w-full items-center h-55 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-5'>
                <div className='border-b-3 border-[#2C474B] '>
                    <p className='m-4 font-semibold '>Classe</p>
                </div>
            </div>

        </div>
    )
}