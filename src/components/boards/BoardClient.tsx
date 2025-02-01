// this is the client part of the dynamic boardId page which is supposed to render on client
'use client';

// Object imports
import { useEffect, useState } from 'react';
import { getBoard, Board as BoardType} from '@/app/actions/boardActions';
import { getColumns } from '@/app/actions/boardActions';
import { getCards, Card } from '@/app/actions/boardActions';
import { Column } from '@/app/actions/columnActions';
import { useSearchParams, useRouter } from 'next/navigation';

// Component imports
import Loading from '@/components/views/Loading';
import Board from './Board';
import FormColumn from '../forms/FormColumn';
import CardDetail from '../cards/CardDetail';
import { useAuth } from '@/app/contexts/AuthContext';

import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/utils/firebaseConfig';


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
    const searchParams = useSearchParams();
    const cardId = searchParams.get('cardId');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            if(!userId) return; // make sure user is authenticated

            try {
                const boardData = await getBoard(userId, boardId);
                const columnData = await getColumns(userId, boardId);
                setBoard(boardData);
                setColumns(columnData);
            } catch (err) {
                console.error("Failed to fetch data for board: ", err);
                setError("Failed to fetch data for board in BoardClient.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [userId, boardId]);

    useEffect(() => {
      if(!userId) return;

      const cardsRef = collection(db, `users/${userId}/boards/${boardId}/cards`);
      const q = query(cardsRef, orderBy("order"));

      function unsubscribe() {
        onSnapshot(q, (snapshot) => {
          const updatedCards = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Card[];
          setCards(updatedCards);
        },
        (err) => {
          console.error("Error fetching cards in real time: ", err);
        });
      } 

      unsubscribe();
    }, [userId, boardId]);

    function fetchModalCard() : Card | null {
      if(cardId) {
        const foundCard = cards.find(card => card.id === cardId);
        return foundCard || null;
      } else {
        throw new Error("You haven't clicked on card");
      }
    }

    if(loading) return <Loading/>;
    if(error) return <p>{error}</p>;
    if(!board) return <p>Board not found</p>;

    return (
        <div className='flex-none w-full'>
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
            setCards={setCards}
          />
          
        )}
        {cardId && (() => {
          const fetchedCard = fetchModalCard(); // fetch the exact card from the cards list
          return fetchedCard ? <CardDetail boardId={boardId} card={fetchedCard}/> : null;
        })()}
      </section>
      </div>
    );

}