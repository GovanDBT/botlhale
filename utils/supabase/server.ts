/**
 * Supabase server component - to access supabase from server component, which run on the server
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// creates a supabase client for the server
export async function createClient() {
    // for accessing and manipulating cookies
    // cookies are used to manage sessions and authentication tokens
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            // manages cookies
            cookies: {
                // retrieves all cookies
                getAll() {
                    return cookieStore.getAll();
                },
                // sets multiple cookies
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options}) =>
                            cookieStore.set(name, value, options)
                        )
                    }
                    catch {
                        // ignored since we have a middleware
                        // refreshing sessions
                    }
                }
            }
        }
    )
}