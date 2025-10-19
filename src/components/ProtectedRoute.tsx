'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'jobseeker';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { loading, isAuthenticated, role } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (loading) {
      setShouldRender(false);
      return;
    }

    if (!isAuthenticated) {
      setShouldRender(false);
      router.push('/auth/login');
      return;
    }

    if (requiredRole) {
      if (role === requiredRole) {
        setShouldRender(true);
      } else if (role === null) {
        setShouldRender(false);
      } else {
        setShouldRender(false);
        router.push('/');
      }
    } else {
      setShouldRender(true);
    }
  }, [loading, isAuthenticated, role, requiredRole, router]);

  if (loading || !shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-20">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-base mt-4 text-neutral-70 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
