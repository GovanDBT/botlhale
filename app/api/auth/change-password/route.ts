// app/api/auth/change-password/route.ts
// api endpoint for changing user password
import { NextResponse } from "next/server";
import { createClient } from "@/services/supabase/server";
import { loginSchema} from "@/lib/validationSchema";
import { serverInstance } from "@/services/rollbar/rollbar";
import { adminAuthClient } from "@/services/supabase/admin";
import getUnexpectedError from "@/utils/getUnexpectedError";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword, confirmPassword } = body;

    // Validate inputs (email and password)
    const result = loginSchema.safeParse({ email, newPassword, confirmPassword });
    // if input validation fails
    if (!result.success) {
      serverInstance.error('Change password input validation failed')
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // // initiate supabase server client
    const supabase = await createClient();

    // Fetch user by email
    const { data: userData, error: userError } = await supabase
      .from("profile")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: "User email does not exist, please verify email" },
        { status: 404 }
      );
    }

    // Update password via admin API
    const { error: updateError } = await adminAuthClient.updateUserById(
        userData.id,
        { password: newPassword }
    );

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. Please log in again.",
    });

  } catch (error) {
    // handle unexpected errors
    getUnexpectedError(error);
  }
}
