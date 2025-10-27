
import ReturnBtn from '../../assets/ReturnBtn.svg';
import Right_ico from '../../assets/Right_Ico.svg'
import Left_ico from '../../assets/Left_Ico.svg'

import Train_Ico from '../../assets/train_ico2.svg';
import Plane_Ico from '../../assets/plane_ico2.svg';



export default function Resultats ()
{
    return (
        <>
        
        <div className=" flex items-center justify-center mt-6">
            <img src={ReturnBtn} alt="Return Button" className='absolute left-4 mt-10 transform -translate-y-1/2' />
            <div>
                <h3 className='font-bold text-[#98EAF3] text-xl'> Nevers - Moulin.... </h3>
                <h4 className='text-[#98EAF3]'>1 passagers </h4>
            </div>
        </div>
        <div className="flex items-center justify-center space-x-4 bg-dark p-4">
            <button className="border-4 border-[#98EAF3] rounded-xl p-2  w-13 ">
                <img src={Left_ico} alt="" className='ml-2' />
            </button>

            <button className="rounded-xl px-4 py-2 text-[#103035] bg-[#98EAF3] font-medium">
                Jeu 18 Sept
            </button>

            <button className="border-4 border-[#98EAF3] rounded-xl p-2  w-13 ">

                <img src={Right_ico} alt="" className='ml-2'/>
            </button>
        </div>
        <div className="flex items-center justify-between px-4">
            <button className="bg-[#133A40] w-1/2 flex justify-center items-center p-2 rounded-md">
                <img src={Train_Ico} alt="Train" className="" />
            </button>

            <button className="ml-4 p-2 rounded-md">
                <img src={Plane_Ico} alt="Avion" className="" />
            </button>


        </div>


        </>
    )
}