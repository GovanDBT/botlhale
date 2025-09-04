// lib/generateUserId.ts
// library for generating a unique user ID depending on the users role (e.g., admin = adm-2025-003, student = std-2025-0018, etc.)
import dayjs from "dayjs";
import * as Sentry from "@sentry/nextjs";
import { createServerClient } from "@/services/supabase/serviceRole";

export async function generateUserId(role: string): Promise<string> {
  // grab year from dayjs library
  const year = dayjs().year();
  // initiate supabase service role key
  const supabase = createServerClient();

  // id prefix
  const prefixMap: Record<string, string> = {
    superAdmin: "sup",
    admin: "adm",
    schoolAdmin: "sad",
    teacher: "tch",
    student: "stu",
    guardian: "gua",
  };

  // map user role to prefix
  const prefix = prefixMap[role];
  // if invalid role
  if (!prefix) throw new Error("Invalid role");

  // go through existing profile id's
  const { data, error } = await supabase.from("profile").select("profile_id");

  // if database error
  if (error) {
    Sentry.captureException(`Generate User ID Error: ${error.message}`)
    throw new Error(`Generate User ID Error: ${error.message}`);
  }

  // Filter only relevant IDs
  const existingNumbers = new Set(
    (data ?? [])
      .map((row) => row.profile_id)
      .filter(
        (id) => typeof id === "string" && id.startsWith(`${prefix}-${year}-`)
      )
      .map((id) => parseInt(id.split("-")[2]))
      .filter((num) => !isNaN(num))
  );

  // Find lowest missing number
  let newNumber = 1;
  while (existingNumbers.has(newNumber)) {
    newNumber++;
  }

  // pad the number to 4 digits
  const padded = String(newNumber).padStart(4, "0");

  // result = stu-2025-0002
  return `${prefix}-${year}-${padded}`;
}
