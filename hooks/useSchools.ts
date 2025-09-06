// hooks/useSchools.ts
// custom hook used for managing schools data
import { schoolSchema } from "@/lib/validationSchema";
import { createClient } from "@/services/supabase/client";
import { CACHE_KEY_SCHOOL_DETAILS, CACHE_KEY_SCHOOLS } from "@/utils/constants";
import { SCHOOL_ENDPOINT } from "@/utils/endpoints";
import { School } from "@/utils/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs"
import axios from "axios";
import z from "zod";

// define schema for school data
type schoolData = z.infer<typeof schoolSchema>;

// manages fetched data
export function useGetSchool() {
    // fetch school from api using axios
  const fetchSchools = async (): Promise<School[]> => {
    const { data } = await axios.get(SCHOOL_ENDPOINT);
    return data || [];
  };

  // manage the data using react query
  return useQuery<School[], Error>({
    queryKey: CACHE_KEY_SCHOOLS,
    queryFn: fetchSchools,
  });
}

// manages fetched data for a specific school
export function useGetSchoolDetails(id: number) {
    const fetchSchool = async (): Promise<School> => {
        const supabase = await createClient();
            const { data, error } = await supabase
            .from("school")
            .select("*, profile:created_by(firstname, lastname)")
            .eq("id", id)
            .single();
        if (error) {
            Sentry.captureException(`School Details Error: ${error.message}`)
            throw new Error("Failed to fetch school details");
        }
        return data;
    };

  return useQuery<School, Error>({
    queryKey: CACHE_KEY_SCHOOL_DETAILS,
    queryFn: fetchSchool,
  });
}

// manages fetch data - school name and ID only
export function useSelectSchools() {
  const fetchSchools = async (): Promise<School[]> => {
    try {
      const res = await axios.get(SCHOOL_ENDPOINT);
      const allSchools = res.data;

      // Return only id and name
      return allSchools.map((school: any) => ({
        id: school.id,
        name: school.name,
        school_level: school.school_level,
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

// manages inserted data
export function useAddSchool(onAdd: (request: Promise<string>) => void, onSubmit?: () => void) {
  // query client for updating data
    const queryClient = useQueryClient();
    // mutation query for creating a new school
    return useMutation({
        mutationFn: async (school: schoolData) => {
            // create school admin api request
            const request = axios
                .post(SCHOOL_ENDPOINT, school)
                .then((res) => res.data)
                .catch((err) => {
                    const apiError = err?.response?.data?.error;
                    if (apiError) {
                        throw new Error(apiError);
                    }
                    throw err;
                });
            
            onAdd(request);
            // Return the resolved data so useMutation has it
            return request;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOLS });
        },
        onSettled: () => {
            onSubmit?.();
        },
    });
}

// manages updated data
export function useUpdateSchool(onAdd: (request: Promise<string>) => void, onSubmit?: () => void ) {
    // query client for updating data
    const queryClient = useQueryClient();
    // mutation query for updating school
    return useMutation({
        mutationFn: async (school: schoolData) => {
            // update school api request
            const request = axios
                .patch(SCHOOL_ENDPOINT, school)
                .then((res) => res.data)
                .catch((err) => {
                    const apiError = err?.response?.data?.error;
                    if (apiError) {
                        throw new Error(apiError);
                    }
                    throw err;
                });
            // function for showing loading UI
            onAdd(request);
            // Return the resolved data so useMutation has it
            return request;
        },
        onSuccess: () => {
            // refresh cache
            queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOLS });
            queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOL_DETAILS });
        },
        onSettled: () => {
            // pass submission to the form sheet
            onSubmit?.();
        },
    });
}

// manages deleted data
export function useDeleteSchool(onAdd: (request: Promise<string>) => void) {
  // query client for updating data  
  const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: async (ids: string[]) => {
          const request = axios
            .delete(SCHOOL_ENDPOINT, { data: { ids } })
            .then((res) => res.data)
            .catch((err) => {
              const apiError = err.response.data.error;
              if (apiError) throw new Error(apiError);
              throw err;
            });
          
          onAdd(request);
          return request;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOLS });
        },
    });
}