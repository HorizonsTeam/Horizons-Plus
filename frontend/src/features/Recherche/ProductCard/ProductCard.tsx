import ClockIco from '../../../assets/clock.svg';
import type { ProductCardProps } from './types.ts';
import { Link } from 'react-router-dom';

export default function ProductCard({ journey, passagersCount, formattedDepartureDate }: ProductCardProps) {

    const hasNoTransfer = journey.numberOfTransfers === 0;
    
    return (
        <Link to="/Recap" className="block" state={{ journey, passagersCount, formattedDepartureDate }}>
            <article className="mt-4 rounded-3xl bg-[#0C2529] border border-[#2C474B] px-4 py-3 sm:px-5 sm:py-4 text-white mx-2 cursor-pointer">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-stretch sm:justify-between">
                    <div className="flex flex-1 gap-8 min-w-0">
                        <div className='flex flex-col gap-4 min-w-0'>
                            <p className='text-xl font-bold'>Ter </p>
                            <span className="text-lg sm:text-xl font-semibold">
                                {journey.departureTime}
                            </span>
                            <span className="text-lg sm:text-xl font-semibold">
                                {journey.arrivalTime}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 min-w-0">
                            <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm opacity-80">
                                <img src={ClockIco} alt="" className="h-4 w-4" />
                                <span>{journey.duration}</span>
                            </div>
                            <div className="flex items-baseline gap-2 min-w-0">
                                
                                <span className="text-xl sm:text-sm truncate opacity-90">
                                    {journey.departureName}
                                </span>
                            </div>

                            <div className="ml-1.5 h-5 border-l border-dashed border-[#4C6A6F]" />

                            <div className="flex items-baseline gap-2 min-w-0">
                                
                                <span className="text-xl sm:text-sm truncate opacity-90">
                                    {journey.arrivalName}
                                </span>
                            </div>

                           
                        </div>
                   

                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
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

                        <span className="text-xl sm:text-2xl font-extrabold">
                            {Number((journey.price * passagersCount).toFixed(2))} €
                        </span>

                        <span className="text-[11px] sm:text-xs text-emerald-300">
                            Il reste 5 places
                        </span>

                        <button
                            type="button"
                            className="mt-1 rounded-full bg-[#FFB856] px-4 py-1 text-[11px] sm:text-xs font-semibold text-[#103035]"
                        >
                            Voir le détail
                        </button>
                    </div>
                </div>
                </div>
            </article>
        </Link>
    );
}
