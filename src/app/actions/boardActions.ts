import { db } from '@/app/utils/firebaseConfig';
import Column from '@/components/Column';
import { getDocs, addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';

type CreateBoardResult = {
    id: string;
};

type CreateCardResult = {
    id: string;
}

export type Board = {
    id: string;
    name: string;
    description: string;
    createdAt: any;
    cards: Card[];
}

export type Column = {
    id: string;
    name: string;
    order: number;
  };

export type Card = {
    id: string;
    title: string;
    description?: string;
    columnId?: string;
    order: number;
    createdAt?: any;
}

type CardInput = Omit<Card, 'id' | 'createdAt'>;
// Omit means same as card but without second argument

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
      } catch (err) {
        console.error("Error adding document: ", err);
        throw new Error("Failed to create board. Please try again later.");
      }

}

export async function createColumn(userId: string, boardId: string, columnName: string) : Promise<Column> {
    // TO-DO complete function later
    return { id: 'fdadfa', name: columnName, order: 1};
}

export async function createCard(userId: string, boardId: string, cardData: CardInput) : Promise<Card> {
    const cardsCollection = collection(db, `users/${userId}/boards/${boardId}/cards`);

    try {
        const docRef = await addDoc(cardsCollection, {
            ...cardData,
            createdAt: serverTimestamp(),
        });
        console.log("Card created with ID: ", docRef.id);

        return { 
            id: docRef.id,
            ...cardData 
        };
    } catch (err) {
        console.error("Error adding card: ", err);
        throw new Error("Failed to create card. Please try again later.");
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

export async function getBoard(userId: string, boardId: string) : Promise<Board> {
    // document reference so we can fetch it below
    const docRef = doc(db, `/users/${userId}/boards/${boardId}`);
    const docSnap = await getDoc(docRef);

    if(!docSnap.exists()) {
        throw new Error("No such board found.");
    }

    return {
        id: boardId,
        ...(docSnap.data() as Omit<Board, 'id'>), // ensure it matches the Board type with Omit
    }
}

export async function getColumns(userId: string, boardId: string) : Promise<Column[]> {
    const columnsRef = collection(db, `users/${userId}/boards/${boardId}/columns}`);
    const snapshot = await getDocs(columnsRef);

    const columns: Column[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Column, 'id'>),
    }));

    return columns;
}

export async function getCards(userId: string, boardId: string) : Promise<Card[]> {
    const cardsRef = collection(db,`users/${userId}/boards/${boardId}/cards`);
    const snapshot = await getDocs(cardsRef);

    const cards: Card[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Card, 'id'>),
    }));

    return cards;
}
