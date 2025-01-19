'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/utils/firebaseConfig';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registrationSchema } from '@/app/utils/validationSchema';

type FormData = {
    email: string;
    password: string;
};


export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // Hook into react-hook-form and use yup schema validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(registrationSchema),
    });

    async function handleRegister(data: FormData) {
        console.log("Form data submitted:", data);
        setError(null);
        setSuccess(false);

        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            setSuccess(true);
            router.push("/login");
        } catch (err: any) {
            switch (err.code) {
                case "auth/email-already-in-use":
                    setError("The email address is already registered. Please use a different email or log in.");
                    break;
                case "auth/weak-password":
                    setError("The password is too weak. Please use a stronger password.");
                    break;
                default:
                    setError("An unexpected error occurred. Please try again later.");
                    break;
            }
        }
    }

    return (
        <div className="w-80 p-6 mx-auto mt-10 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
            <p className="text-green-500 mb-4">
                Registration successful! You can log in now.
            </p>
            )}
        <form onSubmit={handleSubmit(handleRegister)}>
          <div className="grid gap-2">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              className={`rounded border p-2 w-full ${errors.email ? "border-red-500" : "border-gray-300"}`}
              {...register("email")}
            />
            {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email.message}</p>
            )}
            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              className={`rounded border p-2 w-full ${errors.password ? "border-red-500" : "border-gray-300"}`}
              {...register("password")}
            />
            {errors.password && (
                <p className='text-red-500 text-sm'>{errors.password.message}</p>
            )}
            {/* Submit Button */}
            <button type="submit" className="btn-primary w-full">
              Register
            </button>
          </div>
        </form>
      </div>
    );
}