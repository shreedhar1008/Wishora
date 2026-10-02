import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/admin'];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Create a response to pass through
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  let user: any = null;

  // 1. Check local session cookie (fast, works offline/demo mode)
  const localUserCookie = request.cookies.get('wishora_user')?.value;
  if (localUserCookie) {
    try {
      user = JSON.parse(decodeURIComponent(localUserCookie));
    } catch {
      // invalid cookie
    }
  }

  // 2. If no local cookie and Supabase credentials exist, try Supabase session
  if (!user && supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              response = NextResponse.next({
                request: { headers: request.headers },
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
              );
            },
          },
        }
      );

      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Supabase connection error / offline
    }
  }

  // Check if current path is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is an auth route (login/signup)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    const fullPath = request.nextUrl.search ? `${pathname}${request.nextUrl.search}` : pathname;
    loginUrl.searchParams.set('redirect', fullPath);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes to dashboard
  if (isAuthRoute && user) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const targetUrl = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/dashboard';
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  // Admin route protection — check against ADMIN_EMAIL or default admin
  if (pathname.startsWith('/admin') && user) {
    const adminEmail = process.env.ADMIN_EMAIL || 'shreedharshiragurr@gmail.com';
    const isAuthorizedAdmin =
      user.email === adminEmail ||
      user.email === 'shreedharshiragurr@gmail.com' ||
      user.id === 'admin_shreedhar';

    if (!isAuthorizedAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - API routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
