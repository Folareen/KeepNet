export default function SSRPageLoading() {
    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-4 text-lg text-gray-400">Loading...</p>
            </div>
        </div>
    );
}
