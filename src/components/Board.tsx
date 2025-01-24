'use client';
import Column from './Column';
import FormColumn from "./forms/FormColumn";
import { Board as BoardType, Card, Column as ColumnType } from '@/app/actions/boardActions';
import { useState } from 'react';

type BoardProps = {
    userId: string;
    boardId: string;
    board: BoardType;
    columns: ColumnType[];
    cards: Card[];
}

export default function Board({ userId, boardId, board, columns, cards } : BoardProps) {
    const [boardColumns, setBoardColumns] = useState<ColumnType[]>(columns);
    const [boardCards, setBoardCards] = useState<Card[]>(cards);

    return (
        <div className="flex gap-4">
            {boardColumns.map((column) => (
            <Column 
                key={column.id}
                userId={userId} 
                boardId={boardId} 
                column={column}
                cards={boardCards.filter((card) => card.columnId === column.id)}
                setCards={setBoardCards} // this allows each Column comp to update the parent state array
            />
            ))}

            <FormColumn board={board} onColumnCreated={(newCol) => {
                setBoardColumns([...boardColumns, newCol]);
            }} />
        </div>
    );
}