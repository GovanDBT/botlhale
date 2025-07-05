/**
 * Supabase server component - to access supabase from server component, which run on the server
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// creates a supabase client for the server
export async function createClient(accessToken?: string) {
    // for accessing and manipulating cookies
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            // manages cookies
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // ignored since we have a middleware
                    }
                }
            },
            // inject the access token in headers (important for RLS policies)
            global: {
                headers: {
                    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                }
            }
        }
    );
    
    // Optional: still useful if you're handling session manually too
    if (accessToken) {
        await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: "", // can be optional or filled if available
        });
    }

    return supabase;
}
