import type { BestPriceProps } from "./types"

export default function BestPrice({ value }: BestPriceProps)
{
    if (value === null) {
        return <span className="text-gray-400">—</span>;
    }

    return (
        <div>
            <span className='text-[#98EAF3] -ml-1'>{value} €</span>    
        </div>
        )
}