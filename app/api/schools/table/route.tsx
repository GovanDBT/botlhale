import { serverInstance } from "@/services/rollbar/rollbar";
import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

// API request for retrieving schools table data
export async function GET() {
  // initialize supabase
  const supabase = await createClient();

  // get all schools
  const { data, error } = await supabase
    .from("school")
    .select(
      "id, name, email, created_by, created_at, profile:created_by(firstname, lastname)"
    )
    .order("created_at");

  // fails to retrieve schools
  if (error) {
    serverInstance.error("System failed to fetch all schools", { error });
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }

  // retrieved schools
  return NextResponse.json(data);
}
