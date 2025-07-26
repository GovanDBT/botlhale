import { fetchUserRoleFromSession } from "@/utils/getUserRole";
import { NextRequest, NextResponse } from "next/server";
import { serverInstance } from "@/services/rollbar/rollbar";
import { adminSchema } from "@/lib/validationSchema";
import { createClient } from "@/services/supabase/server";
import { generateUserId } from "@/lib/generateUserId";
import { createServerClient } from "@/services/supabase/serviceRole";

export async function POST(request: NextRequest) {
  // create a new body request
  const body = await request.json();

  // grabs our current access token - postman testing
  // const accessToken = request.headers
  //   .get("Authorization")
  //   ?.replace("Bearer ", "");

  // if no access token - postman testing
  // if (!accessToken) {
  //   return NextResponse.json(
  //     { error: "Unauthorized access!" },
  //     { status: 403 }
  //   );
  // }

  // initialize supabase server client
  const client = await createClient();

  // grab user session
  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  // if api fails to retrieve user session
  if (sessionError) {
    serverInstance.info("System failed to get user session", { sessionError });
    return NextResponse.json(
      { error: "System failed to get user session" },
      { status: 400 }
    );
  }

  // get access token
  const accessToken = session?.access_token;

  // if api fails to retrieve user access token
  if (!accessToken) {
    serverInstance.info("System failed to provide access token");
    return NextResponse.json(
      { error: "No access token provided" },
      { status: 400 }
    );
  }

  // Fetch the current user's role
  const userRole = await fetchUserRoleFromSession(accessToken);

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
    serverInstance.warning(
      "System failed to validate admin schema",
      validation.error
    );
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // initialize Supabase client on the server
  const supabase = await createClient(accessToken);

  // Get user data to check if user already exists
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // if system fails to verify user data
  if (userError) {
    serverInstance.info("System failed to verify user", { userError });
    return NextResponse.json(
      { error: "System failed to verify user" },
      { status: 500 }
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
    .eq("id", body.school_id)
    .maybeSingle();

  // if system fails to verify school
  if (schoolError) {
    serverInstance.error("System failed to get school ID", schoolError);
    return NextResponse.json(
      { error: "Failed to get and verify school ID" },
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

  // register user
  let { data: newUser, error: newUserError } = await supabase.auth.signUp({
    phone: body.phone,
    email: body.email,
    password: userId,
  });

  // fails to register user
  if (newUserError) {
    serverInstance.error("system failed to register user", newUserError);
    return NextResponse.json(
      { error: "User registration failed" },
      { status: 500 }
    );
  }

  // create profile
  const { error } = await supabase
    .from("profile")
    .insert([
      {
        id: newUser.user?.id,
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        phone: body.phone,
        user_id: userId,
        school_id: body.school_id,
        role: "admin",
        user_status: "invited",
      },
    ])
    .select();

  // fails to create profile
  if (error) {
    serverInstance.error("System failed to register user profile", error);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    );
  }

  // init service role key client
  const serviceRole = createServerClient();

  // send invite email
  const { error: inviteError } = await serviceRole.auth.admin.inviteUserByEmail(
    body.email
  );

  // if email invite fails
  if (inviteError) {
    serverInstance.error("System failed to send email invite", inviteError);
    return NextResponse.json(
      { error: "Failed to send invite email" },
      { status: 500 }
    );
  }

  // send success response
  return NextResponse.json(
    { message: "Admin successfully registered" },
    { status: 201 }
  );
}
