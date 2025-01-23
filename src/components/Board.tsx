'use client';
import Column from './Column';
import FormColumn from "./forms/FormColumn";
import { useState } from 'react';

const defaultColumns: {id:string, name:string, idx:number}[] = [
    {id: 'asdf', name: 'todo', idx: 0},
    {id: 'fdas', name: 'todo1', idx: 1},
    {id: 'gfaf', name: 'todo2', idx: 2},
];

export type CardType = {
    id: string | number;
    name: string;
    order: number;
    columnId: string
}

const defaultCards: CardType[] = [
    {id: "fdafd", name: "task 1", order:0, columnId: 'asdf'},
    {id: "alksd", name: "task 2", order:1, columnId: 'fdas'},
    {id: "cvagh", name: "task 3", order:2, columnId: 'gfaf'},
    {id: "dacaz", name: "task 4", order:3, columnId: 'gfaf'},
]

export default function Board() {
    const [cards, setCards] = useState(defaultCards);
    const [columns, setColumns] = useState(defaultColumns);

    return (
        <div className="flex gap-4">
            {columns.map(column => (
            <Column key={column.id} {...column} setCards={setCards} cards={cards.filter(card => card.columnId === column.id)}/>
            ))}
            <FormColumn/>
        </div>
    );
}