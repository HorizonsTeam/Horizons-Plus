// Floating inputs with Tailwind peer classes
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    containerClassName?: string;
};

function FloatingInput({ label, containerClassName = "", className = "", ...props }: Props) {
    return (
        <div className={`relative ${containerClassName}`}>
            <input
                {...props}
                placeholder=" "                        
                className={[
                    "peer h-19 w-full rounded-xl bg-[#103035] px-4 text-white outline-none",
                    "placeholder-transparent ring-1 ring-transparent",
                    "focus:ring-2 focus:ring-cyan-400",
                    className,
                ].join(" ")}

            />
            <label
                className={[
                    "pointer-events-none absolute left-4 top-1 -translate-y-1/2",
                    "text-gray-400 transition-all duration-150",
                    "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-cyan-300",
                    "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
                    "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs",
                ].join(" ")}

            >
                {label}
            </label>
        </div>
    );
}

export default function PaiementForm() {
    return (
        <div className="mt-3 w-full">
            <div className="grid gap-3">
                <FloatingInput
                    label="Numéro de carte"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                />
                <FloatingInput
                    label="Propriétaire de la carte"
                    type="text"
                    autoComplete="cc-name"
                />
            </div>

            <div className="mt-3 flex w-full items-center gap-4">
                <FloatingInput
                    label="Date d’expiration"
                    type="text"
                    autoComplete="cc-exp"
                    className="w-full"
                />
                <FloatingInput
                    label="CVV"
                    type="text"
                    autoComplete="cc-csc"
                    className="w-28"
                />
            </div>
        </div>
    );
}
