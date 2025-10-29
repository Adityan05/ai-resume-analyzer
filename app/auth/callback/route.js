import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", { error, errorDescription });
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(
        errorDescription || "Authentication failed"
      )}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (!exchangeError) {
      // Authentication successful - now create user credits if they don't exist
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Check if user already has credits
          const { data: existingCredits } = await supabase
            .from("user_credits")
            .select("credits")
            .eq("user_id", user.id)
            .single();

          // Create credits if they don't exist
          if (!existingCredits) {
            await supabase
              .from("user_credits")
              .insert({ user_id: user.id, credits: 500 });
          }
        }
      } catch (creditError) {
        console.error("Error creating user credits:", creditError);
        // Don't fail authentication if credit creation fails
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      // Ensure HTTP for localhost even in production builds
      const url = new URL(origin);
      const isLocalhost =
        url.hostname === "localhost" || url.hostname === "127.0.0.1";

      if (isLocalhost) {
        // Force HTTP for localhost to avoid SSL issues
        return NextResponse.redirect(`http://${url.host}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      console.error(
        "Supabase auth exchangeCodeForSession error:",
        exchangeError
      );
      return NextResponse.redirect(
        `${origin}/auth/error?message=${encodeURIComponent(
          exchangeError.message || "Authentication failed"
        )}`
      );
    }
  }

  // Return error page if no code is present
  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent(
      "No authorization code received"
    )}`
  );
}
