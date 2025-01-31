export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center h-screen bg-gray-100 z-50">
            <div className="flex flex-col items-center">
                {/* SVG Spinner */}
                <img src="/4.svg" alt="Loading..." className="h-16 w-16"/>
                <span className="mt-1 text-gray-700">Loading...</span>
            </div>
        </div>
    );
}