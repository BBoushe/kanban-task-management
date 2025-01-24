// this is the client part of the dynamic boardId page which is supposed to render on client
'use client';

// Object imports
import { useEffect, useState } from 'react';
import { getBoard } from '@/app/actions/boardActions';
import { Board as BoardType } from '@/app/actions/boardActions';
// Component imports
import Loading from '@/components/Loading';
import Board from '../Board';

type BoardClientProps = {
    userId: string,
    boardId: string,
};

export default function BoardClient({ userId, boardId } : BoardClientProps) {
    const [board, setBoard] = useState<BoardType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBoard() {
            try {
                const boardData = await getBoard(userId, boardId);
                setBoard(boardData);
            } catch (err) {
                console.error("Failed to fetch board: ", err);
                setError("Board not found, or failed to fetch");
            } finally {
                setLoading(false);
            }
        }

        fetchBoard();
    }, [userId, boardId]);

    if(loading) return <Loading/>;

    if(error) return <p>{error}</p>;

    if(!board) return <p className='centered'>Board not found</p>;

    return (
        <div>
            <h1 className="text-4xl mb-4">{board.name}</h1>
            <p className="text-gray-600">{board.description}</p>
            <hr />
            <p className="text-sm text-gray-500">
                Created on: {new Date(board.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
            <Board/>
        </div>
    );

}