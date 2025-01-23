import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    }

    return (
        <button
            onClick={handleLogout}
            className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
            Log Out
        </button>
        // <Link href={'/'} onClick={logout} className='text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'>
        //     Logout
        // </Link>
    );
}
