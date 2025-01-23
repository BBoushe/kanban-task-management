'use client';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) return <p>Loading...</p>;

    return <>{children}</>;
}