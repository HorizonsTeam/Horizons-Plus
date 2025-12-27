import { useState, useEffect, useRef } from 'react';
import { UserRound, ChevronDown } from 'lucide-react';

type PassengerSelectProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function PassengerSelect({ value, onChange }: PassengerSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const passengers = [1, 2, 3, 4];

  // Ferme le dropdown si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-36">
      {/* Bouton principal */}
      <div
        className="flex items-center justify-between gap-2 bg-[ #243C40] rounded-xl px-4 py-3 cursor-pointer shadow-sm hover:bg-[#2b4a4f] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <UserRound className="w-5 h-5 text-cyan-300 shrink-0" />
        <span className="text-white ">{`x${value}`}</span>
        <ChevronDown
          className={`w-4 h-4 text-cyan-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown options */}
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-[#2C474B] rounded-xl shadow-lg overflow-hidden">
          {passengers.map((p) => (
            <li
              key={p}
              className="px-5 py-3 text-white hover:bg-cyan-500 hover:text-[#243C40] cursor-pointer transition-colors"
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
            >
              {`x${p}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
