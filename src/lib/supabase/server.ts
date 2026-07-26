import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for use on the server (Server Components,
 * Server Actions, Route Handlers). Session cookies are read from and
 * written back to the Next.js cookie store so the user's session
 * persists across requests.
 *
 * NOTE: Writing cookies from a Server Component will throw (Next.js
 * disallows it) — that's expected and safe to ignore here, because our
 * middleware (see lib/supabase/middleware.ts) refreshes the session
 * cookie on every request anyway.
 */
export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — safe to ignore.
            // Middleware handles refreshing the session cookie instead.
          }
        },
      },
    }
  );
}
