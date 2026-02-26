import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/lib/queries";
import { getPosterUrl, getPosterAlt } from "@/lib/queries";

interface MovieCardProps {
    movie: Movie;
    priority?: boolean;
    index?: number;
}

export default function MovieCard({
    movie,
    priority = false,
    index = 0,
}: MovieCardProps) {
    const posterUrl = getPosterUrl(movie);
    const altText = getPosterAlt(movie);
    const year = movie.movieFields?.releaseYear
        ? new Date(movie.movieFields.releaseYear).getFullYear()
        : movie.date
            ? new Date(movie.date).getFullYear()
            : null;
    const rating = movie.movieFields?.rating;

    return (
        <Link
            href={`/movie/${movie.slug}`}
            className="group relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] rounded-lg overflow-hidden
                 transition-all duration-300 ease-out hover:scale-105 hover:z-10
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label={`View details for ${movie.title}`}
        >
            {/* Poster Image */}
            <div className="relative aspect-[2/3] bg-zinc-800 overflow-hidden">
                {posterUrl ? (
                    <Image
                        src={posterUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={priority}
                        loading={priority ? "eager" : "lazy"}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <div className="text-center p-3">
                            <svg
                                className="w-10 h-10 mx-auto mb-2 text-zinc-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                                />
                            </svg>
                            <span className="text-xs text-zinc-500 font-medium line-clamp-2">
                                {movie.title}
                            </span>
                        </div>
                    </div>
                )}

                {/* Gradient overlay on hover */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Info overlay on hover */}
                <div
                    className="absolute bottom-0 left-0 right-0 p-3
                      translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                      transition-all duration-300 ease-out"
                >
                    <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                        {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                        {year && <span>{year}</span>}
                        {rating && <span>⭐ {rating}</span>}
                    </div>
                </div>
            </div>

            {/* Title below card (always visible) */}
            <div className="p-2 bg-zinc-900/80">
                <h3 className="text-xs font-medium text-zinc-300 truncate group-hover:text-white transition-colors">
                    {movie.title}
                </h3>
                {year && <p className="text-[10px] text-zinc-500 mt-0.5">{year}</p>}
            </div>
        </Link>
    );
}
