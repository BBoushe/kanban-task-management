'use client';

import { ReactSortable } from "react-sortablejs";
import { Dispatch, SetStateAction } from "react";
import { useState } from 'react';
import { Card } from "@/app/actions/boardActions";
import { createCard } from "@/app/actions/boardActions";
import { Column as ColumnType } from "@/app/actions/boardActions";
import { updateCard } from "@/app/actions/cardActions";

// this is called type alias and is used to define the shape or the data types of the props in the component
// you can use an interface here as well, but using type alias is not only common practice but also offers more flexibility because of
// the ability to define complex types like union or intersection and also serve a specific puspose
// interfaces can be inherited while types cannot 
type ColumnProps = {
    userId: string;
    boardId: string;
    column: ColumnType;
    cards: Card[];
    setCards: Dispatch<SetStateAction<Card[]>>;
}

export default function Column({ userId, boardId, column, cards, setCards }: ColumnProps) {
    const [isAddingCard, setIsAddingCard] = useState<boolean>(false);
    const [newCardTitle, setNewCardTitle] = useState<string>('');

    function handleAddCard() {
        setIsAddingCard(true);
    }

    async function handleCreateCard() {
        if(!newCardTitle.trim()) {
            setIsAddingCard(false);
            return; // ignore empty cards
        }

        const newCardData = await createCard(userId, boardId, {
            title: newCardTitle,
            columnId: column.id,
            order: cards.length,
        });

        setCards((prevState) => [...prevState, newCardData]);

        // cleanup
        setNewCardTitle("");
        setIsAddingCard(false);
    }

    /**
   * Called whenever ReactSortable re-sorts or moves cards into this column.
   * @param sortedCards - The new array of cards in this column after sorting
   * @param newColumnId - The ID of the column that owns these cards
   */
    function setCardsForColumn(sortedCards: Card[], newColumnId: string) {
        setCards((prevCards: Card[]) => {
            const updated = [...prevCards]; // destruct with spread and give us the prev state
            
            sortedCards.forEach((sortedCard: Card, newOrder: number) => {
                const foundCard = updated.find((card) => card.id === sortedCard.id)
                if(foundCard) {
                    foundCard.columnId = newColumnId;
                    foundCard.order = newOrder; // update the new position
                }
            });
            
            updated.sort((a,b) => {
                if(a.columnId === b.columnId) {
                    return a.order - b.order;
                }
                return 0;
            });
            // return the new processed cards, sorted by order so the reordering works, as the new state of the cards
            // which is being called when anythin in the ReactSortable changes, specifically on the list of cards 

            return updated;
        });

        sortedCards.forEach(async (sortedCard, newOrder) => {
            await updateCard(userId, boardId, sortedCard.id, {
              columnId: newColumnId,
              order: newOrder,
            });
        });
    }


        return (
                <div className="w-60 shadow-md bg-white rounded-md p-4">
                <h3 className="font-semibold">{column.name}</h3>

                {/* Sortable area for existing cards */}
                <ReactSortable
                    list={cards}
                    setList={(updated) => {
                        setCardsForColumn(updated, column.id);

                        // TODO: Implement updateCards for concurrency of multiple users.
                    }}
                    group="cards" // ensures cross-column drag is allowed
                    className="p-1 flex flex-col space-y-1"
                    ghostClass="opacity-30"
                >
                    {cards.map((card) => (
                    <div key={card.id} className="border bg-white my-2 p-4 rounded-md">
                    <span>{card.title}</span>
                    </div>
                    ))}
                </ReactSortable>

                {/* Add Card Button / Input */}
                {isAddingCard ? (
                    <div className="mt-2">
                        <input
                            className="border p-1 w-full rounded"
                            autoFocus
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            onBlur={handleCreateCard}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                handleCreateCard();
                                }
                            }}
                        />
                    </div>
                ) : (
                    <button className="btn-secondary mt-2" onClick={handleAddCard}>
                    + Add Card
                    </button>
                )}
                </div>
     );
}
