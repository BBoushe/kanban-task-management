export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center">
                {/* SVG Spinner */}
                <img src="/4.svg" alt="Loading..." className="h-16 w-16"/>
            </div>
        </div>
    );
}