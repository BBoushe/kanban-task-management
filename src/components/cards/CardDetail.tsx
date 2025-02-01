'use client';

import { Card } from "@/app/actions/boardActions";
import { updateCard } from "@/app/actions/cardActions";
import { useAuth } from "@/app/contexts/AuthContext";
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";


type CardDetailProps = {
    boardId: string;
    card: Card;
}

function CardDetail({ boardId, card } : CardDetailProps){
    const [ isEditingTitle, setIsEditingTitle ] = useState(false);
    const [ isAddingComment, setIsAddintComment ] = useState(false);
    
    const [ cardTitle, setCardTitle ] = useState<string>(card.title);
    const [ cardDescription, setCardDescription ] = useState<string | undefined>(card.description);
    const [ cardComments, setCardComments] = useState<string[] | undefined>(card.comments);
    const [ newComment, setNewComment] = useState<string>("");

    const router = useRouter();
    const { userId } = useAuth();


    function toggleTitleEdit() {
        setIsEditingTitle((prev) => !prev);
    }

    function cancelEditingCard() {
        router.back();
    }

    async function handleSaveCard() {
        if(!userId) return;

        const data: Record<string, any> = {};

        if(cardTitle !== card.title) {
            data.title = cardTitle;
        }

        if(cardDescription !== card.description) {
            data.description = cardDescription;
        }

        if(JSON.stringify(cardComments) !== JSON.stringify(card.comments)) {
            data.comments = cardComments;
        }

        data.updatedAt = serverTimestamp();

        await updateCard(userId, boardId, card.id, data);
        router.back();
    }

    function toggleAddingComment(){
        setIsAddintComment(true);
    }

    function handleDeleteComment(index: number) {
        setCardComments((prev) => {
            if(!prev) return prev;
            const newComments = [...prev];
            newComments.splice(index, 1);
            return newComments;
        });
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
            <div className="p-6 max-w-xl bg-white w-[40vh] rounded-md">
                <div>
                {isEditingTitle ? (
                <div className="mb-1">
                    <input
                        className="border w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        value={cardTitle}
                        onChange={(e) => setCardTitle(e.currentTarget.value)}
                        onBlur={() => toggleTitleEdit()}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setCardTitle(e.currentTarget.value);
                                toggleTitleEdit();
                            }
                            if (e.key === "Escape") {
                                toggleTitleEdit();
                            }
                        }}
                    />
                </div>
                ) : (
                    <h1 onClick={toggleTitleEdit} className="font-bold text-xl mb-4">{cardTitle}</h1>
                )}
                    
                <textarea className="mt-1 w-full h-32 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardDescription || ""} 
                        placeholder="Write description"
                        onChange={(e) => setCardDescription(e.currentTarget.value)}>
                    {cardDescription}
                </textarea>
                    
                <hr className="mt-4"></hr>
                <div className="mt-2">
                    <div className="">
                        <h2 className="font-semibold text-md my-2">Comments</h2>
                        {cardComments && cardComments.length > 0 ? (
                            cardComments.map((comment, index) => (
                                <div key={index} className="flex my-2">
                                    <p className="text-wrap p-2 my-2 border shadow-md shadow-blue-100 rounded hover:shadow-red-200">{comment}</p>
                                    <button onClick={() => handleDeleteComment(index)} className="ml-2 hover:text-3xl hover:ml-1">🗑️</button>
                                </div>
                            ))
                        ) : (
                            <span>There are no comment here</span>
                        )}
                    </div>

                    {isAddingComment ? (
                        <div onBlur={() => {
                            setIsAddintComment(false);
                            setNewComment("");
                        }}>
                            <input
                                autoFocus
                                type="text"
                                className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your comment and hit Enter"
                                value={newComment}
                                onChange={(e) => setNewComment(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    // Append the new comment to existing comments (or create an array if none exist)
                                    setCardComments((prev) =>
                                    prev ? [...prev, newComment] : [newComment]
                                    );
                                    setNewComment("");
                                    setIsAddintComment(false);
                                }
                                }}
                            />
                        </div>
                    ) : (
                        <button onClick={toggleAddingComment} className="mt-4 btn btn-boards"> + Add comment</button> 
                    )}
                    <hr className="mt-4 border-1 border-gray-500"></hr>
                </div>
            </div>

                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{card.updatedAt ? 
                    (`Updated at: ${new Date(card.updatedAt.seconds * 1000).toLocaleString()}`) 
                    : (`Created at: ${new Date(card.createdAt.seconds * 1000).toLocaleString()}`)}</span>

                    <div className="flex justify-end">
                    <button onClick={cancelEditingCard} type="button" className="mr-1 btn btn-red">Cancel</button>
                    <button onClick={handleSaveCard} type="button" className="ml-1 btn btn-primary">Save</button>
                </div>
            </div>
                
        </div>
                
        </div>
    );
}

export default CardDetail;