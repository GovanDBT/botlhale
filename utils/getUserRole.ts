// utils/getUserRole.ts
// Used to get the users role (superAdmin, admin, student, etc) and access token
import { jwtDecode } from "jwt-decode";
import * as Sentry from "@sentry/nextjs";

export async function getUserRole(accessToken: string | null): Promise<string | null> {
  if (!accessToken) {
    console.error("Access token is missing!");
    return null; // No access token, no role
  }

  try {
    // Decode the JWT to extract the user role
    const jwt: any = jwtDecode(accessToken);
    return jwt.user_role || null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      Sentry.captureException(`System failed to decode JWT: ${error.message}`);
      return "Failed to decode JWT";
    }
    Sentry.captureException("Unexpected error occurred: Decoding JWT");
    return "Unexpected error occurred: Decoding JWT";
  }
}