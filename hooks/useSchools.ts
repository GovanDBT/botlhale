/**
 * /hooks/useSchools.ts
 * Custom hook for fetching schools
 */
import { createClient } from "@/services/supabase/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the type for the school table
interface School {
  id: number;
  name: string;
  location?: string;
  students?: string[];
}

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
    queryKey: ["schools"],
    queryFn: fetchSchools,
  });
}

// selects the school name and Id only
// used in the select input to assign admin a school
export function useSelectSchools() {
  const fetchSchools = async () => {
    try {
      const res = await axios.get<School[]>("/api/schools");
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
    queryKey: ["schools"],
    queryFn: fetchSchools,
  });
}