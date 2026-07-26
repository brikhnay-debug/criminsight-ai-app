import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Route prefixes that require a signed-in user.
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/chat',
  '/theories',
  '/cases',
  '/documents',
  '/flashcards',
  '/quiz',
  '/notes',
  '/settings',
];

// Auth pages a signed-in user shouldn't see again.
const AUTH_PREFIXES = ['/login', '/signup', '/reset-password', '/update-password'];

function matchesPrefix(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: do not remove this call. It refreshes the auth token and
  // must run before any other logic that depends on the user's session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => matchesPrefix(path, prefix));
  const isAuthRoute = AUTH_PREFIXES.some((prefix) => matchesPrefix(path, prefix));

  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
