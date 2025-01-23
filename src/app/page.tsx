'use client';
import LandingPage from "@/components/views/LandingPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from '@/app/contexts/AuthContext';


export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!loading && user) {
      router.push('/board');
    }
  }, [user,loading, router]);

  if(loading) return <p>Loading...</p>

  return <LandingPage/>;
}
