// ─── Types ────────────────────────────────────────────

export interface AcfImageNode {
  mediaItemUrl: string;
  altText: string;
  mediaDetails: { width: number; height: number };
}

export interface AcfImage {
  node: AcfImageNode;
}

export interface MovieAcfFields {
  posterImage: AcfImage | null;
  backgroundheroImage: AcfImage | null;
  shortDescription: string | null;
  fullDescription: string | null;
  releaseYear: string | null;
  duration: string | null;
  rating: string | null;
  cast: string | null;
  trailerUrl: string | null;
}

export interface Movie {
  databaseId: number;
  slug: string;
  title: string;
  uri: string;
  date: string;
  content: string | null;
  featuredImage: {
    node: {
      mediaItemUrl: string;
      altText: string;
      mediaDetails: { width: number; height: number };
    };
  } | null;
  movieFields: MovieAcfFields | null;
}

export interface MoviesData {
  movies: { nodes: Movie[] };
}

export interface MovieBySlugData {
  movieBy: Movie | null;
}

// ─── ACF Fragment ─────────────────────────────────────
const MOVIE_ACF_FIELDS = `
    movieFields {
        posterImage {
            node {
                mediaItemUrl
                altText
                mediaDetails { width height }
            }
        }
        backgroundheroImage {
            node {
                mediaItemUrl
                altText
                mediaDetails { width height }
            }
        }
        shortDescription
        fullDescription
        releaseYear
        duration
        rating
        cast
        trailerUrl
    }
`;

// ─── Queries ──────────────────────────────────────────

export const GET_ALL_MOVIES = `
  query GetAllMovies {
    movies(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        slug
        title
        uri
        date
        content
        featuredImage {
          node {
            mediaItemUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        ${MOVIE_ACF_FIELDS}
      }
    }
  }
`;

export const GET_MOVIE_BY_SLUG = `
  query GetMovieBySlug($slug: String!) {
    movieBy(slug: $slug) {
      databaseId
      slug
      title
      uri
      date
      content
      featuredImage {
        node {
          mediaItemUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      ${MOVIE_ACF_FIELDS}
    }
  }
`;

export const GET_ALL_SLUGS = `
  query GetAllSlugs {
    movies(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

export const SEARCH_MOVIES = `
  query SearchMovies($search: String!) {
    movies(first: 20, where: { search: $search }) {
      nodes {
        databaseId
        slug
        title
        uri
        date
        content
        featuredImage {
          node {
            mediaItemUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        ${MOVIE_ACF_FIELDS}
      }
    }
  }
`;

// ─── Helper: get poster URL (ACF → featuredImage fallback) ──
export function getPosterUrl(movie: Movie): string | undefined {
  return (
    movie.movieFields?.posterImage?.node?.mediaItemUrl ??
    movie.featuredImage?.node?.mediaItemUrl ??
    undefined
  );
}

export function getPosterAlt(movie: Movie): string {
  return (
    movie.movieFields?.posterImage?.node?.altText ||
    movie.featuredImage?.node?.altText ||
    movie.title ||
    "Movie poster"
  );
}

export function getBackgroundUrl(movie: Movie): string | undefined {
  return (
    movie.movieFields?.backgroundheroImage?.node?.mediaItemUrl ??
    movie.movieFields?.posterImage?.node?.mediaItemUrl ??
    movie.featuredImage?.node?.mediaItemUrl ??
    undefined
  );
}

export function getBackgroundAlt(movie: Movie): string {
  return (
    movie.movieFields?.backgroundheroImage?.node?.altText ||
    movie.movieFields?.posterImage?.node?.altText ||
    movie.featuredImage?.node?.altText ||
    movie.title ||
    "Movie background"
  );
}

export function getDescription(movie: Movie): string {
  return (
    movie.movieFields?.shortDescription ||
    (movie.content ? movie.content.replace(/<[^>]*>/g, "").slice(0, 200) : "") ||
    "Discover this amazing movie and explore the full collection."
  );
}
