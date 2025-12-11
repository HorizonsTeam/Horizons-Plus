import React from "react";

type SquareActionBtnProps = {
    onClick?: () => void;
    disabled?: boolean;
    w?: string; // ex: "w-14", "w-16", "w-20"
    h?: string; // ex: "h-14", "h-16", "h-20"
    className?: string;
    ariaLabel?: string;
    children: React.ReactNode;
};

export default function SquareActionBtn({
    onClick,
    disabled = false,
    w = "w-14",
    h = "h-14",
    className = "",
    ariaLabel,
    children,
}: SquareActionBtnProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-label={ariaLabel}
            className={[
                // ✅ mêmes classes de base que ton bouton
                h,
                w,
                "rounded-xl shadow-sm flex items-center justify-center transition",
                // ✅ même logique disabled/hover
                disabled ? "bg-white/60 cursor-not-allowed" : "bg-white hover:brightness-95",
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
}
