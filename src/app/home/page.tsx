'use client';

import ProtectedRoute from "@/components/ProtectedRoute"
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { fetchBoards } from "../actions/boardActions";
import Options from "@/components/options/Options";
import { deleteBoard } from "../actions/boardActions";
import Loading from "@/components/views/Loading";
import Header from "@/components/Header";



export default function HomePage() {
    const { user } = useAuth();
    const [boards, setBoards] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (user) {
            fetchBoards(user.uid)
                .then((fetchedBoards) => {
                    setBoards(fetchedBoards);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching boards:", error);
                    setLoading(false);
                });
        }
    }, [user]);

    async function handleDelete(boardId: string) {
        if (!user?.uid) return;

        try {
            await deleteBoard(user.uid, boardId);
            setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
        } catch (error) {
            console.error("Error deleting board:", error);
            alert("Failed to delete board. Please try again.");
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <ProtectedRoute>
            <div className="p-3">
                <h1 className="text-4xl mb-4">My Boards</h1>
                <hr className="mb-4 w-[90vw]" />

                {boards.length === 0 && (
                    <h1 className="text-xl text-gray-500">
                        You have no boards. <br/>Click the create button on the header to create a board.
                    </h1>
                    )}

                {/* <Link
                    className="btn-primary inline-block mb-6 px-4 py-2 rounded text-white hover:bg-blue-700 transition-colors"
                    href={'/create-board'}
                >
                    Create New Board &rarr;
                </Link> */}

                {/* Displaying users' boards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {boards.map((board) => (
                        <div
                            key={board.id}
                            className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
                        >
                            {/* Options Button */}
                            <div className="absolute top-1 right-2">
                                <Options
                                    boardId={board.id}
                                    onDelete={() => handleDelete(board.id)}
                                    onEdit={async () => {
                                        console.log("Editing board...");
                                        // to be implemented
                                    }}
                                />
                            </div>

                            {/* Board Name */}
                            <Link href={`/users/${user?.uid}/boards/${board.id}`} className="mt-2">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {board.name}
                                </h2>

                                {/* Underline */}
                                <div className="w-full h-1 bg-blue-300 mt-2 rounded"></div>

                                {/* Board Description */}
                                <p className="text-gray-600 mt-4 flex-1">
                                    {board.description || "No description provided."}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}