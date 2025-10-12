import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * POST /api/setup-user - Create credits for existing users
 * This is a temporary endpoint to help existing users get credits
 */
export async function POST(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user already has credits
    const { data: existingCredits } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single();

    if (existingCredits) {
      return NextResponse.json({
        message: "User already has credits",
        credits: existingCredits.credits,
      });
    }

    // Create credits for the user
    const { data, error } = await supabase
      .from("user_credits")
      .insert({ user_id: user.id, credits: 500 })
      .select("credits")
      .single();

    if (error) {
      console.error("Error creating user credits:", error);
      return NextResponse.json(
        { error: "Failed to create credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Credits created successfully",
      credits: data.credits,
    });
  } catch (error) {
    console.error("Setup user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
