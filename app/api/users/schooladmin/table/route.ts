// app/api/users/admin/table
// retrieves list of admins for the admin table
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

// (GET/admin/table) - retrieves admins
export async function GET() {
  try {
    // init supabase client
    const supabase = await createClient();
    
    // fetch admin - join with school
    const { data, error } = await supabase
      .from("profile")
      .select(
        "id, profile_id, firstname, lastname, email, phone, created_at, profile_status, school!school(name, school_level)"
      )
      .eq("profile_role", "schoolAdmin")
      .order("created_at");
  
    // if fetch fails
    if (error) {
      Sentry.captureException(`School Admin Table Error: ${error.message}`)
      return NextResponse.json(
        { success: false, error: `School Admin Table Error: ${error.message}` || "Failed to fetch school admin" },
        { status: 404 }
      );
    }
  
    // response
    return NextResponse.json(data);
  } catch (error: any) {
    // any unexpected errors
    Sentry.captureException(`Get School Admin Table Server Error: ${error.message}`)
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}`, },
      { status: error.status }
    );
  }

}
