"use client";
import { useState, useEffect, useRef } from 'react';


type OptionProps = {
    boardId?: string;
    onEdit?: () => Promise<void>;
    onDelete: () => Promise<void>;
    specialAction?: () => Promise<any>;
}

export default function Options({ onEdit, onDelete, specialAction } : OptionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null); // reference for detecting outside clicks

    useEffect(() =>{
        function handleClickOutside(event: MouseEvent) {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if(isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // cleanup on unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

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
        setIsOpen(false);
        await onDelete();
    };

    async function handleSpecialAction() {
        if(specialAction){
            setIsOpen(false);
            await specialAction();
        }
    };

    return (
        <div className='relative' ref={menuRef}>
            <button onClick={toggleMenu}
                className='flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-0 rounded box-border'
                aria-haspopup='true'
                aria-label='Options'>
                <span className='flex items-center pb-3 justify-center h-full text-xl leading-none align-middle'>...</span>
            </button>

            {/* Toggled Menu */}
            {isOpen && (
                <div className='absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-24'>
                    <button onClick={handleEdit} className="block w-full px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100">
                        Edit
                    </button>
                    <button onClick={handleDelete} className="block w-full px-2 py-1 text-left text-sm text-red-600 hover:bg-red-100">
                        Delete
                    </button>
                    {specialAction && (
                        <button onClick={handleSpecialAction} className="block w-full px-2 py-1 text-left text-sm text-blue-600 hover:bg-blue-100">
                            Clear Cards
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}