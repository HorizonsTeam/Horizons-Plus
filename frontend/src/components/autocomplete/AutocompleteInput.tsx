import { useState, useEffect, useRef } from 'react';
import type { AutocompleteInputProps, Suggestion } from './types';
import AutocompleteList from './AutocompleteList';

function AutocompleteInput({ label, value, placeholder, onChange }: AutocompleteInputProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!value) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(() => {
            fetch(`http://localhost:3005/api/search/stations?q=${value}`)
            .then(res => res.json())
            .then(data => setSuggestions(data))
            .catch(() => setSuggestions([]));
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

    const handleSelect = (s: Suggestion) => {
        onChange(s.name);
        setIsFocused(false);
    };

    return (
    <div ref={containerRef} className="autocomplete relative">
        {
        !label || label.length === 0 
        ? null 
        : <label className="block text-sm text-gray-400 mb-2">{label}</label>
        }
        
        <input
        type="text"
        className="search-input w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        />

        {isFocused && suggestions.length > 0 && (
            <AutocompleteList suggestions={suggestions} onSelect={handleSelect} />
        )}
        
    </div>
);
}

export default AutocompleteInput;