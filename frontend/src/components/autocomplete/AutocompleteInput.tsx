import { useState, useEffect, useRef } from 'react';
import type { AutocompleteInputProps, Suggestion } from './types';
import AutocompleteList from './AutocompleteList';

function AutocompleteInput({ label, value, placeholder, onChange, onSelect, className }: AutocompleteInputProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const base = `${import.meta.env.VITE_API_URL || "http://localhost:3005"}`;

    useEffect(() => {
        if (!value) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const sncfRes = await fetch(`${base}/api/search/stations?q=${value}`);
                const sncfData = await sncfRes.json();

                // Appel API Amadeus
                const amadeusRes = await fetch(`${base}/api/search/airports?q=${value}`);
                const amadeusData = await amadeusRes.json();

                // Combiner les deux résultats
                const combined = [...sncfData, ...amadeusData];

                // Supprimer les doublons (par exemple selon le name ou id)
                const unique = combined.filter(
                    (v, i, a) => a.findIndex(e => e.id === v.id) === i
                );

                setSuggestions(unique);
            } catch (err) {
                console.error(err);
                setSuggestions([]);
            }
    }, 300);

    return () => clearTimeout(timeout);
    }, [value]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            handleSelect(suggestions[selectedIndex]);
        }
    }

    return (
        <div ref={containerRef} className="autocomplete relative">
            {
            !label || label.length === 0 
            ? null 
            : <label className="block text-sm text-slate-400 mb-2">{label}</label>
            }
            
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

            {isFocused && suggestions.length > 0 && (
                <AutocompleteList suggestions={suggestions} selectedIndex={selectedIndex} onSelect={handleSelect} />
            )}
            
        </div>
    );
}

export default AutocompleteInput;