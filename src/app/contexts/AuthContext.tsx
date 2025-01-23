'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/utils/firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // use onAuthStateChanged to listen to authentication state change
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        // clean up after unmount
        // in react unmounting means when the component is no longer being rendered i.e. when the user logs out we no 
        // longer need to render the header thus it's unmounted
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
    </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("[DEV Message]: useAuth must be used within an AuthProvider");
    }
    return context;
}