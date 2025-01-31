'use client';

import { ReactSortable } from "react-sortablejs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useState, useRef } from 'react';
import { Card as CardType } from "@/app/actions/boardActions";
import { createCard } from "@/app/actions/boardActions";
import { Column as ColumnType, deleteColumn, updateColumn } from "@/app/actions/columnActions";
import { deleteCard, updateCard } from "@/app/actions/cardActions";
import { useAuth } from "@/app/contexts/AuthContext";
import Card from "./Card";
import Options from "./options/Options";

// Type definitions
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
    const [isEditing, setIsEdditing] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [columnName, setColumnName] = useState<string>(column.name);
    const { userId } = useAuth();

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    function handleAddCard() {
        setIsAddingCard(true);
    }

    async function handleCreateCard(keepAdding: boolean = true) {
        if (!newCardTitle.trim()) {
            setIsAddingCard(false);
            return;
        }

        if (!userId) return;

        const newCardData = await createCard(userId, boardId, {
            title: newCardTitle,
            columnId: column.id,
            order: cards.length,
        });

        setCards((prevState) => [...prevState, newCardData]);

        setNewCardTitle("");
        setIsAddingCard(keepAdding);
    }

    async function handleDeleteCard(cardId: string) {
        try {
            await deleteCard(userId || "", boardId, cardId);
            setCards((prevCards) => prevCards.filter(card => card.id !== cardId));
        } catch (error) {
            console.error("Error deleting card:", error);
            alert("Failed to delete card. Please try again.");
        }
    }

    async function handleDeleteColumn() {
        await onDeleteColumn(column.id);
    }

    async function handleEditColumn() {
        setIsEdditing(true);
    }

    async function handleUpdateColumn() {
        const trimmedName = columnName.trim();
        let completedChange = false;

        if (!userId || trimmedName === "") {
            setColumnName(column.name);
            setIsEdditing(false);
            return;
        }

        if (trimmedName !== column.name) {
            try {
                await updateColumn(userId, boardId, column.id, { name: trimmedName });
                completedChange = true;
                setColumnName(trimmedName);
            } catch (error) {
                console.error("Error updating column:", error);
                alert("Failed to update column. Please try again.");
            }
        }

        if (completedChange) {
            setColumnName(trimmedName);
        } else {
            setColumnName(column.name);
        }
        setIsEdditing(false);
    }

    async function handleClearCards() {
        if (!userId) return;
        const deletedCards: string[] = [];

        try {
            for (const card of cards) {
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
            const updated = [...prevCards];
            
            sortedCards.forEach((sortedCard: CardType, newOrder: number) => {
                const foundCard = updated.find((card) => card.id === sortedCard.id);
                if (foundCard) {
                    foundCard.columnId = newColumnId;
                    foundCard.order = newOrder;
                }
            });
            
            updated.sort((a, b) => {
                if (a.columnId === b.columnId) {
                    return a.order - b.order;
                }
                return 0;
            });

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
        <div className="flex flex-col h-auto w-80 bg-white rounded-md shadow-md p-3">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                {isEditing ? (
                    <input
                        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={columnName}
                        ref={inputRef}
                        onChange={(e) => setColumnName(e.target.value)}
                        onBlur={() => handleUpdateColumn()}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateColumn();
                            if (e.key === "Escape") setIsEdditing(false);
                        }}
                    />
                ) : (
                    <h3 className="font-semibold text-lg">{columnName}</h3>
                )}
                <Options onDelete={handleDeleteColumn} onEdit={handleEditColumn} specialAction={handleClearCards}/>
            </div>

            {/* Cards List */}
            <div className="flex-1 mb-2">
                <ReactSortable
                    list={cards}
                    setList={(updated) => {
                        setCardsForColumn(updated, column.id);
                    }}
                    group="cards"
                    className="flex flex-col space-y-2"
                    ghostClass="opacity-30"
                >
                    {cards.map((card) => (
                        <Card key={card.id} boardId={boardId} card={card} onDelete={handleDeleteCard}/>
                    ))}
                </ReactSortable>
            </div>

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
                <button 
                    className="w-full btn-secondary mt-2 p-2 rounded transition-colors" 
                    onClick={handleAddCard}
                >
                    + Add Card
                </button>
            )}
        </div>
    );
}