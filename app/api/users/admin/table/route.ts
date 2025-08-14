import { serverInstance } from "@/services/rollbar/rollbar";
import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  // init supabase client
  const supabase = await createClient();

  // API to fetch admin table data from supabase
  const { data, error } = await supabase
    .from("profile")
    .select(
      "id, user_id, firstname, lastname, email, phone, created_at, school:school(name)"
    )
    .eq("user_role", "admin")
    .order("created_at");

  if (error) {
    serverInstance.error("System failed to fetch admin data", { error });
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }

  // retrieved schools
  return NextResponse.json(data);
}
