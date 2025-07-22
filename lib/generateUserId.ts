import dayjs from "dayjs";
import { serverInstance } from "@/services/rollbar/rollbar";
import { createServerClient } from "@/services/supabase/serviceRole";

export async function generateUserId(role: string): Promise<string> {
  const year = dayjs().year();
  const supabase = createServerClient();

  const prefixMap: Record<string, string> = {
    student: "stu",
    teacher: "tch",
    parent: "par",
    admin: "adm",
    superadmin: "sup",
  };

  const prefix = prefixMap[role.toLowerCase()];
  if (!prefix) throw new Error("Invalid role");

  const { data, error } = await supabase.from("profile").select("user_id");

  if (error) {
    serverInstance.error("System failed to fetch existing ID", error);
    console.error("Supabase error:", error);
    throw new Error("Failed to fetch existing IDs", error);
  }

  // Filter only relevant IDs
  const existingNumbers = new Set(
    (data ?? [])
      .map((row) => row.user_id)
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

  const padded = String(newNumber).padStart(4, "0");
  return `${prefix}-${year}-${padded}`; // stu-2025-0002
}
