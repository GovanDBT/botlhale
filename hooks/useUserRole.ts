"use client";
import { useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

import { createClient } from "@/services/supabase/client"; // Supabase browser client

const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // useCallback to prevent re-rendering
  const fetchUserRole = useCallback(async () => {
    const supabase = createClient();

    // Refresh the session before fetching it
    await supabase.auth.refreshSession();

    // get the latest session (with refreshed token)
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Failed to get session:", error.message);
      setUserRole(null);
      return null;
    }

    if (session?.access_token) {
      try {
        const jwt: any = jwtDecode(session.access_token);
        const role = jwt.user_role || null;
        setUserRole(role);
        return role;
      } catch (err) {
        console.error("Error decoding token:", err);
        setUserRole(null);
        return null;
      }
    }

    setUserRole(null);
    return null;
  }, []);

  return { userRole, fetchUserRole };
};

export default useUserRole;
