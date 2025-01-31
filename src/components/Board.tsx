import { ReactSortable } from 'react-sortablejs';
import Column from './Column';
import FormColumn from "./forms/FormColumn";
import { Board as BoardType, Card } from '@/app/actions/boardActions';
import { useState } from 'react';
import { updateColumn } from '@/app/actions/columnActions';
import { useAuth } from '@/app/contexts/AuthContext';
import { Column as ColumnType } from '@/app/actions/columnActions';
import { deleteColumn } from '@/app/actions/columnActions';
import { deleteCard } from '@/app/actions/cardActions';

type BoardProps = {
    boardId: string;
    board: BoardType;
    columns: ColumnType[];
    cards: Card[];
}

export default function Board({ boardId, columns, cards } : BoardProps) {
    const [boardColumns, setBoardColumns] = useState<ColumnType[]>(columns);
    const [boardCards, setBoardCards] = useState<Card[]>(cards);

    const { userId } = useAuth();

    async function handleDeleteColumn(columnId: string): Promise<void> {
        if (!userId) return;
    
        try {
            const columnToDelete = boardColumns.find(col => col.id === columnId);
            if (!columnToDelete) return;
    
            const cardsInColumn = boardCards.filter(card => card.columnId === columnId);
            await Promise.all(cardsInColumn.map(card => deleteCard(userId, boardId, card.id)));
    
            await deleteColumn(userId, boardId, columnToDelete.id);
    
            setBoardCards(prev => prev.filter(card => card.columnId !== columnId));
            setBoardColumns(prev => prev.filter(col => col.id !== columnId));
        } catch (error) {
            console.error("Error deleting column:", error);
            alert("Failed to delete column. Please try again.");
        }
    }

    return (
        <div className="flex flex-row gap-4 min-h-[83vh] h-full overflow-x-auto items-start">
            <ReactSortable
                list={boardColumns}
                setList={(sorted) => {
                    setBoardColumns(sorted);
                    sorted.forEach((col, index) => {
                        updateColumn(userId || "", boardId, col.id, { order: index });
                    })
                }}
                group="columns"
                className='flex flex-row gap-4 items-start'
            >
                {boardColumns.map((column) => (
                    <Column 
                        key={column.id}
                        boardId={boardId} 
                        column={column}
                        cards={boardCards.filter((card) => card.columnId === column.id)}
                        setCards={setBoardCards}
                        onDeleteColumn={handleDeleteColumn}
                    />
                ))}
                <FormColumn boardId={boardId} onColumnCreated={(newCol) => {
                    setBoardColumns([...boardColumns, newCol]);
                }} />
            </ReactSortable>
        </div>
    );
}