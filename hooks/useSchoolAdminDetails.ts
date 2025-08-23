import { createClient } from "@/services/supabase/client";
import { CACHE_KEY_SCHOOL_ADMIN_DETAILS } from "@/utils/constants";
import { Profile } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs"

export default function useSchoolAdminDetails(id: string) {
    const fetchSchoolAdmin = async (): Promise<Profile> => {
        const supabase = await createClient();
            const { data, error } = await supabase
            .from("profile")
            .select("*, school!school(name)")
            .eq("id", id)
            .single();
        if (error) {
            Sentry.captureException(`School Admin Details: ${error.message}`)
            throw new Error("Failed to fetch school admin details");
        }
        return data;
    };

  return useQuery<Profile, Error>({
    queryKey: CACHE_KEY_SCHOOL_ADMIN_DETAILS,
    queryFn: fetchSchoolAdmin,
  });
}