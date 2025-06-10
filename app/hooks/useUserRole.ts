"use client";
import { useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode"; // to decode our JWT

import { createClient } from "@/utils/supabase/client"; // supabase server client

const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null); // state hook for setting user roles

  // Asynchronous function to fetch the user role
  // useCallback prevents function re-rendering
  const fetchUserRole = useCallback(async () => {
    const supabase = createClient(); // initialize supabase client

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();

    // if session does exist
    if (session) {
      // Decode the JWT to extract the user role
      const jwt: any = jwtDecode(session.access_token);
      const role = jwt.user_role || null;
      setUserRole(role);
      return role;
    }

    // If no session, return null
    setUserRole(null);
    return null;
  }, [userRole]);

  return { userRole, fetchUserRole };
}

export default useUserRole;