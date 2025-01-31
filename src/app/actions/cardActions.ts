import { db } from "../utils/firebaseConfig";
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';

type UpdateCardData = {
    columnId?: string;
    order?: number;
    title?: string;
    description?: string;
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