/**
 * Supabase client component client used to access supabase from 
 * the client component, which run in the browser
 */
import { createBrowserClient } from "@supabase/ssr"; // server-side-auth to config supabase to use cookies

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, // supabase url
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // supabase anon API key
    )
}