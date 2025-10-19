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
    console.log(`[ProtectedRoute] Check: loading=${loading}, auth=${isAuthenticated}, role=${role}, required=${requiredRole}`);
    
    // Still loading - wait
    if (loading) {
      console.log('[ProtectedRoute] Still loading auth, showing spinner');
      setShouldRender(false);
      return;
    }

    // Auth loading finished
    if (!isAuthenticated) {
      // Not authenticated - redirect to login
      console.log('[ProtectedRoute] Not authenticated, redirecting to login');
      setShouldRender(false);
      router.push('/auth/login');
      return;
    }

    // Authenticated but role check needed
    if (requiredRole) {
      if (role === requiredRole) {
        // Role matches - render
        console.log(`[ProtectedRoute] Role matched (${role}), rendering`);
        setShouldRender(true);
      } else if (role === null) {
        // Role still loading from database - wait instead of redirect
        console.log('[ProtectedRoute] Role still loading, waiting...');
        setShouldRender(false);
        // Don't redirect, wait for role to load
      } else {
        // Role doesn't match - redirect to home
        console.log(`[ProtectedRoute] Role mismatch (${role} !== ${requiredRole}), redirecting to home`);
        setShouldRender(false);
        router.push('/');
      }
    } else {
      // No role required, just need authentication
      console.log('[ProtectedRoute] No role required, rendering');
      setShouldRender(true);
    }
  }, [loading, isAuthenticated, role, requiredRole, router]);

  // Show loading screen
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
