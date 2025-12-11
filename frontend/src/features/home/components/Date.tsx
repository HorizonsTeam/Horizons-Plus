import { useMemo, useRef, useId } from "react";

type DateTileProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    min?: string;
    disabled?: boolean;
};

export function DateBtn({ label, value, onChange, min, disabled }: DateTileProps) {
    const id = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { day, month } = useMemo(() => {
        if (!value || value.length < 10) return { day: "--", month: "" };
        const d = new Date(value + "T00:00:00");
        const dayFmt = new Intl.DateTimeFormat("fr-FR", { day: "2-digit" }).format(d);
        // "sept." selon navigateurs -> on nettoie le point pour coller à ton visuel
        const monthFmt = new Intl.DateTimeFormat("fr-FR", { month: "short" })
            .format(d)
            .replace(".", "")
            .toLowerCase();

        return { day: dayFmt, month: monthFmt };
    }, [value]);

    const openPicker = () => {
        const el = inputRef.current;
        if (!el || disabled) return;

        // Chrome/Edge
        // @ts-ignore
        if (typeof el.showPicker === "function") {
            // @ts-ignore
            el.showPicker();
            return;
        }

        // Fallback
        el.focus();
        el.click();
    };

    return (
        <div className="flex flex-col  h-full">
            {label ? (
                <label htmlFor={id} className="block font-semibold text-[10px] mb-2 ml-1 text-slate-400">
                    {label}
                </label>
            ) : null}

            {/* Visuel custom */}
            <button
                type="button"
                onClick={openPicker}
                disabled={disabled}
                className={[
                    "relative w-24 h-24 rounded-xl shadow",
                    "flex flex-col items-center justify-center leading-none",
                    "transition",
                    disabled ? "bg-white/70 cursor-not-allowed" : "bg-white hover:brightness-95",
                ].join(" ")}
                aria-label={label ?? "Choisir une date"}
            >
                <span className="text-2xl font-semibold text-slate-900">{day}</span>
                <span className="text-sm font-medium text-slate-500 capitalize">
                    {month}
                </span>

                <input
                    id={id}
                    ref={inputRef}
                    type="date"
                    value={value}
                    min={min}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                    className=" opacity-0 cursor-pointer absolute top-0 left-0 "
                />
            </button>
        </div>
    );
}
