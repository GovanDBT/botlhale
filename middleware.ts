/**
 * middleware used to update our session
 */

import { type NextRequest } from "next/server";
import { updateSession } from "./services/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request); // update session
}
/*
* Match all request paths except for the ones starting with:
* - _next/static (static files)
* - _next/image (image optimization files)
* - favicon.ico (favicon file)
*/
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)|/dashboard/:path*',
    ]
}