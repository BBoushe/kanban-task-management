'use client';

import ProtectedRoute from "@/components/ProtectedRoute"
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { fetchBoards } from "../actions/boardActions";
import Options from "@/components/options/Options";
import { deleteBoard } from "../actions/boardActions";


export default function HomePage() {
    const { user } = useAuth();
    const [boards, setBoards] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetchBoards(user.uid).then(setBoards); // fetch boards for the logged in user then set the state to be those boards
        }
    }, [user]);

    async function handleDelete(boardId: string) {
        if(!user?.uid) return;

        await deleteBoard(user?.uid, boardId);
        setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId)); // update real time on delete
    }

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
                    <div key={board.id} className="flex items-center">
                        <div className="flex p-4 border rounded shadow hover:bg-gray-10">
                        <Link key={board.id} href={`/users/${user?.uid}/boards/${board.id}`}>
                            {board.name}
                        </Link>
 
                        <Options boardId={board.id} 
                                onDelete={() =>handleDelete(board.id)} 
                                onEdit={async () => {
                                    console.log("Editing board...");
                                    // Add edit logic here, change 
                                    }}/>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
        </ProtectedRoute>
    );
}