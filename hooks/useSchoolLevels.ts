// hooks/useSchoolLevels.ts
// custom hook for fetching the schools levels
import { createClient } from "@/services/supabase/client";
import { CACHE_KEY_SCHOOL_LEVELS } from "@/utils/constants";
import { SchoolLevels } from "@/utils/interfaces";
import * as Sentry from "@sentry/nextjs"
import { useQuery } from "@tanstack/react-query";

export default function useSchoolLevels() {
    const fetchSchoolLevel = async (): Promise<SchoolLevels[]> => {
        try {
            // init supabase server client
            const supabase = await createClient();

            // fetch school level
            const { data, error } = await supabase
                .from('school_levels')
                .select('*')
                .order('id');

            // it database error
            if (error) {
                throw new Error("Failed to fetch school levels");
            }

            // response
            return data || [];
        } catch (error: any) {
            // log to sentry
            Sentry.captureException(`School Levels Error: ${error.message}`);
            // log to client
            throw new Error(error);
        }
    }
    return useQuery<SchoolLevels[]>({
        queryKey: CACHE_KEY_SCHOOL_LEVELS,
        queryFn: fetchSchoolLevel,
    });
}