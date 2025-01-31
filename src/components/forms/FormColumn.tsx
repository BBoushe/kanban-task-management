// we explicitly mark a component to be a client component ('use client') as opposed to server component 
// because we rely on browser(client) specific interactivity e.g. onSubmit.
'use client';
import { FormEvent, useEffect, useRef } from "react";
import { createColumn} from "@/app/actions/boardActions";
import { useAuth } from "@/app/contexts/AuthContext";
import { Column } from '@/app/actions/columnActions';
import { useState } from "react";

 
type FormColumnProps = {
    boardId: string;
    onColumnCreated: (newColumn: Column) => void;
}


export default function FormColumn({ boardId, onColumnCreated } : FormColumnProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [columnName, setColumnName] = useState<string>("");
    const { userId } = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isAdding && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAdding]);

    // async function handleNewColumn(event: FormEvent) {
    //     event.preventDefault();

    //     // Downcasting here since TypeScript treats event.target as EventTarget, so we're specifying it's type directly
    //     // So the 'as' keyword basically works in the following way, we're telling the TS compiler that "trust me I know this is of type X"
    //     // So we're explicitly telling the TS compiler that this var is of type X, so we can use querySelector without having type safety issues
    //     // the EventTarget doesn't have querySelector on the prototype chain so regular JS would just go down the prototype chain until it finds it
    //     // but as we know this can cause runtime errors so TS says "nope can't do that until I know it's definetely there"
    //     // In short 'as' is used for downcasting or upcasting
    //     const input = (event.target as HTMLFormElement).querySelector('input#columnName') as HTMLInputElement || null;
    //     const columnName = input?.value.trim();

    //     if(!columnName || !userId) return; // don't create a column if the name is blank upon click or if user is not logged in

    //     const newColumnData = await createColumn(userId, boardId, columnName);
    //     onColumnCreated(newColumnData);

    //     if(input) {
    //         input.value = "";
    //     }
    // }

    async function handleNewColumn(event: FormEvent){
        event.preventDefault();

        const trimmerName = columnName.trim();

        if(!trimmerName || !userId) {
            setIsAdding(false);
            return;
        }

        try {
            const newColumnData = await createColumn(userId, boardId, trimmerName);
            onColumnCreated(newColumnData);
            setColumnName("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error creating column:", error);
            alert("Failed to create column. Please try again.");
            setIsAdding(false);
        }
    }

    function handleAddButtonClick() {
        setIsAdding(true);
    }

    function handleCancel() {
        setIsAdding(false);
        setColumnName("");
    }

    return (
        <div className="w-40 p-1">
            {isAdding ? (
                <form onSubmit={handleNewColumn} className="w-80 border border-gray-300 rounded-md shadow bg-white">
                    <input
                        type="text"
                        id="columnName"
                        placeholder="Column Name"
                        value={columnName}
                        onChange={(e) => setColumnName(e.target.value)}
                        ref={inputRef}
                        className="rounded border border-gray-300 p-2 w-full"
                        onBlur={(e) => {
                            // Check if the blur event is because of pressing Enter (which triggers onSubmit)
                            // To prevent immediate cancellation when pressing Enter, use a timeout
                            setTimeout(() => {
                                if (columnName.trim() === "") {
                                    handleCancel();
                                }
                            }, 100);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                handleCancel();
                            }
                        }}
                    />
                </form>
            ) : (
                <button 
                    onClick={handleAddButtonClick} 
                    className="btn-secondary w-full rounded-md shadow flex items-center justify-center"
                    aria-label="Add Column"
                >
                    + Add Column
                </button>
            )}
        </div>
    );
}