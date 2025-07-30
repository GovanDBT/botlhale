// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/services/supabase/server";
import { loginSchema } from "@/lib/validationSchema";
import { serverInstance } from "@/services/rollbar/rollbar";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      serverInstance.error("Login input validation failed");
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("role, user_id, school_id")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Profile not found. Please contact support.",
        },
        { status: 404 }
      );
    }

    // Attempt login FIRST
    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Incorrect Email or Password, Please verify your credentials",
        },
        { status: 401 }
      );
    }

    // Check if password equals user_id AFTER successful login
    if (password === profile.user_id) {
      return NextResponse.json({
        success: false,
        forcePasswordChange: true,
      });
    }

    const { data: school, error: schoolError } = await supabase
      .from("school")
      .select("id")
      .eq("id", profile.school_id)
      .single();

    // Determine redirect path
    let redirectPath = "/dashboard/student";
    if (profile.role === "superAdmin") redirectPath = "/dashboard/superAdmin";
    else if (profile.role === "admin") redirectPath = `/dashboard/${school?.id}`;
    else if (profile.role === "teacher") redirectPath = "/dashboard/teacher";
    else if (profile.role === "parent") redirectPath = "/dashboard/parent";

    return NextResponse.json({
      success: true,
      redirectPath,
      message: "Login Successful",
    });
  } catch (err: any) {
    serverInstance.critical("System failed to log in a user", err);
    return NextResponse.json(
      { success: false, error: "Server error occurred" },
      { status: 500 }
    );
  }
}
