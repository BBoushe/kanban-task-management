import { db } from "../utils/firebaseConfig";
import { doc, updateDoc } from 'firebase/firestore';

type UpdateCardData = {
    columnId?: string;
    order?: number;
    title?: string;
    description?: string;
}

export async function updateCard(userId: string, boardId: string, cardId: string, data:UpdateCardData) {
    const cardDocRef = doc(db, `users/${userId}/boards/${boardId}/cards/${cardId}`);
    await updateDoc(cardDocRef, data);
}