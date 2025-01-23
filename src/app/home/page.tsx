'use client';

import ProtectedRoute from "@/components/ProtectedRoute"
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { fetchBoards } from "../actions/boardActions";


export default function HomePage() {
    const { user } = useAuth();
    const [boards, setBoards] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetchBoards(user.uid).then(setBoards); // fetch boards for the logged in user then set the state to be those boards
        }
    }, [user]); 

    return(
        <ProtectedRoute>
        <div>
            <h1 className="text-4xl mb-4">My Boards</h1>
            <hr />

            <Link className="btn-primary inline-block" href={'/create-board'}>
                Create new Board &rarr;
            </Link>

            {/* Displaying users' boards */}
            <div className="mt-6 grid gap-4">
                {boards.map(board => (
                    <Link key={board.id} href={`boards/${board.id}`} className="block p-4 border rounded shadow hover:bg-gray-100">
                        {board.name}
                    </Link>
                ))}
            </div>
        </div>
        </ProtectedRoute>
    );
}