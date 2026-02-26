"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import type { Movie } from "@/lib/queries";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setMovies([]);
            setSearched(false);
            return;
        }

        const controller = new AbortController();

        async function search() {
            setLoading(true);
            setSearched(true);
            try {
                const res = await fetch("https://admin.ahsan-aleem.dev/graphql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: `
              query SearchMovies($search: String!) {
                movies(first: 20, where: { search: $search }) {
                  nodes {
                    databaseId slug title uri date content
                    featuredImage {
                      node { mediaItemUrl altText mediaDetails { width height } }
                    }
                    movieFields {
                      posterImage {
                        node { mediaItemUrl altText mediaDetails { width height } }
                      }
                      backgroundheroImage {
                        node { mediaItemUrl altText mediaDetails { width height } }
                      }
                      shortDescription
                      fullDescription
                      releaseYear
                      duration
                      rating
                      cast
                      trailerUrl
                    }
                  }
                }
              }
            `,
                        variables: { search: query },
                    }),
                    signal: controller.signal,
                });

                const json = await res.json();
                setMovies(json.data?.movies?.nodes || []);
            } catch (e) {
                if (e instanceof Error && e.name !== "AbortError") {
                    console.error("Search error:", e);
                }
            } finally {
                setLoading(false);
            }
        }

        search();
        return () => controller.abort();
    }, [query]);

    return (
        <div className="min-h-[50vh]">
            {/* Search query indicator */}
            {query && (
                <p className="text-zinc-400 mb-6">
                    {loading
                        ? "Searching..."
                        : `${movies.length} result${movies.length !== 1 ? "s" : ""} for `}
                    {!loading && (
                        <span className="text-white font-semibold">&ldquo;{query}&rdquo;</span>
                    )}
                </p>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] rounded-lg bg-zinc-800/50 animate-pulse" />
                    ))}
                </div>
            )}

            {/* Results grid */}
            {!loading && movies.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.slug} movie={movie} />
                    ))}
                </div>
            )}

            {/* No results */}
            {!loading && searched && movies.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-800/50 flex items-center justify-center">
                        <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
                    <p className="text-zinc-400 max-w-md mx-auto">
                        Try a different search term or browse our collection from the homepage.
                    </p>
                </div>
            )}

            {/* Initial state (no search yet) */}
            {!loading && !searched && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-800/30 flex items-center justify-center">
                        <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Search Movies</h3>
                    <p className="text-zinc-400 max-w-md mx-auto">
                        Start typing to discover movies from our collection.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="pt-24 md:pt-28 px-4 md:px-12 pb-16 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Search</h1>
                <Suspense fallback={null}>
                    <SearchBar />
                </Suspense>
            </div>

            <Suspense
                fallback={
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 min-h-[50vh]">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-[2/3] rounded-lg bg-zinc-800/50 animate-pulse" />
                        ))}
                    </div>
                }
            >
                <SearchResults />
            </Suspense>
        </div>
    );
}
