// utils/getAccessToken.ts
// module is used to get the session of the user and return the users access token
// this module will be used by the getUserRole.ts module to get the users role using their access token

import { createClient } from "@/services/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function getAccessToken(request: NextRequest) {
    // grabs our current access token - postman testing
    let accessToken = request.headers.get("Authorization")?.replace("Bearer ", "");
  
    // initialize Supabase client on the server
    const supabase = await createClient();
  
    // if no access token, grab token from session - client-side path
    if (!accessToken) {
        // grab user session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
  
        // if api fails to retrieve user session
        if (sessionError) {
            Sentry.captureException(`Session Error: ${sessionError.message}`)
            return NextResponse.json(
                { error: `Session error: ${sessionError.message}` || "Failed to fetch user session" },
                { status: sessionError.status }
            );
        }
  
        // get access token from session and assign to accessToken
        accessToken = session?.access_token;
        
        // if no access token was provided
        if (!accessToken) {
            Sentry.captureMessage("System fails to provide access token", "error")
            return NextResponse.json(
                { error: "No access token provided" },
                { status: 409 }
            );
        }
    }

    return accessToken;
}