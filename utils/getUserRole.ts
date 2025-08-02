/**
 * app/utils/getUserRole.ts
 * Used to get the users role (superAdmin, admin, student, etc) and access token
 */
import { jwtDecode } from "jwt-decode";
import { serverInstance } from "@/services/rollbar/rollbar";

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
    serverInstance.error("System failed to decode JWT", {error})
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