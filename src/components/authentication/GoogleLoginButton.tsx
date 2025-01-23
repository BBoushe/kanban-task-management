'use client'
import { signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '@/app/utils/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton({ children }:any){
    const router = useRouter();

    async function handleGoogleLoign() {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user =userCredential.user;

            // if user doesn't have a display name, derive one from email
            if (!user.displayName && user.email) {
                const username = user.email.split('@')[0];
                await updateProfile(user, { displayName: username });
            }
            
            router.push('/home');
        } catch (error) {
            console.error('Google login failed: ', error);
        }
    }

    return (
        <button onClick={handleGoogleLoign} type='button' className="btn-google w-full text-white bg-red-500 py-2 rounded">
            {children}
        </button>
    );
}