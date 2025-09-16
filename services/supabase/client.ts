/**
 * Supabase client component client used to access supabase from 
 * the client component, which run in the browser
 */
import { createBrowserClient } from "@supabase/ssr"; // server-side-auth to config supabase to use cookies

export function createClient() {
    return createBrowserClient(
        process.env.SUPABASE_URL!, // supabase url
        process.env.SUPABASE_ANON! // supabase anon API key
    )
}