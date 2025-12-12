import { useState, useEffect, useRef } from "react";
import type { AutocompleteInputProps, Suggestion, SuggestionType } from "./types";
import AutocompleteList from "./AutocompleteList";

function AutocompleteInput({
    label,
    value,
    placeholder,
    onChange,
    onSelect,
    className,
    AutocompleteListClassname,
}: AutocompleteInputProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const API_BASE_ = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        if (!value) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const [sncfData, amadeusData] = await Promise.allSettled([
                    fetch(`${API_BASE_}/api/search/stations?q=${encodeURIComponent(value)}`).then((r) => r.json()),
                    fetch(`${API_BASE_}/api/search/airports?q=${encodeURIComponent(value)}`).then((r) => r.json()),
                ]);

                const sncfResults: Suggestion[] =
                    sncfData.status === "fulfilled" ? sncfData.value : [];
                const amadeusResults: Suggestion[] =
                    amadeusData.status === "fulfilled" ? amadeusData.value : [];

                const combined = [...sncfResults, ...amadeusResults];

                const seen = new Set<string>();
                const unique = combined.filter((v) => {
                    const key = `${v.name.toLowerCase()}|${v.name}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });

                const typeOrder: Record<SuggestionType, number> = {
                    city: 0,
                    stop_area: 1,
                    airport: 2,
                };

                const sorted = unique.sort((a, b) => {
                    const typeA = a.type ?? "city";
                    const typeB = b.type ?? "city";
                    return typeOrder[typeA] - typeOrder[typeB];
                });

                setSuggestions(sorted);
            } catch (err) {
                console.error(err);
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [value, API_BASE_]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedIndex(0);
    }, [suggestions]);

    const handleSelect = (s: Suggestion) => {
        onChange(s.name);
        onSelect(s);
        setIsFocused(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!suggestions || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        }

        if (e.key === "Enter") {
            e.preventDefault();
            handleSelect(suggestions[selectedIndex]);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full">
        <div        >
            {label && label.length > 0 && (
                <label className="block text-sm text-slate-400 mb-2">{label}</label>
            )}

            <input
                type="text"
                className={className}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete="off"
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
            />
            </div>

            <AutocompleteList
                suggestions={isFocused ? suggestions : []}
                selectedIndex={selectedIndex}
                onSelect={handleSelect}
                className={AutocompleteListClassname}
            />
        
        </div>
    );
}

export default AutocompleteInput;
