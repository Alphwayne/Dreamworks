export default function Loading() {
    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 30%,#f0f7ff 60%,#eff0ff 100%)" }}>
            {/* Header skeleton */}
            <div className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100" />

            {/* Hero skeleton */}
            <div className="px-4 pt-4">
                <div className="h-[520px] lg:h-[580px] rounded-[20px] lg:rounded-[30px] bg-gray-200 animate-pulse" />
            </div>

            {/* Category strip skeleton */}
            <div className="px-4 max-w-7xl mx-auto mt-10">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-[130px]">
                            <div className="h-[100px] rounded-2xl bg-gray-200 animate-pulse mb-2" />
                            <div className="h-3 w-20 mx-auto bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Products skeleton */}
            <div className="px-4 max-w-7xl mx-auto mt-10">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                            <div className="aspect-square bg-gray-100 animate-pulse" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                                <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse mt-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
