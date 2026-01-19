import ClockIco from '../../../assets/clock.svg';
import type { ProductCardProps } from './types.ts';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useIsMobile from '../../../components/layouts/UseIsMobile.tsx';


export default function ProductCard({ journey, passagersCount, formattedDepartureDate, index = 0 ,IsLoading }: ProductCardProps) {
    const hasNoTransfer = journey.numberOfTransfers === 0;
    const isMobile = useIsMobile();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.4,
                delay: index * 0.05, 
                ease: 'easeOut',
            }}
        >
            <Link to="/Recap" className="block" state={{ journey, passagersCount, formattedDepartureDate }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <article className={[
                    "mt-4 rounded-3xl border border-[#2C474B] text-white cursor-pointer relative overflow-hidden",
                    IsLoading ? "bg-[#2C474B] pointer-events-none" : "bg-[#0C2529]",
                    IsLoading
                        ? "after:content-[''] after:absolute after:inset-0 after:translate-x-[-100%] after:animate-[shimmer_1.2s_infinite]" +
                        " after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent"
                        : "",
                ].join(" ")}>
                <div className={` ${IsLoading && "opacity-0 " } `}>
                    <div className="flex   justify-between items-center px-6 py-4 border-b border-[#2C474B]">

                        <div className='flex flex-col gap-4 min-w-0'>
                            <p className=' font-bold'>Ter </p>
                            <span className="  font-semibold">
                                {journey.departureTime}
                            </span>
                            <span className="  font-semibold">
                                {journey.arrivalTime}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 min-w-0">
                            { isMobile &&
                            <div className="mt-2 mb-2 flex items-center gap-2 text-xs sm:text-sm opacity-80">
                                <img src={ClockIco} alt="" className="h-4 w-4" />
                                <span>{journey.duration}</span>
                            </div>}
                            { !isMobile &&
                                    <div
                                        className={`px-3 py-1 rounded-full text-[8px] sm:text-xs font-semibold mb-2 ${hasNoTransfer
                                            ? 'bg-[#98EAF3] text-[#103035]'
                                            : 'bg-[#FF6B6B] text-white'
                                            }`} 
                                    >
                                        {hasNoTransfer ? (
                                            <span>Direct</span>
                                        ) : (
                                            <span>
                                                {journey.numberOfTransfers} correspondance
                                                {journey.numberOfTransfers > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                            }
                            <div className="flex items-baseline gap-2 min-w-0">
                                
                                <span className=" truncate opacity-90">
                                    {journey.departureName}
                                </span>
                            </div>

                            <div className="ml-1.5 h-1 border-l border-dashed border-[#4C6A6F]" />

                            <div className="flex items-baseline gap-2 min-w-0">
                                
                                <span className=" truncate opacity-90">
                                    {journey.arrivalName}
                                </span>
                            </div>
                        </div>
                        {!isMobile && 
                                <div className="mt-2 mb-2 flex items-center gap-2   opacity-80">
                                    <span>{journey.duration}</span>
                                    <img src={ClockIco} alt="" className="h-10 w-10" />

                                </div>
                                }

                    <div className="flex flex-col items-end gap-2 min-w-[120px] ">
                        {  isMobile &&
                        <div
                            className={`px-3 py-1 rounded-full text-[8px] sm:text-xs font-semibold ${hasNoTransfer
                                    ? 'bg-[#98EAF3] text-[#103035]'
                                    : 'bg-[#FF6B6B] text-white'
                                }`}
                        >
                            {hasNoTransfer ? (
                                <span>Direct</span>
                            ) : (
                                <span>
                                    {journey.numberOfTransfers} correspondance
                                    {journey.numberOfTransfers > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                                }
                        <span className="sm:text-xl font-extrabold">
                            {(journey.price * passagersCount).toFixed(2)} €
                        </span>

                        <span className="text-[11px] sm:text-xs text-emerald-300">
                            Il reste 5 places
                        </span>

                        <button
                            type="button"
                            className="mt-1 rounded-full bg-[#FFB856] px-4 py-1 text-[11px] sm:text-xs font-semibold text-[#103035] cursor-pointer"
                        >
                            Voir le détail
                        </button>
                    </div>
                </div>
                </div>
            </article>
        </Link>
        </motion.div>
    );
}
