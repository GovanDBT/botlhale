/**
 * /hooks/useSchools.ts
 * Custom hook for fetching schools
 */
import { createClient } from "@/services/supabase/client";
import { CACHE_KEY_SCHOOLS } from "@/utils/constants";
import { SCHOOL_ENDPOINT } from "@/utils/endpoints";
import { School } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// selects all the schools data
export default function useSchools () {
  const supabase = createClient(); // initiate supabase on the client side

  // fetch schools from supabase
  const fetchSchools = async (): Promise<School[]> => {
    let { data, error } = await supabase.from("school").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  };

  return useQuery<School[], Error>({
    queryKey: CACHE_KEY_SCHOOLS,
    queryFn: fetchSchools,
  });
}

// selects the school name and Id only
// used in the select input to assign admin a school
export function useSelectSchools() {
  const fetchSchools = async () => {
    try {
      const res = await axios.get<School[]>(SCHOOL_ENDPOINT);
      const allSchools = res.data;

      // Return only id and name
      return allSchools.map((school: any) => ({
        id: school.id,
        name: school.name,
      }));
    } catch (err: any) {
      // Custom API error (if backend sends `error` property)
      const apiError = err.response?.data?.error;
      if (apiError) {
        throw new Error(apiError);
      }

      // Fallback message for unexpected errors
      throw new Error("Failed to fetch schools");
    }
  };

  return useQuery<School[]>({
    queryKey: CACHE_KEY_SCHOOLS,
    queryFn: fetchSchools,
  });
}