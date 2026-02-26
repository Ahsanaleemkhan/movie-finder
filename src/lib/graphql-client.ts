const GRAPHQL_ENDPOINT = "https://admin.ahsan-aleem.dev/graphql";

interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{ message: string }>;
}

// ─── In-memory cache for dev mode speed ──────────────
const cache = new Map<string, { data: unknown; timestamp: number }>();
const DEFAULT_TTL = 60_000; // 60 seconds in-memory cache

function getCacheKey(query: string, variables?: Record<string, unknown>): string {
    return JSON.stringify({ query: query.trim(), variables });
}

export async function fetchGraphQL<T>(
    query: string,
    variables?: Record<string, unknown>,
    revalidate?: number
): Promise<T> {
    const cacheKey = getCacheKey(query, variables);
    const ttl = revalidate ? revalidate * 1000 : DEFAULT_TTL;

    // Check in-memory cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data as T;
    }

    const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
        next: revalidate !== undefined ? { revalidate } : undefined,
    });

    if (!res.ok) {
        throw new Error(`GraphQL request failed: ${res.status}`);
    }

    const json: GraphQLResponse<T> = await res.json();

    if (json.errors) {
        console.error("GraphQL errors:", json.errors);
        throw new Error(json.errors[0].message);
    }

    // Store in cache
    cache.set(cacheKey, { data: json.data, timestamp: Date.now() });

    return json.data;
}
