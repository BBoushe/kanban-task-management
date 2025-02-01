import { db } from "../utils/firebaseConfig";
import { deleteDoc, doc, updateDoc, getDoc, collection, query } from 'firebase/firestore';

type UpdateCardData = {
    columnId?: string;
    order?: number;
    title?: string;
    description?: string;
    comments?: string[];
    updatedAt?: any;
}

export async function updateCard(userId: string, boardId: string, cardId: string, data:UpdateCardData) {
    if (!userId) return;

    const cardDocRef = doc(db, `users/${userId}/boards/${boardId}/cards/${cardId}`);
    await updateDoc(cardDocRef, data);
}

export async function deleteCard(userId: string, boardId: string, cardId:string) {
    if (!userId) return;

    const cardDocRef = doc(db, `users/${userId}/boards/${boardId}/cards/${cardId}`);
    await deleteDoc(cardDocRef);
}

export async function getCard(userId: string, boardId: string, cardId: string) {
    if(!userId) return;

    const cardDocRef = doc(db, `users/${userId}/boards/${boardId}/cards`, cardId);
    const snapshot = await getDoc(cardDocRef);


    if(!snapshot.exists()) {
        throw new Error("No such board found.");
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    }
}