// app/api/users/schooladmin/route.ts
// school admin response api's
import { getUserRole } from "@/utils/getUserRole";
import { NextRequest, NextResponse } from "next/server";
import { schoolAdminSchema, updateSchoolAdminSchema } from "@/lib/validationSchema";
import { createClient } from "@/services/supabase/server";
import { generateUserId } from "@/lib/generateUserId";
import * as Sentry from "@sentry/nextjs";
import { adminAuthClient } from "@/services/supabase/admin";
import { getAccessToken } from "@/utils/getAccessToken";

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
      { error: `Server error: ${error?.message || "An unexpected error has occurred"}`, },
      { status: error?.status || 500 }
    );
  }
  
}

// DELETE /schooladmin - delete school admin
export async function DELETE(request: NextRequest) {
  try {
    // create a new body request
    const body = await request.json();
    const { ids } = body; // expecting { "ids": [1,2,3] }

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
      Sentry.captureMessage("An unauthorized users tried to delete school admin", "warning")
      return NextResponse.json(
        { error: "Unauthorized access!" },
        { status: 403 }
      );
    }

    // if no id's are empty
    if (!ids || ids.length === 0 ) {
      Sentry.captureMessage("School Admin Delete: No IDs provided for deletion", "debug")
      return NextResponse.json(
        { error: "No IDs provided for deletion" },
        { status: 400 }
      )
    }
    
    // iterate through each user ids - for bulk or single delete
    for (let id of ids) {
      // delete user
      const { error } = await adminAuthClient.deleteUser(id);

      // error response
      if (error) {
        Sentry.captureException(`School Admin Delete error: ${error.message}`);
        return NextResponse.json(
          { success: false, error:`School Admin Delete error: ${error.message}` },
          { status: error?.status }
        )
      }
    }

    // success response
    return NextResponse.json(
      { success: true, message: `${ids.length} School Admin(s) Successfully Deleted`},
      { status: 200 }
    )
  } catch (error: any) {
    Sentry.captureException(`School Admin Delete Server Error: ${error.message}`);
    return NextResponse.json(
      { error: "Failed to delete school admins" },
      { status: 500 }
    );
  }
}

// PATCH /schooladmin - update school admin
export async function PATCH(request: NextRequest) {
  try {
    // create a new body request
    const body = await request.json();
    const { id, firstname, lastname, school } = body

    // get current users access token
    const accessToken = await getAccessToken(request)
  
    // get the current user's role
    const userRole = await getUserRole(accessToken.toString());

    // If user is not superAdmin, throw an error
    if (userRole !== "superAdmin") {
      Sentry.captureMessage("An unauthorized users tried to update school admin", "warning")
      return NextResponse.json(
        { error: "Unauthorized access!" },
        { status: 403 }
      );
    }

    //validate body
    const validation = updateSchoolAdminSchema.safeParse(body);

    // If validation fails, show error
    if (!validation.success) {
      return NextResponse.json(validation.error.format() || "Invalid input data", { status: 400 });
    }

    // initialize Supabase client with access
    const supabase = await createClient(accessToken.toString());

    // get users profile
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('id, firstname, lastname, school')
      .eq('id', id)
      .single();
    
      // if profile error
    if (profileError) {
      Sentry.captureException(`Profile Error: ${profileError.message}`);
      return NextResponse.json(
        { error: `Profile Error: ${profileError.message}` || "User does not exist" },
        { status: 404 }
      );
    }

    // if no updates were made
    if(profile.firstname === firstname && profile.lastname === lastname && profile.school === school) {
      return NextResponse.json(
        { error: "No updates were made" },
        { status: 406 }
      );
    }

    // update user
    const { error: updateError } = await adminAuthClient.updateUserById(
      id,
      { user_metadata: {
        firstname: firstname,
        lastname: lastname,
        school: school,
        display_name: `${firstname} ${lastname}`
      }}
    )

    // if update fails
    if (updateError) {
      Sentry.captureException(`Update School Admin Error: ${updateError.message}`);
      return NextResponse.json(
        { error: `Update School Admin Error: ${updateError.message}` || "Failed to update user" },
        { status: 404 }
      );
    }

    // if update succeed - send response
    return NextResponse.json(
      { message: "School Admin successfully updated" },
      { status: 200 }
    );
  } catch (error: any) {
    Sentry.captureException(`Update School Admin Server Error: ${error.message}`)
    return NextResponse.json(
      { error: `Server error: ${error?.message || "An unexpected error has occurred"}`, },
      { status: error?.status || 500 }
    );
  }
}
