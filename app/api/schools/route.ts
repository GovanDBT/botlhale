// app/api/schools/route.ts
// schools response api's - POST, GET
// TODO: reduce frequent calls to the supabase while checking school name, email, and phone
import { NextRequest, NextResponse } from "next/server";
import { schoolSchema } from "@/lib/validationSchema";
import { getUserRole } from "@/utils/getUserRole";
import { createClient } from "@/services/supabase/server";
import * as Sentry from "@sentry/nextjs";
import { generateSchoolId } from "@/lib/generateSchoolId";
import { getAccessToken } from "@/utils/getAccessToken";

// GET /schools - retrieves all schools
export async function GET() {
  try {
    // initialize supabase server client
    const supabase = await createClient();

    // get all schools - join with profile
    const { data, error } = await supabase
      .from("school")
      .select("*, profile:created_by(firstname, lastname)")
      .order("name");

    // if fetch fails
    if (error) {
      Sentry.captureException(`Schools Error: ${error.message}`); // log to Sentry
      return NextResponse.json(
        { success: false, error: `Schools Error: ${error.message}` || "Failed to fetch schools" }, // log to client
        { status: 404 }
      );
    }

    // response
    return NextResponse.json(data);

  } catch (error: any) {
    // any unexpected error
    Sentry.captureException(`Schools Server Error: ${error.message}`); // log to Sentry
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}`, }, // log to client
      { status: error.status }
    );
  }
}

// POST /schools - creates a new school
export async function POST(request: NextRequest) {
  try {
    // create a new body request
    const body = await request.json();

    // get current users access token
    const accessToken = await getAccessToken(request);

    // Fetch the current user's role
    const userRole = await getUserRole(accessToken.toString());

    // If user is not superAdmin, throw an error
    if (userRole !== "superAdmin") {
      Sentry.captureMessage("An unauthorized users tried to create school", "warning")
      return NextResponse.json(
        { error: "Unauthorized access!" },
        { status: 403 }
      );
    }

    // validate input body
    const validation = schoolSchema.safeParse(body);

    // If validation fails, show error
    if (!validation.success)
      return NextResponse.json(validation.error.format() || "Invalid input data", { status: 400 });

    // initialize Supabase client with access token
    const supabase = await createClient(accessToken.toString()); 

    // fetch school by name
    const { data: schoolName, error: schoolNameError } = await supabase
      .from("school")
      .select("name")
      .eq("name", body.name)
      .maybeSingle();

    // if database error
    if (schoolNameError) {
      Sentry.captureException(`School Name Error: ${schoolNameError.message}`);
      return NextResponse.json(
        { error: `School Name Error: ${schoolNameError.message}` || "Failed to fetch school name" },
        { status: 500 }
      );
    }

    // if school name already exists, throw error
    if (schoolName?.name === body.name) {
      return NextResponse.json(
        { error: "School name already exists! Please try a different school name" },
        { status: 403 }
      );
    }

    // fetch school by email
    const { data: schoolEmail, error: schoolEmailError } = await supabase
      .from("school")
      .select("email")
      .eq("email", body.email)
      .maybeSingle();

    // if database error
    if (schoolEmailError) {
      Sentry.captureException(`School Email Error: ${schoolEmailError.message}`);
      return NextResponse.json(
        { error: `School Email Error: ${schoolEmailError.message}` || "Failed to fetch school email" },
        { status: 500 }
      );
    }

    // if school email already exists, throw error
    if (schoolEmail?.email === body.email) {
      return NextResponse.json(
        { error: "School email already exists! Please try a different school email address" },
        { status: 403 }
      );
    }

    // fetch school by phone
    const { data: schoolPhone, error: schoolPhoneError } = await supabase
      .from("school")
      .select("phone")
      .eq("phone", body.phone)
      .maybeSingle();

    // if database error
    if (schoolPhoneError) {
      Sentry.captureException(`School Phone Error: ${schoolPhoneError.message}`);
      return NextResponse.json(
        { error: `School Phone Error: ${schoolPhoneError.message}` || "Failed to fetch school phone" },
        { status: 500 }
      );
    }

    // if phone number exists, throw error
    if (schoolPhone?.phone === body.phone) {
      return NextResponse.json(
        { error: "School phone already exists! Please try a different school phone number" },
        { status: 403 }
      );
    }

    // grabs the current users data
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // if database fails
    if (userError) {
      Sentry.captureException(`User Error: ${userError.message}`);
      return NextResponse.json(
        { error: `User Error: ${userError.message}` || "Failed to fetch current user" },
        { status: userError.status }
      );
    }

    // generates a new school ID
    const schoolId = await generateSchoolId();

    // Insert the school into the database
    const { error } = await supabase
      .from("school")
      .insert([
        {
          id: schoolId,
          name: body.name,
          school_level: body.level,
          email: body.email,
          phone: body.phone,
          location: body.location,
          school_type: body.type,
          description: body.description,
          created_by: user?.id,
        },
      ])
      .select();

    // if database error
    if (error) {
      Sentry.captureException(`Insert School Error: ${error.message}`);
      return NextResponse.json(
        { error: `Insert School Error: ${error.message}` || "Failed to created a new school" },
        { status: 500 }
      );
    }

    // success response
    return NextResponse.json(
      { message: "School created successfully!" },
      { status: 201 }
    );
  } catch (error: any) {
    // unexpected error
    Sentry.captureException(`Insert School Server Error: ${error.message}`);
    return NextResponse.json(
      { error: `Server error: ${error?.message || "An unexpected error has occurred"}`, },
      { status: error?.status || 500 }
    );
  }
  
}

// PATCH /school - update school
export async function PATCH(request: NextRequest) {
  try {
    // create a new body request
    const body = await request.json();

    // get current users access token
    const accessToken = await getAccessToken(request);
  
    // get the current user's role
    const userRole = await getUserRole(accessToken.toString());

    // If user is not superAdmin, throw an error
    if (userRole !== "superAdmin") {
      Sentry.captureMessage("An unauthorized users tried to update a school", "warning")
      return NextResponse.json(
        { error: "Unauthorized access!" },
        { status: 403 }
      );
    }

    //validate body
    const validation = schoolSchema.safeParse(body);

    // If validation fails, show error
    if (!validation.success) {
      return NextResponse.json(validation.error.format() || "Invalid input data", { status: 400 });
    }

    // initialize Supabase client with access
    const supabase = await createClient(accessToken.toString());

    // get school data
    const { data: school, error: schoolError } = await supabase
      .from('school')
      .select('*')
      .eq('id', body.id)
      .single();
    
      // if school error
    if (schoolError) {
      Sentry.captureException(`School Error: ${schoolError.message}`);
      return NextResponse.json(
        { error: "School does not exist" },
        { status: 404 }
      );
    }

    // if no updates were made
    if(school.name === body.name && school.school_level === body.level && school.school_type === body.type && school.location === body.location && school.email === body.email && school.phone === body.phone) {
      return NextResponse.json(
        { error: "Could not update school as no changes were made!" },
        { status: 406 }
      );
    }

    // update user
    const { error: updateError } = await supabase
      .from('school')
      .update({
        name: body.name,
        school_level: body.level,
        school_type: body.type,
        location: body.location,
        email: body.email,
        phone: body.phone,
        description: body.description
      })
      .eq("id", body.id)
      .select();

    // if update fails
    if (updateError) {
      Sentry.captureException(`Update School Error: ${updateError.message}`);
      return NextResponse.json(
        { error: `Update School Error: ${updateError.message}` || "Failed to update school" },
        { status: 404 }
      );
    }

    // if update succeed - send response
    return NextResponse.json(
      { message: "School successfully updated" },
      { status: 200 }
    );
  } catch (error: any) {
    Sentry.captureException(`Update School Server Error: ${error.message}`)
    return NextResponse.json(
      { error: `Server error: ${error?.message || "An unexpected error has occurred"}`, },
      { status: error?.status || 500 }
    );
  }
}

// DELETE /schools - deletes a school (in bulk or singular)
export async function DELETE(request: NextRequest) {
  try {
    // create a new body request
    const body = await request.json();
    const { ids } = body; // expecting { "ids": [1,2,3] }
  
    // get current users access token
    const accessToken = await getAccessToken(request);
    
    // Fetch the current user's role
    const userRole = await getUserRole(accessToken.toString());
  
    // If user is not superAdmin, throw an error
    if (userRole !== "superAdmin") {
      Sentry.captureMessage("An unauthorized users tried to delete schools", "warning")
      return NextResponse.json(
        { error: "Unauthorized access!" },
        { status: 403 }
      );
    }

    // initialize Supabase client with access token
    const supabase = await createClient(accessToken.toString());
  
    // if id's are empty
    if (!ids || ids.length === 0 ) {
      Sentry.captureMessage("School Delete: No IDs provided for deletion", "debug")
      return NextResponse.json(
        { error: "No IDs provided for deletion" },
        { status: 400 }
      )
    }
      
    // iterate through each school ids - for bulk or single delete
    for (let id of ids) {
      // delete school
      const { error } = await supabase.from('school').delete().eq('id', id);

      // error response
      if (error) {
        Sentry.captureException(`School Delete Error: ${error.message}`);
        return NextResponse.json(
          { success: false, error:`School Delete Error: ${error.message}` },
          { status: 500 }
        )
      }
    }
  
      // success response
      return NextResponse.json(
        { success: true, message: `${ids.length} School(s) Successfully Deleted`},
        { status: 200 }
      )
  } catch (error: any) {
    Sentry.captureException(`School Delete Server Error: ${error.message}`);
    return NextResponse.json(
      { error: "Failed to delete school" },
      { status: 500 }
    );
  }
}
