'use client';
import { FormEvent } from "react";
import { Board } from "@/app/actions/boardActions";
import { createColumn, Column} from "@/app/actions/boardActions";

 
// we explicitly mark a component to be a client component ('use client') as opposed to server component 
// because we rely on browser(client) specific interactivity e.g. onSubmit.


export default function FormColumn({ board, onColumnCreated }) {

    function handleNewColumn(event: FormEvent) {
        event.preventDefault();

        // Downcasting here since TypeScript treats event.target as EventTarget, so we're specifying it's type directly
        // So the 'as' keyword basically works in the following way, we're telling the TS compiler that "trust me I know this is of type X"
        // So we're explicitly telling the TS compiler that this var is of type X, so we can use querySelector without having type safety issues
        // the EventTarget doesn't have querySelector on the prototype chain so regular JS would just go down the prototype chain until it finds it
        // but as we know this can cause runtime errors so TS says "nope can't do that until I know it's definetely there"
        // In short 'as' is used for downcasting or upcasting
        const input = (event.target as HTMLFormElement).querySelector('input');
        const columnName = input?.value;
    }

    return (
        <form  onSubmit={handleNewColumn} className="w-80 p-4 border-gray-300 rounded-md shadow bg-white">
            <div className="grid gap-2">
                <label htmlFor="columnName">
                    <span className="text-gray-600">Column Name:</span>
                </label>

                <input type="text" id="columnName" placeholder="Column Name" className="rounded border border-gray-300 p-2 w-full"/>
                <button type="submit" className="btn-primary w-full">Create Column</button>
            </div>
        </form>  
    );
}