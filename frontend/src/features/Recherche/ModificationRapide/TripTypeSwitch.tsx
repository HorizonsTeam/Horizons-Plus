type Props<T extends string> = {
    value: T;
    onChange: (value: T) => void;
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
    
}: Props<T>) {
    const isB = value === b;

    const toggle = () => {
        onChange(isB ? a : b);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="ml-2 text-white text-sm opacity-50">
                ({isB ? b : a})
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={isB}
                onClick={toggle}
                className={[
                    "relative inline-flex items-center cursor-pointer",
                    "h-7 w-12 rounded-full transition-colors",
                    isB ? "bg-[#98EAF3]" : "bg-white/15 ring-1 ring-white/10",
                ].join(" ")}
            >
                <span
                    className={[
                        "absolute left-0.5 h-6 w-6 rounded-full bg-white",
                        "transition-transform duration-200",
                        isB ? "translate-x-5" : "translate-x-0",
                    ].join(" ")}
                />
            </button>
        </div>
    );
}
