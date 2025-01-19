'use client';
import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const router = useRouter();

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();
        setError(null);

        try{
            await login(email, password); // this is called from the AuthContext within the context of this component passed as AuthContext
            router.push("/");
        } catch (err: any) {
            switch (err.code) {
                case "auth/user-not-found":
                  setError("No account found with this email. Please register or try a different email.");
                  break;
                case "auth/invalid-credential":
                  setError("Incorrect password. Please try again.");
                  break;
                case "auth/invalid-email":
                  setError("The email address is not valid. Please check and try again.");
                  break;
                case "auth/too-many-requests":
                  setError("Too many login attempts. Please try again later.");
                  break;
                default:
                  setError("An unexpected error occurred. Please try again later.");
                  console.log(err.code);
                  break;
              }
        }
    }

    return (
        <div className="w-80 p-6 mx-auto mt-10 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="grid gap-2">
            <input
              type="email"
              placeholder="Email"
              className="rounded border p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="rounded border p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </div>
        </form>
      </div>
    );
}