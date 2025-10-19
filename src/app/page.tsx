'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { loading, isAuthenticated, role } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Still loading - don't redirect yet
    if (loading) return;

    // Already redirected - don't redirect again
    if (hasRedirected) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      setHasRedirected(true);
      router.push('/auth/login');
      return;
    }

    // Role not loaded yet - wait instead of redirecting
    if (role === null) {
      return;
    }

    // Role loaded - redirect to appropriate page
    setHasRedirected(true);
    if (role === 'admin') {
      router.push('/admin/jobs');
    } else if (role === 'jobseeker') {
      router.push('/jobs');
    }
  }, [loading, isAuthenticated, role, router, hasRedirected]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-20">
      <div className="text-center">
        <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-base mt-4 text-neutral-70 font-medium">Loading...</p>
      </div>
    </div>
  );
}
