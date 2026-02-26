export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Hero skeleton */}
            <div className="relative w-full h-[70vh] md:h-[80vh] bg-zinc-900 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                    <div className="px-4 md:px-12 max-w-2xl space-y-4">
                        <div className="h-6 w-24 bg-zinc-800 rounded-full" />
                        <div className="h-12 w-96 max-w-full bg-zinc-800 rounded-lg" />
                        <div className="h-4 w-80 max-w-full bg-zinc-800/60 rounded" />
                        <div className="h-4 w-64 max-w-full bg-zinc-800/60 rounded" />
                        <div className="flex gap-3 pt-2">
                            <div className="h-12 w-36 bg-zinc-800 rounded-lg" />
                            <div className="h-12 w-28 bg-zinc-800/60 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Movie rows skeleton */}
            <div className="-mt-16 relative z-10 pb-8 space-y-8">
                {Array.from({ length: 3 }).map((_, row) => (
                    <div key={row} className="py-4 md:py-6">
                        <div className="h-7 w-48 bg-zinc-800 rounded mb-4 mx-4 md:mx-12" />
                        <div className="flex gap-2 md:gap-3 px-4 md:px-12 overflow-hidden">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]
                                     aspect-[2/3] rounded-lg bg-zinc-800/50 animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
