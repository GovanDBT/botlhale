/**
 * An API route for creating a new school
 * TODO: check if school email or phone already exists
 * TODO: make it so only authenticated users can insert school (RLS)
 */
import { NextRequest, NextResponse } from "next/server";

import { schoolSchema } from "@/app/validationSchema";
import { fetchUserRoleFromSession } from "@/utils/getUserRole";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json(); // create a new body object

  // TODO: find different way to access token
  const accessToken = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized access!" },
      { status: 401 }
    );
  }

  // Fetch the current user's role
  const userRole = await fetchUserRoleFromSession(accessToken);

  // If user is not superAdmin, throw an error
  if (userRole !== "superAdmin") {
    return NextResponse.json(
      { error: "Unauthorized access!" },
      { status: 401 }
    );
  }
  console.log("User is superAdmin");

  const validation = schoolSchema.safeParse(body); // validate body

  // If validation fails, show error
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
  console.log("Input validation successful");

  const supabase = await createClient(accessToken); // initialize Supabase client on the server

  console.log(body.name);

  // Check if the school already exists
  const { data: schoolName, error: schoolError } = await supabase
    .from("school")
    .select("name")
    .eq("name", body.name)
    .maybeSingle();

  console.log(schoolName?.name);

  if (schoolError) {
    console.error("Error querying school name:", schoolError.message);
    return NextResponse.json(
      { error: "Failed to verify school name!" },
      { status: 400 }
    );
  }

  if (schoolName?.name) {
    console.log("School name already exists:", schoolName?.name);
    return NextResponse.json(
      { error: "School name already exists!" },
      { status: 400 }
    );
  }
  console.log("School name is unique");

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
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting school:", error.message);
    return NextResponse.json(
      { error: "Failed to create school!" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "School created successfully!" });
}
