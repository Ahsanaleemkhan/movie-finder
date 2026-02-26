export default function MovieLoading() {
    return (
        <article className="min-h-screen animate-pulse">
            {/* Backdrop skeleton */}
            <div className="relative w-full h-[60vh] md:h-[75vh] bg-zinc-900">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent" />
            </div>

            {/* Content skeleton */}
            <div className="relative -mt-40 z-10 px-4 md:px-12 pb-16">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
                        <div className="aspect-[2/3] rounded-xl bg-zinc-800 ring-1 ring-white/10" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 pt-4 md:pt-8 space-y-4">
                        <div className="h-10 w-72 max-w-full bg-zinc-800 rounded-lg" />
                        <div className="flex gap-3">
                            <div className="h-8 w-20 bg-zinc-800 rounded-full" />
                            <div className="h-8 w-20 bg-zinc-800 rounded-full" />
                            <div className="h-8 w-16 bg-zinc-800 rounded-full" />
                        </div>
                        <div className="space-y-2 pt-4">
                            <div className="h-4 w-full bg-zinc-800/60 rounded" />
                            <div className="h-4 w-5/6 bg-zinc-800/60 rounded" />
                            <div className="h-4 w-4/6 bg-zinc-800/60 rounded" />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <div className="h-12 w-36 bg-zinc-800 rounded-lg" />
                            <div className="h-12 w-32 bg-zinc-800/60 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
