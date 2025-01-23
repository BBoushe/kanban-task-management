import { db } from '@/app/utils/firebaseConfig';
import { getDocs, addDoc, collection, serverTimestamp } from 'firebase/firestore';

type CreateBoardResult = {
    id: string;
};

type Board = {
    id: string;
    name: string;
    description: string;
    createdAt: any;
}

export async function createBoard(userId:string, name: string, description: string) : Promise<CreateBoardResult> {
    // reference of boards subcollection for userId, under users collection
    const boardsCollection = collection(db, `users/${userId}/boards`);

    try {
        // add new board document to firestore
        const docRef = await addDoc(boardsCollection, {
            name,
            description,
            createdAt: serverTimestamp(), // creation timestamp 
        });
        console.log("Document written with ID: ", docRef.id);

        return { id: docRef.id }; // return new board ID
      } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to create board. Please try again later.")
      }

}

export async function fetchBoards(userId: string) : Promise<Board[]> {
    const boardCollection = collection(db, `users/${userId}/boards`);
    const snapshot = await getDocs(boardCollection); // snapshot querry result from Firestore that 
    // contains metadata and data of the collection we're trying to fetch

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(), // spread rest of the document data as defined in Board
    })) as Board[];
}