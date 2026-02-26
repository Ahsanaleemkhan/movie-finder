"use client";

import { useRef, useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import type { Movie } from "@/lib/queries";

interface MovieRowProps {
    title: string;
    movies: Movie[];
    priority?: boolean;
}

export default function MovieRow({
    title,
    movies,
    priority = false,
}: MovieRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isVisible, setIsVisible] = useState(priority);
    const rowRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver for lazy rendering
    useEffect(() => {
        if (priority || isVisible) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );
        if (rowRef.current) observer.observe(rowRef.current);
        return () => observer.disconnect();
    }, [priority, isVisible]);

    const updateScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener("scroll", updateScrollButtons, { passive: true });
        return () => el.removeEventListener("scroll", updateScrollButtons);
    }, [isVisible]);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.75;
        el.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    if (!movies.length) return null;

    return (
        <section ref={rowRef} className="relative py-4 md:py-6" aria-label={title}>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 px-4 md:px-12">
                {title}
            </h2>

            {isVisible ? (
                <div className="group/row relative">
                    {/* Left scroll button */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-12
                         bg-gradient-to-r from-zinc-950/90 to-transparent
                         flex items-center justify-center
                         opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
                            aria-label="Scroll left"
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Scrollable row */}
                    <div
                        ref={scrollRef}
                        className="flex gap-2 md:gap-3 overflow-x-auto px-4 md:px-12
                       scroll-smooth snap-x snap-mandatory
                       scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {movies.map((movie, i) => (
                            <MovieCard
                                key={`${movie.slug}-${i}`}
                                movie={movie}
                                priority={priority && i < 6}
                                index={i}
                            />
                        ))}
                    </div>

                    {/* Right scroll button */}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12
                         bg-gradient-to-l from-zinc-950/90 to-transparent
                         flex items-center justify-center
                         opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
                            aria-label="Scroll right"
                        >
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            ) : (
                /* Skeleton placeholder before visible */
                <div className="flex gap-2 md:gap-3 px-4 md:px-12 overflow-hidden">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] 
                         aspect-[2/3] rounded-lg bg-zinc-800/50 animate-pulse"
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
