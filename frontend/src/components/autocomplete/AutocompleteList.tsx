import type { AutocompleteListProps } from './types';
import { useRef, useEffect } from 'react';
import trainIcon from '../../assets/train-station (blue).png';
import cityIcon from '../../assets/house-building (blue).png';
import airportIcon from '../../assets/airport.png';
import type { SuggestionType } from './types';


function AutocompleteList({ suggestions, selectedIndex, onSelect }: AutocompleteListProps) {
    useEffect(() => {
        const ref = itemsRef.current[selectedIndex];
        if (ref) {
            ref.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedIndex]);

    const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

    if (!suggestions || suggestions.length === 0) return null;
    
    const icons = {
        city: cityIcon,
        stop_area: trainIcon,
        airport: airportIcon,
    };

    const labels: Record<SuggestionType, string> = {
        city: "Ville",
        stop_area: "Gare",
        airport: "Aéroport",
    };

    return (
        <ul 
            className="absolute autocomplete-suggestions left-0 right-0 z-50 mt-2 rounded-xl bg-[#0f2628] border border-[#1b3a3d] shadow-xl 
                backdrop-blur-md max-h-72 overflow-y-auto text-left divide-y divide-[#1e3c3f] overflow-x-hidden"
            ref={(el) => { itemsRef.current = el ? Array.from(el.children) as (HTMLLIElement | null)[] : []; }}>
            {suggestions.map((s, i) => (
                <li
                    key={s.id}
                    onClick={() => onSelect(s)}
                    className={`
                            flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150
                            hover:bg-[#1b3a3d] hover:scale-[1.02] active:scale-[0.99]
                            ${i === selectedIndex ? "bg-[#1b3a3d] scale-[1.02]" : ""}
                        `}
                    >
                    <img
                        className="w-5 h-5 opacity-80 flex-shrink-0"
                        src={icons[s.type ?? "city"]}
                        alt=""
                    />

                    <div className="overflow-hidden">
                        <div className="text-[0.7rem] font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                        {labels[s.type ?? "city"]}
                        </div>

                        <div className="flex items-center gap-2">
                        <span
                            className="text-sm font-medium text-white truncate max-w-[220px]"
                            title={s.name}
                        >
                            {s.name}
                        </span>
                        {s.region && (
                            <span
                                className="text-sm font-medium text-primary truncate max-w-[200px]"
                                title={s.region}
                            >
                                ({s.region})
                            </span>
                        )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default AutocompleteList;