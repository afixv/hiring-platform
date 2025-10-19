'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'jobseeker';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { loading, isAuthenticated, role } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // If role is required and doesn't match, redirect to home
    if (requiredRole && role !== requiredRole) {
      router.push('/');
      return;
    }
  }, [loading, isAuthenticated, role, requiredRole, router]);

  // Show loading while checking auth
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

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || (requiredRole && role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
