"use client";
import { useState } from 'react';


type OptionProps = {
    userId: string;
    boardId: string;
    onEdit: () => Promise<void>;
    onDelete: () => Promise<void>;
    specialAction?: () => Promise<any>;
}

export default function Options({ onEdit, onDelete, specialAction } : OptionProps) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleMenu() {
        setIsOpen((prev) => !prev); // cool way to avoid checking the state first, give me the opposite state of whatever it is
    };

    async function handleEdit() {
        await onEdit();
        setIsOpen(false);
    };

    async function handleDelete() {
        await onDelete();
        setIsOpen(false);
    };

    async function handleSpecialAction() {
        if(specialAction){
            await specialAction();
            setIsOpen(false);
        }
    };

    return (
        <div className='relative inline-block'>
            <button onClick={toggleMenu} className='p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded'>
                <span className='text-xl'>...</span>
            </button>

            {/* toggled menu */}
            {isOpen && (
                <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10'>
                    <button onClick={handleEdit} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Edit
                    </button>
                    <button onClick={handleDelete} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100">
                        Delete
                    </button>
                    {specialAction && (
                        <button onClick={handleSpecialAction} className="block w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-100">
                        Clear Cards
                    </button>
                    )}
                </div>
            )}
        </div>
    );
}