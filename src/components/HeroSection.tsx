import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/lib/queries";
import { getBackgroundUrl, getBackgroundAlt, getDescription } from "@/lib/queries";

interface HeroSectionProps {
    movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
    const bgUrl = getBackgroundUrl(movie);
    const altText = getBackgroundAlt(movie);
    const year = movie.movieFields?.releaseYear
        ? new Date(movie.movieFields.releaseYear).getFullYear()
        : movie.date
            ? new Date(movie.date).getFullYear()
            : null;
    const description = getDescription(movie);
    const rating = movie.movieFields?.rating;
    const duration = movie.movieFields?.duration;

    return (
        <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden" aria-label="Featured movie">
            {/* Background image */}
            {bgUrl ? (
                <Image
                    src={bgUrl}
                    alt={altText}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                    quality={80}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-zinc-950 to-zinc-900" />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
                <div className="px-4 md:px-12 max-w-2xl">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                           bg-red-600 text-white uppercase tracking-wider">
                            Featured
                        </span>
                        {year && (
                            <span className="text-zinc-400 text-sm font-medium">{year}</span>
                        )}
                        {rating && (
                            <span className="text-yellow-400 text-sm font-medium">⭐ {rating}</span>
                        )}
                        {duration && (
                            <span className="text-zinc-400 text-sm font-medium">⏱ {duration}</span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4
                         leading-tight tracking-tight drop-shadow-2xl">
                        {movie.title}
                    </h1>

                    {/* Description */}
                    <p className="text-sm md:text-base lg:text-lg text-zinc-300 mb-6 md:mb-8
                        line-clamp-3 leading-relaxed max-w-lg">
                        {description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/movie/${movie.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5
                         bg-white text-zinc-900 rounded-lg
                         font-bold text-sm md:text-base
                         hover:bg-zinc-200 active:bg-zinc-300
                         transition-colors duration-200
                         shadow-lg shadow-white/10"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            View Details
                        </Link>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5
                         bg-zinc-700/70 text-white rounded-lg
                         font-semibold text-sm md:text-base
                         hover:bg-zinc-600/70 active:bg-zinc-500/70
                         transition-colors duration-200 backdrop-blur-sm
                         border border-zinc-600/30"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
