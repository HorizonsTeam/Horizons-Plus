type TripType = "oneway" | "roundtrip";

type Props = {
    value: TripType;
    onChange: (v: TripType) => void;
    className?: string;
};

export default function TripTypeSwitch({
    value,
    onChange,
    className = "",
}: Props) {
    const isRoundtrip = value === "roundtrip";

    const toggle = () => {
        onChange(isRoundtrip ? "oneway" : "roundtrip");
    };

    return (
        <div className="grid grid-cols gap-4">
            <span className="text-[12px] text-white/80">
                Aller-retour{" "}
                <span className={isRoundtrip ? "text-white" : "text-white/50"}>
                    {isRoundtrip ? "(activé)" : "(désactivé)"}
                </span>
            </span>
            <div className={["flex  items-center gap-2", className].join(" ")}>

            <button
                type="button"
                role="switch"
                aria-checked={isRoundtrip}
                onClick={toggle}
                className={[
                    "relative inline-flex items-center",
                    "h-7 w-12 rounded-full",
                    "transition-colors duration-200 ease-in-out",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ml-2",
                    isRoundtrip
                        ? "bg-[#98EAF3]"
                        : "bg-white/15 ring-1 ring-white/10",
                ].join(" ")}
            >
                {/* knob */}
                <span
                    className={[
                        "absolute left-0.5",
                        "h-6 w-6 rounded-full bg-white",
                        "shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
                        "transition-transform duration-200 ease-in-out",
                        isRoundtrip ? "translate-x-5" : "translate-x-0",
                    ].join(" ")}
                />
            </button>

            
        </div>
        </div>
    );
}
