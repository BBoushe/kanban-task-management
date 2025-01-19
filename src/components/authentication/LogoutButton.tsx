import { useAuth } from '@/app/contexts/AuthContext';

export default function LogoutButton() {
    const { logout } = useAuth();

    return (
        <button onClick={logout} className='btn-secondary'>
            Log Out
        </button>
    );
}