import { useState } from "react";

export default function CarteSelect() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const options = [
        "Carte Avantage Jeune",
        "Carte Avantage Adulte",
        "Carte Avantage Senior",
        "Carte Week-end",
        "Carte Famille",
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-full  h-10 bg-[#103035] border-2 border-[#2C474B] rounded-md  text-white px-3 flex justify-between items-center"
            >
                {value || "Sélectionner une carte"}
                <span>▼</span>
            </button>

            {open && (
                <div className="absolute mt-1 w-full bg-[#103035] border border-[#2C474B] rounded-md z-50">
                    {options.map(opt => (
                        <div
                            key={opt}
                            onClick={() => { setValue(opt); setOpen(false); }}
                            className="px-2 py-2 text-xs text-white hover:bg-[#1b4a50] cursor-pointer"
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
