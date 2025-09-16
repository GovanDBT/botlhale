// app/api/auth/login/route.ts
// login api
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/services/supabase/server";
import { loginSchema } from "@/lib/validationSchema";
import * as Sentry from "@sentry/nextjs";
import getUnexpectedError from "@/utils/getUnexpectedError";

export async function POST(request: NextRequest) {
  try {
    // create a new body
    const body = await request.json();
    const { email, password } = body;

    // Validate body
    const validate = loginSchema.safeParse({ email, password });

    // if validation fails
    if (!validate.success) {
      return NextResponse.json(
        { success: false, error:  validate.error.format() || "Invalid credentials" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Attempt login
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    
    // if login fails
    if (signInError) {
      return NextResponse.json(
        {
          success: false,
          error: "Incorrect Email or Password, Please verify your credentials",
        },
        { status: 401 }
      );
    }
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("profile_role, profile_id, school, profile_status")
      .eq("email", email)
      .single();

    // if user profile does not exist or fails to fetch user profile
    if (profileError || !profile) {
      Sentry.captureException(`Profile Error: ${profileError.message}`)
      return NextResponse.json(
        {
          success: false,
          error:
            `Profile Error: ${profileError.message}` || "Profile not found. Please contact support.",
        },
        { status: 404 }
      );
    }

    // Check if password equals user_id AFTER successful login
    if (password === profile.profile_id) {
      return NextResponse.json({
        success: false,
        forcePasswordChange: true,
      });
    }

    let redirectPath = "";

    // redirect user to their dashboard
    if (profile.profile_role !== "superAdmin") {
      // fetch school ID
      const { data: school, error: schoolError } = await supabase
        .from("school")
        .select("id")
        .eq("id", profile.school)
        .single();
  
      if (schoolError) {
        Sentry.captureException(`Profile Error: ${schoolError.message}`)
        return NextResponse.json({
          success: false,
          error: `School Error: ${schoolError.message}` || "Unable to find your school at the moment, please try again later",
        },
        { status: 404 }
      )}

      if (profile.profile_role === "student") redirectPath = `/dashboard/student`;
      else if (profile.profile_role === "schoolAdmin") redirectPath = `/dashboard/${school?.id}`;
      else if (profile.profile_role === "teacher") redirectPath = "/dashboard/teacher";
      else if (profile.profile_role === "guardian") redirectPath = "/dashboard/guardian";
      else {
        Sentry.captureMessage('Unknown role tried to login', "warning")
        return NextResponse.json(
          { success: false, error: "Cannot login. User role is unauthorized" },
          { status: 401 }
        );
      }
    } else {
      redirectPath = "/dashboard/admin"
    }

    // response
    return NextResponse.json({
      success: true,
      redirectPath,
      message: "Login Successful",
    });

  } catch (error) {
    // handle unexpected errors
    getUnexpectedError(error);
  }
}
