// this is the client part of the dynamic boardId page which is supposed to render on client
'use client';

// Object imports
import { useEffect, useState } from 'react';
import { getBoard, Board as BoardType} from '@/app/actions/boardActions';
import { getColumns } from '@/app/actions/boardActions';
import { getCards, Card } from '@/app/actions/boardActions';
import { Column } from '@/app/actions/columnActions';

// Component imports
import Loading from '@/components/Loading';
import Board from '../Board';
import FormColumn from '../forms/FormColumn';
import { useAuth } from '@/app/contexts/AuthContext';

type BoardClientProps = {
    boardId: string,
};

export default function BoardClient({ boardId } : BoardClientProps) {
    const [board, setBoard] = useState<BoardType | null>(null);
    const [columns, setColumns] = useState<Column[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            if(!userId) return; // make sure user is authenticated

            try {
                const boardData = await getBoard(userId, boardId);
                const columnData = await getColumns(userId, boardId);
                const cardsData = await getCards(userId, boardId);

                setBoard(boardData);
                setColumns(columnData);
                setCards(cardsData);
            } catch (err) {
                console.error("Failed to fetch data for board: ", err);
                setError("Failed to fetch data for board in BoardClient.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [userId, boardId]);

    if(loading) return <Loading/>;
    if(error) return <p>{error}</p>;
    if(!board) return <p>Board not found</p>;

    return (
        <div>
      {/* The board info at the top */}
      <h1 className="text-4xl mb-4">{board.name}</h1>
      <p className="text-gray-600">{board.description}</p>
      <hr />
      <p className="text-sm text-gray-500">
        Created on:{" "}
        {new Date(board.createdAt.seconds * 1000).toLocaleDateString()}
      </p>

      <section>
        {columns.length === 0 ? (
          <div>
            <p>This board has no columns. Create one to get started:</p>
            <FormColumn
              boardId={boardId}
              onColumnCreated={(newColumn : Column) => {
                setColumns([...columns, newColumn]);
              }}
            />
          </div>
        ) : (
          <Board
            board={board}
            boardId={boardId}
            columns={columns}
            cards={cards}
          />
        )}
      </section>
      </div>
    );

}