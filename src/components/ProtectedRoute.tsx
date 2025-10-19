'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'jobseeker';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { loading, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (!loading && role !== requiredRole) {
      // Unauthorized access
      router.push('/');
    }
  }, [loading, isAuthenticated, role, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-20">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-base mt-4 text-neutral-70 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
