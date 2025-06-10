import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";

export async function getUserRole(accessToken: string | null): Promise<string | null> {
  if (!accessToken) {
    console.error("Access token is missing!");
    return null; // No access token, no role
  }

  try {
    // Decode the JWT to extract the user role
    const jwt: any = jwtDecode(accessToken);
    return jwt.user_role || null;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export async function fetchUserRoleFromSession(accessToken: string | null): Promise<string | null> {
  if (!accessToken) {
    console.error("Access token is missing!");
    return null;
  }

  return getUserRole(accessToken);
}