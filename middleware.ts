import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Check for Supabase session cookie
    // Supabase stores session in sb-{project-id}-auth-token
    const authCookie = request.cookies.getAll().find(
      (cookie) => cookie.name.includes('auth-token')
    );

    const isProtectedRoute = 
      pathname.startsWith('/admin') || 
      pathname.startsWith('/jobs') || 
      pathname.startsWith('/apply') ||
      pathname.startsWith('/tes');

    // If no auth cookie and trying to access protected route, redirect to login
    if (!authCookie && isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Otherwise, let it through - client-side auth context will handle the actual validation
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow access - client-side auth will handle protection
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*', '/jobs/:path*', '/apply/:path*', '/tes/:path*'],
};
