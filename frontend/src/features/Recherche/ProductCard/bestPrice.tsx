import type { BestPriceProps } from "./types";

export default function BestPrice({ value }: BestPriceProps)
{
    return (
            <div>
                <span className='text-[#98EAF3] -ml-1'>{value} €</span>    
            </div>
        )

}