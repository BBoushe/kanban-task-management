'use client';
import Link from 'next/link';
import LogoutButton from './authentication/LogoutButton';
import { getAuth } from 'firebase/auth';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
    const auth = getAuth();
    const { loading }  = useAuth();
    const user = auth.currentUser;

    if(loading || !auth) return null;

        return (
            <>
            {user && (<header className="m-3 bg-gray-500 rounded p-4 flex justify-between items-center text-white">
                <h1 className="text-2xl font-bold">
                  <Link href="/home" className="logo hover:underline">
                    Trello Clone
                  </Link>
                  <Link href='/create-board' className='btn btn-primary mx-5'>Create</Link>
                  <Link href='/home' className='btn btn-boards'>Boards</Link>
                </h1>
                
                <div className="flex space-x-4 items-center">
                  {/* Display Name */}
                  {user?.displayName && <span className='font-medium mx-2'>Hi, {user?.displayName}</span>}
                  <LogoutButton/>
                </div>
            </header>)}
            </>
        );
}