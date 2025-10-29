import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - this is important for maintaining auth state
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // If refresh token is missing/invalid, clear cookies and force re-auth
      if (
        error?.code === "refresh_token_not_found" ||
        error?.message?.toLowerCase?.().includes("refresh token")
      ) {
        const signInUrl = new URL("/signin", request.url);
        // Ensure HTTP for localhost
        if (
          request.nextUrl.hostname === "localhost" ||
          request.nextUrl.hostname === "127.0.0.1"
        ) {
          signInUrl.protocol = "http:";
        }
        const response = NextResponse.redirect(signInUrl);
        // Proactively clear potential stale auth cookies
        response.cookies.delete("sb-access-token");
        response.cookies.delete("sb-refresh-token");
        return response;
      }
      // For other auth errors, proceed as unauthenticated
    }
    user = data?.user ?? null;
  } catch (e) {
    // On unexpected failures, treat as unauthenticated and clear cookies
    const signInUrl = new URL("/signin", request.url);
    // Ensure HTTP for localhost
    if (
      request.nextUrl.hostname === "localhost" ||
      request.nextUrl.hostname === "127.0.0.1"
    ) {
      signInUrl.protocol = "http:";
    }
    const response = NextResponse.redirect(signInUrl);
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
    return response;
  }

  // Protected routes check
  const protectedRoutes = ["/dashboard", "/upload"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    // Ensure HTTP for localhost
    if (
      request.nextUrl.hostname === "localhost" ||
      request.nextUrl.hostname === "127.0.0.1"
    ) {
      redirectUrl.protocol = "http:";
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from signin page
  if (user && request.nextUrl.pathname === "/signin") {
    const dashboardUrl = new URL("/dashboard", request.url);
    // Ensure HTTP for localhost
    if (
      request.nextUrl.hostname === "localhost" ||
      request.nextUrl.hostname === "127.0.0.1"
    ) {
      dashboardUrl.protocol = "http:";
    }
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
