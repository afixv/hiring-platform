'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { loading, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (role === 'admin') {
        router.push('/admin/jobs');
      } else if (role === 'jobseeker') {
        router.push('/jobs');
      }
    }
  }, [loading, isAuthenticated, role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-20">
      <div className="text-center">
        <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-base mt-4 text-neutral-70 font-medium">Loading...</p>
      </div>
    </div>
  );
}
