'use client';

import LandingPage from "@/components/views/LandingPage";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from '@/app/contexts/AuthContext';



export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!loading && user) {
      router.push('/home');
    }
  }, [user,loading, router]);

  if(loading) return <Loading/>;

  return <LandingPage/>;
}
