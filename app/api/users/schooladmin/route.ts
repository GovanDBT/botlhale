// app/api/users/schooladmin/route.ts
// school admin response api's
import { getUserRole } from "@/utils/getUserRole";
import { NextRequest, NextResponse } from "next/server";
import { schoolAdminSchema } from "@/lib/validationSchema";
import { createClient } from "@/services/supabase/server";
import { generateUserId } from "@/lib/generateUserId";
import * as Sentry from "@sentry/nextjs";
import { adminAuthClient } from "@/services/supabase/admin";

// POST /schooladmin - create new school admin
export async function POST(request: NextRequest) {
  try {
    // create a new body request
    const body = await request.json();

    // grabs our current access token - postman testing
    let accessToken = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    // initialize Supabase client on the server
    let supabase = await createClient();

    // if no access token, grab token from session - client-side path
    if (!accessToken) {
      // grab user session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // if api fails to retrieve user session
      if (sessionError) {
        Sentry.captureException(`Session error: ${sessionError.message}`)
        return NextResponse.json(
          { error: `Session error: ${sessionError.message}` || "Failed to fetch user session" },
          { status: sessionError.status }
        );
      }

      // get access token from session and assign to accessToken
      accessToken = session?.access_token;
    
      // if no access token was provided
      if (!accessToken) {
        Sentry.captureMessage("System fails to provide access token", "error")
        return NextResponse.json(
          { error: "No access token provided" },
          { status: 409 }
        );
      }
    }
  
    // Fetch the current user's role
    const userRole = await getUserRole(accessToken);

    // If user is not superAdmin, throw an error
    if (userRole !== "superAdmin") {
      Sentry.captureMessage("An unauthorized users tried to create admin user", "warning")
      return NextResponse.json(
        { error: "Unauthorized access!" },
        { status: 403 }
      );
    }

    //validate body
    const validation = schoolAdminSchema.safeParse(body);

    // If validation fails, show error
    if (!validation.success) {
      return NextResponse.json(validation.error.format() || "Invalid input data", { status: 400 });
    }

    // initialize Supabase client with access
    supabase = await createClient(accessToken);

    // Get user data (email and phone) to check if user already exists
    const { data: user, error: userError } = await supabase
      .from("profile")
      .select('email, phone')
      .eq('email', body.email)
      .maybeSingle();

    // if system fails to verify user data
    if (userError) {
      Sentry.captureException(`Profile Error: ${userError.message}`)
      return NextResponse.json(
        { error: `Profile Error: ${userError.message}` || "Failed to fetch user profile" },
        { status: 404 }
      );
    }

    // check if email or user already exists
    if (user?.email === body.email) {
      return NextResponse.json(
        { error: "Email address already exists!" },
        { status: 409 }
      );
    }

    // check if phone or user already exists
    if (user?.phone === body.phone) {
      return NextResponse.json(
        { error: "Phone address already exists!" },
        { status: 409 }
      );
    }

    // get school
    const { data: school, error: schoolError } = await supabase
      .from("school")
      .select("id")
      .eq("id", body.school)
      .maybeSingle();

    // if system fails to verify school
    if (schoolError) {
      Sentry.captureException(`School Error: ${schoolError.message}`);
      return NextResponse.json(
        { error: `School Error: ${schoolError.message}` || "Failed to fetch school id" },
        { status: 500 }
      );
    }

    // if school ID does not exist
    if (!school) {
      Sentry.captureMessage("School does not exist", "warning");
      return NextResponse.json(
        { error: "School does not exist" },
        { status: 404 }
      );
    }

    // generates a new school admin ID
    const userId = await generateUserId("schoolAdmin");

    // if user ID not generated
    if (!userId) {
      Sentry.captureMessage("System failed to generate user ID", "fatal")
      return NextResponse.json(
        { error: "Failed to generate user ID. Please try again later." },
        { status: 500 }
      );
    }

    // invite new user via email
    let { data: invitedUser, error: inviteError } = await adminAuthClient.inviteUserByEmail(body.email, { 
      redirectTo: "http://localhost:3000/reset-password",
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        school: body.school,
        email: body.email,
        phone: body.phone,
        profile_role: "schoolAdmin",
        profile_id: userId,
        profile_status: "invited",
        display_name: `${body.firstname} ${body.lastname}`
      },
    });

    // if invite fails
    if (inviteError) {
      Sentry.captureException(`Invite Error: ${inviteError.message}`)
      return NextResponse.json(
        { success: false, error: `Invite Error: ${inviteError.message}` || "Failed to send invite" },
        { status: inviteError.status }
      );
    }

    // update the phone field in auth.users
    if (invitedUser?.user?.id) {
      const { error: updateError } = await adminAuthClient.updateUserById(invitedUser.user.id, {
        phone: body.phone
      });

      // if phone update fails
      if (updateError) {
        Sentry.captureException(`Auth Phone Update Error: ${updateError.message}`)
        return NextResponse.json(
          { success: false, error: `Auth Phone Update Error: ${updateError.message}` || "Failed to update phone in auth.users" },
          { status: updateError.status }
        );
      }
    }

    // send success response
    return NextResponse.json(
      { message: "School Admin successfully registered" },
      { status: 201 }
    );
  } catch (error: any) {
    Sentry.captureException(`Post School Admin Server Error: ${error.message}`)
    return NextResponse.json(
      { error: `Server error: ${error.message}`, },
      { status: error.status }
    );
  }
  
}

// DELETE /admin - delete admin
export async function DELETE(request: NextRequest) {
  try {
    // create a new body request
    const body = await request.json();
    const { ids } = body; // expecting { "ids": [1,2,3] }

    // if no id's are empty
    if (!ids || ids.length === 0 ) {
      return NextResponse.json(
        { error: "No IDs provided for deletion" },
        { status: 400 }
      )
    }
    
    // delete user(s)
    const { data, error } = await adminAuthClient.deleteUser(ids);

    // error response
    if (error) {
      console.error(`Supabase Delete error: ${error.message}`);
      return NextResponse.json(
        { success: false, error:`Supabase Delete error: ${error.message}` },
        { status: error.status }
      )
    }

    // success response
    return NextResponse.json(
      { success: true, message: `${ids.length} Admin(s) Successfully Deleted`, data},
      { status: 200 }
    )
  } catch (error) {
    console.error("Bulk delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete admins" },
      { status: 500 }
    );
  }
}
