import Mobigo from '../../../assets/mobigo_ico.svg';
import ClockIco from '../../../assets/clock.svg';
import planelogo from '../../../assets/plane_ico2.svg';
import airFrance from '../../../assets/Air_France_ico.png';
import train_not_active from '../../../assets/train_not_active.svg';
import { Link } from 'react-router-dom';
import useIsMobile from '../../../components/layouts/UseIsMobile';


type Props =
    {
        airPlane: boolean;
    }
export default function ProductCard({ airPlane }: Props) {
    const isMobile = useIsMobile ();

    return (
        <div className=" bg-[#103035] rounded-3xl mt-6 border-4 border-[#2C474B] -ml-2 p-2">
            <Link to="/Recap">
                <div className="flex items-center p-2 mt-1  gap-5" >
                   
                    
                </div>
                <div className={` w-full flex flex-cols justify-between ${!isMobile && ' px-4 '}  `} >


                    <div className='grid grid-cols gap-5  '>
                        <img src={airPlane ? planelogo : train_not_active} alt="" />

                        <span className='font-bold text-xs '> 19:00</span>
                        <span className='font-bold text-xs'> 19:30</span>
                    </div>

                    <div className='grid grid-col gap-2 ' >
                        <img src={airPlane ? airFrance : Mobigo} alt="" className='w-19 h-10 mx-3'/>
                        <div className='grid grid-cols  '>
                            <div className='rounded-4xl border-white border-1 bg-black w-4 h-4 m-2'></div>
                            <div className="border-l border-dashed border-white h-3 w-1 mr-4 ml-4"></div>
                            <div className='rounded-4xl bg-white w-4 h-4 m-2'></div>
                        </div>
                    </div>
                    <div className='grid grid-col  gap-4 '>
                        <div className='bg-[#98EAF3] h-6 rounded-md w-15 ml-5 p-1'>
                            < p className='text-[#103035] font-bold text-xs w-full text-center '>Direct</p>
                        </div>
                        <div className='grid grid-cols gap-4'>
                            <span className='font-bold text-xl text-left   w-10'> Nevers </span>
                            <span className='font-bold text-xs w-25 text-left  '>Moulins-sur-Allier  </span>
                        </div>
                    </div>
                    <div className={` grid  grid-cols gap-11 ml-10 ${!isMobile ? ' w-29' : ' -mr-5'} `}>

                        <div className='flex justify-center gap-3'>
                            <img src={ClockIco} alt="" />
                            <span className='text-xs opacity-50 '>0h30min</span>
                        </div>
                        <span className='text-2xl font-extrabold w-28 -mb-5 mr-10'>10,50 €</span>
                        <div className="bg-[#FFB856] rounded-bl-xl rounded-tl-xl rounded-br-3xl w-35 h-8  -mb-2 text-white font-semibold text-xs items-center flex justify-center">
                            <p>Il reste 5 places</p>
                        </div>

                    </div>
                </div>
            </Link>
        </div>
    );
}