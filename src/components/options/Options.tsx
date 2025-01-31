"use client";
import { useAuth } from '@/app/contexts/AuthContext';
import { useState } from 'react';


type OptionProps = {
    boardId?: string;
    onEdit?: () => Promise<void>;
    onDelete: () => Promise<void>;
    specialAction?: () => Promise<any>;
}

export default function Options({ onEdit, onDelete, specialAction } : OptionProps) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleMenu() {
        setIsOpen((prev) => !prev); // cool way to avoid checking the state first, give me the opposite state of whatever it is
    };

    async function handleEdit() {
        if(onEdit){
            await onEdit();
            setIsOpen(false);
        }
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
            <button onClick={toggleMenu}
                onBlur={toggleMenu} 
                className='flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-0 rounded box-border'
                aria-haspopup='true'
                aria-expanded={isOpen}
                aria-label='Options'>
                <span className='flex items-center justify-center h-full text-xl leading-none align-middle pb-3'>...</span>
            </button>

            {/* toggled menu */}
            {isOpen && (
                <div className='flex flex-col absolute left-0 mt-1 bg-white border rounded shadow-lg z-10'>
                    <button onClick={handleEdit} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Edit
                    </button>
                    <button onClick={handleDelete} className="flex w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100">
                        Delete
                    </button>
                    {specialAction && (
                        <button onClick={handleSpecialAction} className="flex w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-100 whitespace-nowrap">
                        Clear Cards
                    </button>
                    )}
                </div>
            )}
        </div>
    );
}