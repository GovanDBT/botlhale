// lib/generateSchoolId.ts
// Generates a unique school ID (e.g., 20250001, 20250002)

import dayjs from "dayjs";
import * as Sentry from "@sentry/nextjs";
import { createServerClient } from "@/services/supabase/serviceRole";

export async function generateSchoolId(): Promise<string> {
  // Get current year
  const year = dayjs().year();

  // Supabase client
  const supabase = createServerClient();

  // Fetch all existing school IDs
  const { data, error } = await supabase.from("school").select("id");

  if (error) {
    Sentry.captureException(`Generate School ID Error: ${error.message}`);
    throw new Error(`Generate School ID Error: ${error.message}`);
  }

  // Extract numeric parts of school IDs
  const existingNumbers = new Set(
    (data ?? [])
      .map((row) => row.id)
      .filter((id) => typeof id === "string" && id.startsWith(year.toString()))
      .map((id) => parseInt(id.slice(4), 10)) // get last 4 digits
      .filter((num) => !isNaN(num))
  );

  // Find the lowest available number
  let newNumber = 1;
  while (existingNumbers.has(newNumber)) {
    newNumber++;
  }

  // Pad with leading zeros
  const padded = String(newNumber).padStart(4, "0");

  // Return full ID: year + sequence
  return `${year}${padded}`; // e.g. 20250002
}
