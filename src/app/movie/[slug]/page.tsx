import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchGraphQL } from "@/lib/graphql-client";
import {
    GET_MOVIE_BY_SLUG,
    GET_ALL_SLUGS,
    type MovieBySlugData,
    type Movie,
    getPosterUrl,
    getPosterAlt,
    getBackgroundUrl,
    getBackgroundAlt,
} from "@/lib/queries";

// ISR: Revalidate movie pages every hour
export const revalidate = 3600;

// Pre-generate all movie pages at build time
export async function generateStaticParams() {
    try {
        const data = await fetchGraphQL<{ movies: { nodes: { slug: string }[] } }>(
            GET_ALL_SLUGS
        );
        return data.movies.nodes.map((movie) => ({ slug: movie.slug }));
    } catch {
        return [];
    }
}

// Dynamic metadata per movie
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    try {
        const data = await fetchGraphQL<MovieBySlugData>(GET_MOVIE_BY_SLUG, {
            slug,
        });
        const movie = data.movieBy;
        if (!movie) return { title: "Movie Not Found" };

        const rawDescription =
            movie.movieFields?.shortDescription ||
            (movie.content ? movie.content.replace(/<[^>]*>/g, "").slice(0, 155) : null);
        const description =
            rawDescription || `Watch ${movie.title} — Discover details, trailers, and more on MovieFinder.`;
        const ogImage = getPosterUrl(movie);

        return {
            title: movie.title,
            description,
            openGraph: {
                title: movie.title,
                description,
                type: "video.movie",
                images: ogImage ? [{ url: ogImage }] : undefined,
            },
            twitter: {
                card: "summary_large_image",
                title: movie.title,
                description,
            },
        };
    } catch {
        return { title: "Movie Not Found" };
    }
}

export default async function MoviePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    let movie: Movie | null = null;

    try {
        const data = await fetchGraphQL<MovieBySlugData>(
            GET_MOVIE_BY_SLUG,
            { slug },
            3600
        );
        movie = data.movieBy;
    } catch (error) {
        console.error("Failed to fetch movie:", error);
    }

    if (!movie) notFound();

    const posterUrl = getPosterUrl(movie);
    const posterAlt = getPosterAlt(movie);
    const bgUrl = getBackgroundUrl(movie);
    const bgAlt = getBackgroundAlt(movie);

    const acf = movie.movieFields;
    const year = acf?.releaseYear
        ? new Date(acf.releaseYear).getFullYear()
        : movie.date
            ? new Date(movie.date).getFullYear()
            : null;
    const description = acf?.fullDescription
        || acf?.shortDescription
        || (movie.content ? movie.content.replace(/<[^>]*>/g, "") : null);
    const rating = acf?.rating;
    const duration = acf?.duration;
    const cast = acf?.cast;
    const trailerUrl = acf?.trailerUrl;

    // JSON-LD Movie schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: movie.title,
        url: `/movie/${movie.slug}`,
        dateCreated: movie.date,
        description: description || `${movie.title} on MovieFinder`,
        image: posterUrl || undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="min-h-screen">
                {/* Hero / Backdrop */}
                <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
                    {bgUrl ? (
                        <Image
                            src={bgUrl}
                            alt={bgAlt}
                            fill
                            className="object-cover object-top"
                            priority
                            sizes="100vw"
                            quality={85}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-zinc-900 to-zinc-950" />
                    )}

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent" />

                    {/* Back button */}
                    <div className="absolute top-20 left-4 md:left-12 z-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2
                         bg-zinc-800/60 backdrop-blur-sm rounded-full
                         text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/60
                         transition-all duration-200 border border-zinc-700/30"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </Link>
                    </div>
                </div>

                {/* Movie Info */}
                <div className="relative -mt-40 z-10 px-4 md:px-12 pb-16">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
                        {/* Poster Card */}
                        <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
                                {posterUrl ? (
                                    <Image
                                        src={posterUrl}
                                        alt={posterAlt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 192px, 256px"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 pt-4 md:pt-8">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                                {movie.title}
                            </h1>

                            {/* Meta badges */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                {year && (
                                    <span className="px-3 py-1 rounded-full bg-zinc-800 text-sm font-medium text-zinc-300 border border-zinc-700/50">
                                        {year}
                                    </span>
                                )}
                                {rating && (
                                    <span className="px-3 py-1 rounded-full bg-yellow-600/20 text-sm font-medium text-yellow-400 border border-yellow-600/30">
                                        ⭐ {rating}
                                    </span>
                                )}
                                {duration && (
                                    <span className="px-3 py-1 rounded-full bg-zinc-800 text-sm font-medium text-zinc-300 border border-zinc-700/50">
                                        ⏱ {duration}
                                    </span>
                                )}
                                <span className="px-3 py-1 rounded-full bg-red-600/20 text-sm font-medium text-red-400 border border-red-600/30">
                                    HD
                                </span>
                            </div>

                            {/* Cast */}
                            {cast && (
                                <div className="mb-4">
                                    <span className="text-sm font-semibold text-zinc-400">Cast: </span>
                                    <span className="text-sm text-zinc-300">{cast}</span>
                                </div>
                            )}

                            {/* Description */}
                            {description ? (
                                <div className="prose prose-invert prose-zinc max-w-none mb-8">
                                    <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-base text-zinc-400 mb-8 leading-relaxed">
                                    Movie details and description will be available soon. Check back later for more information about this title.
                                </p>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-3">
                                {trailerUrl && (
                                    <a
                                        href={trailerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3
                                 bg-red-600 text-white rounded-lg font-bold text-sm
                                 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        Watch Trailer
                                    </a>
                                )}
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3
                             bg-white text-zinc-900 rounded-lg font-bold text-sm
                             hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Browse More
                                </Link>
                                <Link
                                    href="/search"
                                    className="inline-flex items-center gap-2 px-6 py-3
                             bg-zinc-800 text-white rounded-lg font-semibold text-sm
                             hover:bg-zinc-700 transition-colors border border-zinc-700/50"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Search Movies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
