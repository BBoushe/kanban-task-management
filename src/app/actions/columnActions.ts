import { db } from "../utils/firebaseConfig";
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';

export type Column = {
    id: string;
    name: string;
    order?: number;
    createdAt?: any;
};


  // this function is not implemented properly, it would be better if the delete column deletes all cards associated with the column
  // since where I use this function I already have the list of cards, there is no reason why I should do this here
export async function deleteColumn(userId: string, boardId: string, columnId: string){
    const ref = doc(db, `users/${userId}/boards/${boardId}/columns/${columnId}`);
    await deleteDoc(ref);
}

export async function updateColumn(
    userId: string,
    boardId: string,
    columnId: string,
    data: Partial<Column>
  ) {
    const ref = doc(db, `users/${userId}/boards/${boardId}/columns/${columnId}`);
    await updateDoc(ref, data);
  }