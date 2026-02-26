import { fetchGraphQL } from "@/lib/graphql-client";
import { GET_ALL_MOVIES, type MoviesData, type Movie } from "@/lib/queries";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";

// ISR: Revalidate homepage every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  let movies: Movie[] = [];

  try {
    const data = await fetchGraphQL<MoviesData>(GET_ALL_MOVIES, undefined, 300);
    movies = data.movies.nodes;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }

  // If no movies returned, show a placeholder state
  if (!movies.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">No Movies Yet</h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            Movies will appear here once they are added to the database.
          </p>
        </div>
      </div>
    );
  }

  // Featured movie for hero section (first movie)
  const heroMovie = movies[0];

  // Create category rows from available movies
  // With limited data, we reuse movies across rows to show the Netflix layout
  const shuffle = (arr: Movie[]) => [...arr].sort(() => Math.random() - 0.5);

  const rows = [
    { title: "🔥 Trending Now", movies: movies.slice(0, 10) },
    { title: "⭐ Top Rated", movies: shuffle(movies).slice(0, 10) },
    { title: "🆕 New Releases", movies: [...movies].reverse().slice(0, 10) },
    { title: "🎬 Action & Thriller", movies: shuffle(movies).slice(0, 10) },
    { title: "🍿 Popular on MovieFinder", movies: shuffle(movies).slice(0, 10) },
  ];

  // JSON-LD structured data for the homepage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MovieFinder",
    url: "/",
    description: "Discover and explore the latest movies with MovieFinder.",
    potentialAction: {
      "@type": "SearchAction",
      target: "/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <HeroSection movie={heroMovie} />

      {/* Movie Rows */}
      <div className="-mt-16 relative z-10 pb-8">
        {rows.map((row, index) => (
          <MovieRow
            key={row.title}
            title={row.title}
            movies={row.movies}
            priority={index < 2}
          />
        ))}
      </div>
    </>
  );
}
