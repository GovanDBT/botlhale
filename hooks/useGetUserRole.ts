// hooks/useGetSchoolId.ts
// custom hook used to fetch the logged in users role
"use client";
import { useState, useCallback } from "react";
import { createClient } from "@/services/supabase/client";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";

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
      const roleMetaData = userData.user.user_metadata.profile_role;
    
      // set the users role
      if (roleMetaData) {
        setUserRole(roleMetaData);
        return roleMetaData;
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
