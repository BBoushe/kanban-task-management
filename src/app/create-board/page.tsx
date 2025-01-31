'use client';

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { createBoard } from "../actions/boardActions";

export default function CreateBoardPage() {
    // const { user } = useAuth(); // fetch current user authentication
    const { user } = useAuth();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const boardName = formData.get('name')?.toString() || ''; // makes ts happy because we control such that if it's not a string or it's undefined we make sure it's a string, function definition will prevent it anyways
        const boardDescription = formData.get('description')?.toString() || '';

        // Ensure user is authenticated
        if (!user) {
            throw new Error("User must be authenticated to create a board.");
        }

        // create board in firestore
        const { id } = await createBoard(user.uid, boardName, boardDescription);
        router.push(`users/${user.uid}/boards/${id}`);
    }

    return (
        <div>
            <form action={handleSubmit} className="max-w-xs block">
                <h1 className="text-2xl mb-3">Create new board</h1>
                <input type="text" name="name" placeholder="Board name" className="rounded"/>
                <input type="text" name="description" placeholder="Brief description" className="text-base my-2 rounded"/>
                {/* <textarea id="w3review" name="w3review" rows={3} className="text-base my-2 rounded" placeholder="Board description"></textarea> */}
                <button type="submit" className="btn-primary mt-1">Create board</button>
            </form>
        </div>
    );
}