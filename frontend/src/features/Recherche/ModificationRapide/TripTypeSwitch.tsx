import type { SetStateAction } from "react";
import type { Dispatch } from "react";
import type { StopType } from "../Filtres/FiltresBloc.tsx";

type Props<T extends string> = {
    value: T;
    onChange: (v: T) => void | Dispatch<SetStateAction<StopType>>;

    a: T;              
    b: T;              

    label?: string;   
    className?: string;
};

export default function TripTypeSwitch<T extends string>({
    value,
    onChange,
    a,
    b,
    className = "",
}: Props<T>) {
    const isB = value === b;

    const toggle = () => {
        onChange(isB ? a : b);
    };

    return (
        <div className="grid gap-2">
            
            
            <div className={["flex items-center gap-2", className].join(" ")}>
                <div className="ml-2 text-white font-light text-sm opacity-50"> {"( "}{isB ? b : a}  {" )"}</div>

                <button
                    type="button"
                    role="switch"
                    aria-checked={isB}
                    onClick={toggle}
                    className={[
                        "relative inline-flex items-center",
                        "h-7 w-12 rounded-full",
                        "transition-colors duration-200 ease-in-out",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                        isB ? "bg-[#98EAF3]" : "bg-white/15 ring-1 ring-white/10",
                    ].join(" ")}
                >
                    <span
                        className={[
                            "absolute left-0.5",
                            "h-6 w-6 rounded-full bg-white",
                            "shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
                            "transition-transform duration-200 ease-in-out",
                            isB ? "translate-x-5" : "translate-x-0",
                        ].join(" ")}
                    />
                </button>


            </div>
        </div>
    );
}
