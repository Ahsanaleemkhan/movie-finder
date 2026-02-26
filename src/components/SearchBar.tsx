"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const handleSearch = useCallback(
        (value: string) => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                if (value.trim()) {
                    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
                } else {
                    router.push("/search");
                }
            }, 300);
        },
        [router]
    );

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative group">
                <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 
                     group-focus-within:text-red-500 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    placeholder="Search movies..."
                    className="w-full pl-12 pr-4 py-3 md:py-4
                     bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50
                     rounded-xl text-white placeholder-zinc-400
                     text-base md:text-lg
                     focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
                     transition-all duration-200"
                    aria-label="Search movies"
                    autoComplete="off"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            handleSearch("");
                            inputRef.current?.focus();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1
                       text-zinc-400 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
