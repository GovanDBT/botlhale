/**
 * An API routes for schools
 */
import { NextRequest, NextResponse } from "next/server";
import { schoolSchema } from "@/lib/validationSchema";
import { getUserRole } from "@/utils/getUserRole";
import { createClient } from "@/services/supabase/server";
import { serverInstance } from "@/services/rollbar/rollbar";

// API request for create a school
export async function POST(request: NextRequest) {
  const body = await request.json(); // create a new body object

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
  const userRole = await getUserRole(accessToken);

  // If user is not superAdmin, throw an error
  if (userRole !== "superAdmin") {
    serverInstance.warning("An unauthorized users tried to create a school", {
      accessToken,
      userRole,
    });
    return NextResponse.json(
      { error: "Unauthorized access!" },
      { status: 401 }
    );
  }

  // validate body
  const validation = schoolSchema.safeParse(body);

  // If validation fails, show error
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const supabase = await createClient(accessToken); // initialize Supabase client on the server

  // Check if the school name already exists
  const { data: schoolName, error: nameError } = await supabase
    .from("school")
    .select("name")
    .eq("name", body.name)
    .maybeSingle();

  if (nameError) {
    serverInstance.info("System failed to verify school name", { nameError });
    return NextResponse.json(
      { error: "Failed to verify school name!" },
      { status: 400 }
    );
  }

  if (schoolName?.name) {
    return NextResponse.json(
      { error: "School name already exists!" },
      { status: 400 }
    );
  }

  // check if the school email already exists
  const { data: schoolEmail, error: emailError } = await supabase
    .from("school")
    .select("email")
    .eq("email", body.email)
    .maybeSingle();

  if (emailError) {
    serverInstance.info("System failed to verify school email", { emailError });
    return NextResponse.json(
      { error: "Failed to verify school email" },
      { status: 400 }
    );
  }

  if (schoolEmail) {
    return NextResponse.json(
      { error: "School email already exists" },
      { status: 400 }
    );
  }

  // check if the school phone already exists
  const { data: schoolPhone, error: phoneError } = await supabase
    .from("school")
    .select("phone")
    .eq("phone", body.phone)
    .maybeSingle();

  if (phoneError) {
    serverInstance.info("System failed to verify school phone", { phoneError });
    return NextResponse.json(
      { error: "Failed to verify school phone" },
      { status: 400 }
    );
  }

  if (schoolPhone) {
    return NextResponse.json(
      { error: "School phone already exists" },
      { status: 400 }
    );
  }

  // grabs the current users data
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    serverInstance.info("System failed to get user id", { userError });
    return NextResponse.json(
      { error: "Failed to get user ID", userError },
      { status: 400 }
    );
  }

  // Insert the school into the database
  const { error } = await supabase
    .from("school")
    .insert([
      {
        name: body.name,
        description: body.description,
        email: body.email,
        phone: body.phone,
        location: body.location,
        created_by: user?.id,
      },
    ])
    .select();

  if (error) {
    serverInstance.error("System failed to create school", { error });
    return NextResponse.json(
      { error: "Failed to create school!" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "School created successfully!" });
}

// API request for retrieving all schools
export async function GET() {
  // initialize supabase
  const supabase = await createClient();

  // get all schools
  const { data, error } = await supabase
    .from("school")
    .select("*")
    .order("name");

  // fails to retrieve schools
  if (error) {
    serverInstance.error("System failed to fetch all schools", { error });
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 400 }
    );
  }

  // retrieved schools
  return NextResponse.json(data);
}
