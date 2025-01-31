'use client';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import Loading from './Loading';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) return <Loading/>;

    return <>{children}</>;
}