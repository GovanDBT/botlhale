// app/api/users/admin/route.ts
// admin response api's
import { getUserRole } from "@/utils/getUserRole";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "@/services/rollbar/rollbar";
import { adminSchema } from "@/lib/validationSchema";
import { createClient } from "@/services/supabase/server";
import { generateUserId } from "@/lib/generateUserId";
import { adminAuthClient } from "@/services/supabase/admin";

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
        serverInstance.info(`Session error: ${sessionError.message}`);
        return NextResponse.json(
          { error: `Session error: ${sessionError.message}` || "Failed to fetch user session" },
          { status: sessionError.status }
        );
      }

      // get access token from session and assign to accessToken
      accessToken = session?.access_token;
    
      // if no access token was provided
      if (!accessToken) {
        serverInstance.info("System failed to provide access token");
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
      serverInstance.warning("An unauthorized users tried to create admin user", {
        accessToken,
        userRole,
      });
      return NextResponse.json(
        { error: "Unauthorized access!" },
        { status: 403 }
      );
    }

    //validate body
    const validation = adminSchema.safeParse(body);

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
      serverInstance.error(`Verify User Profile Error: ${userError.message}`);
      return NextResponse.json(
        { error: `Verify User Profile Error: ${userError.message}` || "Failed to fetch user profile" },
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
      serverInstance.error(`School Error: ${schoolError.message}`);
      return NextResponse.json(
        { error: `School Error: ${schoolError.message}` || "Failed to fetch school id" },
        { status: 500 }
      );
    }

    // if school ID does not exist
    if (!school) {
      serverInstance.info("School ID that does not exist was submitted");
      return NextResponse.json(
        { error: "School does not exist" },
        { status: 404 }
      );
    }

    // generates a new admin ID
    const userId = await generateUserId("admin");

    // if user ID not generated
    if (!userId) {
      serverInstance.error("System failed to generate user ID");
      return NextResponse.json(
        { error: "Failed to generate user ID. Please try again later." },
        { status: 500 }
      );
    }

    // ----------- Begin pseudo-transaction -----------
    
    let createdAuthUserId;

    try {
      let { error: inviteError } = await adminAuthClient.inviteUserByEmail(body.email, { 
        redirectTo: "http://localhost:3000/reset-password",
        data: {
          firstname: body.firstname,
          lastname: body.lastname,
          user_id: userId,
          school: body.school_id,
          email: body.email,
          phone: body.phone,
          role: "admin",
          user_status: "invited",
          display_name: `${body.firstname} ${body.lastname}`
        },
      });

      if (inviteError) {
        throw new Error(inviteError.message || "Failed to send invite email");
      }
      // register user
      // let { data: newUser, error: newUserError } = await adminAuthClient.createUser({
      //   phone: body.phone,
      //   email: body.email,
      //   password: userId,
      //   email_confirm: true,
      //   user_metadata: {
      //     display_name: body.firstname + " " + body.lastname
      //   }
      // });
    
      // fails to register user
      // if (newUserError) {
      //   throw new Error(newUserError.message || "Failed to signup user");
      // }

      // createdAuthUserId = invite.user?.id;
    
      // create profile
      // const { error: profileError } = await supabase
      //   .from("profile")
      //   .insert([
      //     {
      //       id: createdAuthUserId,
      //       firstname: body.firstname,
      //       lastname: body.lastname,
      //       email: body.email,
      //       phone: body.phone,
      //       user_id: userId,
      //       school_id: body.school_id,
      //       role: "admin",
      //       user_status: "invited",
      //     },
      //   ])
      //   .select();
    
      // fails to create profile
      // if (profileError) {
      //   throw new Error(profileError.message || "Failed to create user profile");
      // }
    
      // send reset password email
      // const { error: resetPasswordError } = await supabase.auth
      //   .resetPasswordForEmail(body.email, { redirectTo: 'http://localhost:3000/reset-password' });

      // if (resetPasswordError) {
      //   throw new Error(resetPasswordError.message || "Failed to send reset password email");
      // }

      // send success response
      return NextResponse.json(
        { message: "Admin successfully registered" },
        { status: 201 }
      );
      
    } catch (error: any) {
      // Rollback: delete created Auth user if something failed
      if (createdAuthUserId) {
        await adminAuthClient.deleteUser(createdAuthUserId);
      }

      return NextResponse.json(
        { error: `User Registration Error: ${error.message}` },
        { status: 500 }
      );
    }

    // ----------- End pseudo-transaction -----------

  } catch (error: any) {
    serverInstance.critical("System failed to log in a user", error);
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}`, },
      { status: 500 }
    );
  }
  
}
