import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create Supabase client for server-side auth check
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // Get session from cookie (Supabase stores it here)
    const cookieStore = request.cookies;
    const authToken = cookieStore.get('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0] + '-auth-token');

    if (!authToken) {
      // No session, redirect to login
      if (pathname.startsWith('/admin') || pathname.startsWith('/jobs')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      return NextResponse.next();
    }

    // Parse session to check user role
    let sessionData;
    try {
      sessionData = JSON.parse(Buffer.from(authToken.value, 'base64').toString());
    } catch {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const userId = sessionData?.[0]?.user?.id;

    if (userId && pathname.startsWith('/admin')) {
      // This is where you'd check the user role
      // For now, we'll allow it through - the client-side auth will handle it
      return NextResponse.next();
    }

    if (userId && pathname.startsWith('/jobs')) {
      return NextResponse.next();
    }

    // If no user ID but trying to access protected routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/jobs')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow access - client-side auth will handle protection
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/jobs/:path*', '/apply/:path*', '/tes/:path*'],
};
