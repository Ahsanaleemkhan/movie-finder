export default function SearchLoading() {
    return (
        <div className="pt-24 md:pt-28 px-4 md:px-12 pb-16 min-h-screen animate-pulse">
            <div className="mb-8">
                <div className="h-8 w-32 bg-zinc-800 rounded-lg mb-6" />
                <div className="h-12 w-full max-w-xl bg-zinc-800 rounded-xl" />
            </div>
            <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-800/30" />
                <div className="h-6 w-40 mx-auto bg-zinc-800 rounded mb-2" />
                <div className="h-4 w-64 mx-auto bg-zinc-800/60 rounded" />
            </div>
        </div>
    );
}
