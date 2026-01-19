import type React from "react";
import { useEffect, useRef, useState, forwardRef } from "react";
import type { AutocompleteInputProps, Suggestion } from "./types";
import AutocompleteList from "./AutocompleteList";

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
    function AutocompleteInput(
        {
            label,
            value,
            placeholder,
            onChange,
            onSelect,
            className,
            AutocompleteListClassname,
            onFocus,
            onBlur,
            wrapperRef,
            OnCloseFocus, 
        },
        ref
    ) {
        const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
        const [isFocused, setIsFocused] = useState(false);
        const [selectedIndex, setSelectedIndex] = useState(0);

        const innerWrapperRef = useRef<HTMLDivElement | null>(null);
        const API_BASE_ = import.meta.env.VITE_API_URL || "";

        //  ref wrapper : interne + externe 
        const setWrapperRefs = (node: HTMLDivElement | null) => {
            innerWrapperRef.current = node;

            if (!wrapperRef) return;

            if (typeof wrapperRef === "function") wrapperRef(node);
            else (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        };

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

                    const sncfResults = sncfData.status === "fulfilled" ? sncfData.value : [];
                    const amadeusResults = amadeusData.status === "fulfilled" ? amadeusData.value : [];

                    setSuggestions([...sncfResults, ...amadeusResults]);
                    setSelectedIndex(0);
                } catch {
                    setSuggestions([]);
                }
            }, 300);

            return () => clearTimeout(timeout);
        }, [value, API_BASE_]);

        //  click outside 
        useEffect(() => {
            const onPointerDown = (e: PointerEvent) => {
                const wrapper = innerWrapperRef.current;
                if (!wrapper) return;

                if (!wrapper.contains(e.target as Node)) {
                    setIsFocused(false);
                }
            };

            document.addEventListener("pointerdown", onPointerDown, true);
            return () => document.removeEventListener("pointerdown", onPointerDown, true);
        }, []);
        const selectSuggestion = (suggestion: Suggestion) => {
            onSelect(suggestion);
            setIsFocused(false);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!suggestions.length) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
            }

            else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
            }

            else if (e.key === "Enter") {
                e.preventDefault();
                selectSuggestion(suggestions[selectedIndex]);
            }

            else if (e.key === "Escape") {
                e.preventDefault();

                setIsFocused(false);
            }
        };


        const handleFocusInternal = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlurInternal = (e: React.FocusEvent<HTMLInputElement>) => {
            onBlur?.(e);
            
        };

        return (
            <div ref={setWrapperRefs} className="relative w-full">
                {label && <label className="block text-sm text-slate-400 mb-2">{label}</label>}

                <input
                    ref={ref}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocusInternal}
                    onBlur={handleBlurInternal}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    className={className}
                    onMouseDownCapture={(e) => {
                        const el = e.currentTarget;
                        if (document.activeElement !== el) {
                            e.preventDefault(); 
                            el.focus();
                        }
                    }}
                />

                <AutocompleteList
                    suggestions={isFocused ? suggestions : []}
                    selectedIndex={selectedIndex}
                    onSelect={(s) => {
                        onChange(s.name);
                        selectSuggestion(s);
                    }}
                    className={AutocompleteListClassname}
                    OncloseFocus={ OnCloseFocus?? (() => setIsFocused(false)) }
                  
                />
            </div>
        );
    }
);

export default AutocompleteInput;
