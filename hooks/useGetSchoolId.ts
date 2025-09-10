// hooks/useGetSchoolId.ts
// custom hook used to fetch the logged in users school id
"use client";
import { useState, useCallback } from "react";
import { createClient } from "@/services/supabase/client";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";

const useGetSchoolId = () => {
    const [schoolId, setSchoolId] = useState<number>();

    // useCallback to prevent re-rendering
    const fetchSchoolId = useCallback(async () => {
        try {
            // supabase client server
            const supabase = createClient();
    
            // Refresh the session before fetching it
            await supabase.auth.refreshSession();
    
            // get the current user
            const { data: userData, error: userError } = await supabase.auth.getUser();
    
            // if database fails
            if (userError) {
                Sentry.captureException(`Get User Error: ${userError.message}`);
                toast.error('Unexpected Error: Failed to fetch the current user');
                return 0;
            }

            // get the users school ID
            const schoolMetaData = userData.user.user_metadata.school;
    
            // set the current users school
            if (schoolMetaData) {
                setSchoolId(schoolMetaData);
                return schoolMetaData;
            }
    
            setSchoolId(0);
            return 0;
            
        } catch (error) {
            Sentry.captureException("Failed to fetch school ID: " + error);
            toast.error('Unexpected Error: Something went wrong while fetching school ID');
            setSchoolId(0);
            return 0;
        }
    }, []);

    return { schoolId, fetchSchoolId };
};

export default useGetSchoolId;
