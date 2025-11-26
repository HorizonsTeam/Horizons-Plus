import Mobigo from '../../../assets/mobigo_ico.svg';
import ClockIco from '../../../assets/clock.svg';
import planelogo from '../../../assets/plane_ico2.svg';
import airFrance from '../../../assets/Air_France_ico.png';
import train_not_active from '../../../assets/train_not_active.svg';
import type { ProductCardProps } from './types.ts';
import { Link } from 'react-router-dom';

export default function ProductCard({ isAirPlane, journey }: ProductCardProps) {

    return (
        <div className="w-full bg-[#103035] rounded-3xl mt-6 border-4 border-[#2C474B] -ml-2 p-2">
            <Link to="/Recap">
                <div className="flex items-center p-2 mt-1  gap-5" >
                    {/* Logo transport */}
                    <img src={isAirPlane ? planelogo : train_not_active} alt="" />
                    {/* Logo opérateur */}
                    <img src={isAirPlane ? airFrance : Mobigo} alt="" />
                    {journey?.numberOfTransfers === 0 ? (
                        <div className='bg-[#98EAF3] h-6 rounded-md w-[60px] ml-5 p-1'>
                            <p className='text-[#103035] font-bold text-xs text-center'>Direct</p>
                        </div>
                    ) : (
                        <div className='bg-[#FF6B6B] h-6 rounded-md w-[112px] ml-5 p-1'>
                            <p className='text-white font-bold text-xs text-center'>
                                {journey?.numberOfTransfers} correspondance{journey?.numberOfTransfers > 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                    <div className='flex items-center gap-1'>
                        <img src={ClockIco} alt="" />
                        <span className='text-xs opacity-50 '>{journey?.duration}min</span>
                    </div>
                </div>
                <div className=' w-full flex flex-wrap text-center h-23 gap-2  '>
                    <div className='grid grid-col w-10 gap-4 mt-3'>
                        <span className='font-bold text-xs '>{journey?.departureTime}</span>
                        <span className='font-bold text-xs'>{journey?.arrivalTime}</span>
                    </div>

                    <div className='grid grid-col  w-10' >
                        <div className='rounded-4xl border-white border-1 bg-black w-4 h-4 m-2'></div>
                        <div className="border-l border-dashed border-white h-3 w-1 mr-4 ml-4"></div>

                        <div className='rounded-4xl bg-white w-4 h-4 m-2'></div>
                    </div>
                    <div className='grid grid-col  gap-4 '>
                        <span className='font-bold text-xl text-left w-10'>{journey?.departureName}</span>
                        <span className='font-bold text-xs w-25 text-left'>{journey?.arrivalName}</span>
                    </div>
                    <div className='grid grid-col gap-9 w-10 mt-5 h-10'>
                        <span className='text-2xl font-extrabold w-28 -mb-5 mr-10'>{journey?.price}</span>
                        <div className="bg-[#FFB856] rounded-bl-xl rounded-tl-xl rounded-br-3xl w-35 h-8 text-white font-semibold text-xs items-center flex justify-center">
                            <p>Il reste 5 places</p>
                        </div>

                    </div>
                </div>
            </Link>
        </div>
    );
}