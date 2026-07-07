export default function CollectionLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="h-16 bg-white border-b border-gray-100" />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="h-8 w-56 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(12)].map((_, i) => (
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
