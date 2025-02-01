'use client'
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className=" bg-gray-100 flex flex-col justify-center items-center mx-auto">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-6 text-gray-800">Trello Clone</h1>
                <h2 className="text-2xl font-medium mb-10 text-gray-600">For MVP Masters' Projects</h2>
                <div className="flex space-x-6 justify-center mb-8">
                    <Link href="/login">
                        <button className="btn-primary text-lg px-8 py-4">Login</button>
                    </Link>
                    <Link href="/register">
                        <button className="btn-secondary text-lg px-8 py-4">Register</button>
                    </Link>
                </div>
                <div className="flex flex-col space-y-2">
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        GitHub Repository
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        LinkedIn Profile
                    </a>
                </div>
            </div>
        </div>
    );
}