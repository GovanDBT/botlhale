// hooks/useGetSchoolId.ts
// custom hook used to fetch the logged in users role
"use client";
import { useState, useCallback } from "react";
import { createClient } from "@/services/supabase/client";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // useCallback to prevent re-rendering
  const fetchUserRole = useCallback(async () => {
    try {
      // supabase client server
      const supabase = createClient();
      
      // Refresh session
      await supabase.auth.refreshSession();

      // get the current users data
      const { data: userData, error: userError } = await supabase.auth.getUser();
    
      // if database fails
      if (userError) {
        Sentry.captureException(`Get User Error: ${userError.message}`);
        toast.error('Unexpected Error: Failed to fetch the current user');
        return 0;
      }

      // get the users role
      let role = userData.user.user_metadata.profile_role;
    
      // set the users role
      if (role) {
        setUserRole(role);
        return role;
      }

      // second approach to fetch user role
      if (!role) {
        // get current users session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
        // if database fails
        if (sessionError) {
          Sentry.captureException(`Session Error: ${sessionError.message}`)
          toast.error('Unexpected Error: Failed to fetch the current users session');
          setUserRole(null);
          return null
        }
          
        // get access token from session and assign to accessToken
        const accessToken: any = session?.access_token;

        // decode access toke
        const jwt: any = jwtDecode(accessToken);

        if (jwt.error || !jwt) {
          Sentry.captureException("Failed to decode access token " + jwt.error);
          toast.error('Unexpected Error: Failed to decode JWT');
          return null;
        }

        // get role from access toke and set it
        setUserRole(jwt.user_role);

        // return role
        return jwt.user_role;
      }
    
      setUserRole(null);
      return null;


    } catch (error) {
      Sentry.captureException("Failed to fetch users role: " + error);
      toast.error('Unexpected Error: Something went wrong while fetching user role');
      setUserRole(null);
      return null;
    }
  }, []);

  return { userRole, fetchUserRole };
};

export default useUserRole;
