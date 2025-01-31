'use client';

import { ReactSortable } from "react-sortablejs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useState } from 'react';
import { Card as CardType } from "@/app/actions/boardActions";
import { createCard } from "@/app/actions/boardActions";
import { Column as ColumnType, deleteColumn } from "@/app/actions/columnActions";
import { deleteCard, updateCard } from "@/app/actions/cardActions";
import { useAuth } from "@/app/contexts/AuthContext";
import Card from "./Card";
import Options from "./options/Options";

// this is called type alias and is used to define the shape or the data types of the props in the component
// you can use an interface here as well, but using type alias is not only common practice but also offers more flexibility because of
// the ability to define complex types like union or intersection and also serve a specific puspose
// interfaces can be inherited while types cannot 
type ColumnProps = {
    boardId: string;
    column: ColumnType;
    cards: CardType[];
    setCards: Dispatch<SetStateAction<CardType[]>>;
    onDeleteColumn: (columnId: string) => Promise<void>;
}

export default function Column({ boardId, column, cards, setCards, onDeleteColumn }: ColumnProps) {
    const [isAddingCard, setIsAddingCard] = useState<boolean>(false);
    const [newCardTitle, setNewCardTitle] = useState<string>('');
    const { userId } = useAuth();

    function handleAddCard() {
        setIsAddingCard(true);
    }

    async function handleCreateCard(keepAdding: boolean = true) {
        if(!newCardTitle.trim()) {
            setIsAddingCard(false);
            return; // ignore empty cards
        }

        if(!userId) return; // still don't know how to handle this check without repeating it everywhere

        const newCardData = await createCard(userId, boardId, {
            title: newCardTitle,
            columnId: column.id,
            order: cards.length,
        });

        setCards((prevState) => [...prevState, newCardData]);

        // cleanup
        setNewCardTitle("");
        setIsAddingCard(keepAdding); // setting this true so we can continue adding cards
    }

    async function handleDeleteCard(cardId:string) {
        try{
            await deleteCard(userId || "", boardId, cardId);
            setCards((prevCards) => prevCards.filter(card =>  card.id !== cardId));
        } catch (error) {
            console.error("Error deleting card:", error);
            alert("Failed to delete card. Please try again.");
        }
    }

    async function handleDeleteColumn(){
        await onDeleteColumn(column.id);
    }

    async function handleEditColumn(){
        return; 
    }

    async function handleClearCards(){
        if(!userId) return;
        const deletedCards : string[] = [];

        try {
            for(const card of cards){
                await deleteCard(userId, boardId, card.id);
                deletedCards.push(card.id);
            }

            setCards((prevCards) => prevCards.filter(card => !deletedCards.includes(card.id)));
        } catch (error) {
            console.log("Cards couldn't be cleared:", error);
            alert("Error while clearing cards.");
        }
    }

    /**
   * Called whenever ReactSortable re-sorts or moves cards into this column.
   * @param sortedCards - The new array of cards in this column after sorting
   * @param newColumnId - The ID of the column that owns these cards
   */
    function setCardsForColumn(sortedCards: CardType[], newColumnId: string) {
        setCards((prevCards: CardType[]) => {
            const updated = [...prevCards]; // destruct with spread and give us the prev state
            
            sortedCards.forEach((sortedCard: CardType, newOrder: number) => {
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
            await updateCard(userId || "", boardId, sortedCard.id, {
              columnId: newColumnId,
              order: newOrder,
            });
        });
    }


        return (
                <div className="w-80 shadow-md bg-white rounded-md p-3 flex flex-col">
                    <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-lg">{column.name}</h3>
                        <Options onDelete={handleDeleteColumn} onEdit={handleEditColumn} specialAction={handleClearCards}/>
                    </div>
                {/* Sortable area for existing cards */}
                <ReactSortable
                    list={cards}
                    setList={(updated) => {
                        setCardsForColumn(updated, column.id);

                        // TODO: Implement updateCards for concurrency of multiple users.
                    }}
                    group="cards" // ensures cross-column drag is allowed
                    className="flex flex-col space-y-2"
                    ghostClass="opacity-30"
                >
                    {cards.map((card) => (
                        <Card key={card.id} boardId={boardId} card={card} onDelete={handleDeleteCard}/>
                    ))}
                </ReactSortable>

                {/* Add Card Button / Input */}
                {isAddingCard ? (
                    <div className="mt-2">
                        <input
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            onBlur={() => handleCreateCard(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                handleCreateCard();
                                }
                            }}
                        />
                    </div>
                ) : (
                    <button className="w-full btn-secondary mt-2 p-2 rounded transition-colors" onClick={handleAddCard}>
                    + Add Card
                    </button>
                )}
                </div>
     );
}
