import ReturnBtn from '../../../assets/ReturnBtn.svg';
import { useNavigate } from 'react-router-dom';

export default function Infos_Passagers() 
{
    const navigate = useNavigate();
    const handleretour = () => {
        navigate(-1);
    }


    return (
        <>
            <div className='flex-wrap m-2 p-3 -mt-3 '>
                <div className='m-2 p-3 -mt-3 '>
                    <div className='relative mt-4 display flex justify-center items-center '>

                        <button onClick={handleretour}><img src={ReturnBtn} alt="Return Button" className='absolute -translate-x-1/2 left-0 mt-5 transform ' /></button>
                        < h1 className='text-3xl text-[#98EAF3] font-medium text-center'>Informations voyageurs</h1>
                    </div>
                </div>
                <div className='w-full items-center h-70 bg-[#133A40] rounded-2xl border-2 border-[#2C474B] mt-15 gap-2'>
                    <p className='font-bold mt-4 ml-28 '>Vos informations</p>
                    <div className=' w-full h-70  mt-6 border-t-[#2C474B] border-b-[#2C474B] border-t-2 border-b-2 grid grid-cols  '>

                    </div>
                </div>
            </div>
        </>

    );
}