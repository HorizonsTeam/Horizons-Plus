import Mobigo from '../../../assets/mobigo_ico.svg';
import ClockIco from '../../../assets/clock.svg';
import planelogo from '../../../assets/plane_ico2.svg';
import airFrance from '../../../assets/Air_France_ico.png';
import train_not_active from '../../../assets/train_not_active.svg';
import { Link } from 'react-router-dom';


type Props = 
{
    airPlane : boolean ; 
}
export default function ProductCard({ airPlane }: Props) {
    

    return (
        <div className="w-full bg-[#103035] rounded-3xl mt-6 border-4 border-[#2C474B]">
            <Link to="/Recap"> 
            <div className="flex items-center m-2 mb-5 gap-5">
                {/* Logo transport */}
            <img src={airPlane ? planelogo : train_not_active} alt="" />
                {/* Logo opérateur */}
            <img src={airPlane ? airFrance : Mobigo} alt="" />
                <div className='bg-[#98EAF3]  rounded-md w-20 ml-5'>
                    <span className='text-[#103035] font-bold text-xs '>Direct</span>
                </div>
                <div className='flex items-center gap-1'>
                    <img src={ClockIco} alt="" />
                    <span className='text-xs opacity-50 '>0h30min</span>
                </div>
            </div>
            <div className='flex h-25 -mt-5'>

            
                <div className='grid grid-col m-3 w-10'>
                    <span className='font-bold text-xs m-2'> 19:00</span>
                    <span className='font-bold text-xs m-2'> 19:30</span>
                </div>
                
                <div className='grid grid-col m-3 w-10' >
                    <div className='rounded-4xl border-white border-1 bg-black w-4 h-4 m-2'></div>
                    <div className="border-l border-dashed border-white h-3 w-1 mr-4 ml-4"></div>

                    <div className='rounded-4xl bg-white w-4 h-4 m-2'></div>
                </div>
                <div className='grid grid-col m-3 gap-4 '>
                    <span className='font-bold text-xl  -ml-5 w-10'> Nevers </span>
                    <span className='font-bold text-xs w-25 m-2 -ml-8 mr-5'>Moulins-sur-Allier  </span>
                </div>
                <div className='grid grid-col gap-9 w-10 mt-5 h-10'>
                    <span className='text-2xl font-extrabold w-28 -mb-5 mr-10'>10,50 €</span>
                    <div className="bg-[#FFB856] rounded-bl-xl rounded-tl-xl rounded-br-3xl w-30 px-4 py-2 text-white font-semibold text-xs -ml-2">
                        Il reste 5 places
                    </div>

                </div>
            </div>
            </Link>
        </div>
    );
  }