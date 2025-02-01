'use client';
import Link from 'next/link';
import LogoutButton from './authentication/LogoutButton';
import { getAuth } from 'firebase/auth';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
    const auth = getAuth();
    const { loading }  = useAuth();
    const user = auth.currentUser;

    if(loading || !user) return null;

    return (
      <header className="sticky top-0 z-50 bg-gray-800 p-4 flex justify-between items-center text-white shadow-md">
          <h1 className="text-2xl font-bold flex items-center space-x-5">
              <Link href="/home" className="logo hover:underline">
                  Trello Clone
              </Link>
              <Link href='/create-board' className='btn-primary px-3 py-1 rounded'>Create</Link>
              <Link href='/home' className='btn-boards px-3 py-1 rounded'>Boards</Link>
          </h1>
          
          <div className="flex space-x-4 items-center">
              {user?.displayName && <span className='font-medium mx-2'>Hi, {user.displayName}</span>}
              <LogoutButton />
          </div>
      </header>
  );
}