// this is an optional page and this means that we can change the layout of board specific pages
// I'm not going to implement this right now because I don't think this is the main purpose of the project
// The use case here can be that while in "work mode" we might use a different layout than the main pages i.e. when we're inside a
// board we might like to put the header somewhere differently, we might want to add additioanl sections than the ones in the app etc.


// IMPORTANT: the dynamic routting has to be set up exactly like the collection in firebase
import React from 'react';
import BoardClient from '@/components/boards/BoardClient';
import ProtectedRoute from '@/components/ProtectedRoute';

type BoardPageProps = {
    params: Promise<{
        userId: string;
        boardId: string; // will be used to specify dynamic board route
    }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
    const {userId, boardId} = await params; // params are asynchronious in nextjs 15
    
    return (
        <ProtectedRoute>
            <BoardClient userId={userId} boardId={boardId}/>
        </ProtectedRoute>
    )
}