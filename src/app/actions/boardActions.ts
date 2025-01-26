import { db } from '@/app/utils/firebaseConfig';
import Column from '@/components/Column';
import { query, getDocs, updateDoc, addDoc, collection, serverTimestamp, doc, getDoc, Transaction, orderBy } from 'firebase/firestore';
import { runTransaction } from 'firebase/firestore'; // this is just for testing the transaction function of firestore, and is not that important for this demo
import { useAuth } from '../contexts/AuthContext';

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
    columnCount?: number;
    cards: Card[];
}

export type Column = {
    id: string;
    name: string;
    order?: number;
    createdAt?: any;
  };

export type Card = {
    id: string;
    title: string;
    description?: string;
    columnId?: string;
    order: number;
    createdAt?: any;
}

type ColumnInput = Omit<Column, 'id' | 'createdAt'>;

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
            columnCount: 0,
        });

        const boardPath = `users/${userId}/boards/${docRef.id}`;
        const columnsCollection = collection(db, `${boardPath}/columns`);
        const cardsCollection = collection(db, `${boardPath}/cards`);

        await Promise.all([
            addDoc(columnsCollection, { placeholder: true }).catch((err) => {
                console.error("Failed to create columns placeholder:", err);
            }),
            addDoc(cardsCollection, { placeholder: true }).catch((err) => {
                console.error("Failed to create cards placeholder:", err);
            }),
        ]);

        console.log("Document written with ID: ", docRef.id);

        return { id: docRef.id }; // return new board ID
      } catch (err) {
        console.error("Error adding document: ", err);
        throw new Error("Failed to create board. Please try again later.");
      }

}

export async function createColumn(userId: string, boardId: string, columnName: string) : Promise<Column> {
    // fetch board first, then fetch 
   const boardRef = doc(db, `users/${userId}/boards/${boardId}`);
   const columnRef = collection(boardRef, 'columns');

   return runTransaction(db, async (transaction) => {
    const boardSnap = await transaction.get(boardRef);
    if(!boardSnap.exists()) {
        throw new Error("Board doesn't exist.");
    }

    const boardData = boardSnap.data() as Board;
    const currentCount = boardData.columnCount ?? 0; // ?? if null turn 0, like in swift

    // create a new reference of the column in firestore and  set its' data
    const newColumnRef = doc(columnRef);
    transaction.set(newColumnRef, {
        name: columnName,
        order: currentCount,
        createdAt: serverTimestamp(),
    });

    transaction.update(boardRef, { columnCount: currentCount + 1});

    return {
        id: newColumnRef.id,
        name: columnName,
        order: currentCount,
    };
   });
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
    const docRef = doc(db, `users/${userId}/boards/${boardId}`);
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
    const columnsRef = collection(db, `users/${userId}/boards/${boardId}/columns`);
    const columnsQuery = query(columnsRef, orderBy("order"));
    const snapshot = await getDocs(columnsQuery);

    return snapshot.docs
        .filter((doc) => !doc.data().placeholder) // ensure we don't return placeholders
        .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Column, 'id'>),
        }));
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

export async function getCards(userId: string, boardId: string) : Promise<Card[]> {
    const cardsRef = collection(db,`users/${userId}/boards/${boardId}/cards`);
    const snapshot = await getDocs(cardsRef);

    return snapshot.docs
        .filter((doc) => !doc.data().placeholder)    
        .map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Card, 'id'>),
    }));
}
