import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// Handles the OAuth callback from Supabase after Google login
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // If Supabase returned an error (e.g. failed to exchange Google code),
  // redirect back to login with the error message so we can see it
  if (error) {
    console.error("[auth/callback] Supabase OAuth error:", error, errorDescription);
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("error", errorDescription ?? error);
    return NextResponse.redirect(loginUrl);
  }

  // Create the redirect response first so we can attach cookies to it
  const redirectTo = new URL("/dashboard", request.url);
  const response = NextResponse.redirect(redirectTo);

  if (code) {
    // IMPORTANT: cookies must be set on `response`, not on `cookieStore`.
    // In Next.js 15 Route Handlers, cookieStore.set() doesn't write
    // Set-Cookie headers to the browser — response.cookies.set() does.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
