// hooks/useGetSchool.ts
// custom hook used for managing schools data

import { schoolSchema } from "@/lib/validationSchema";
import { CACHE_KEY_SCHOOLS } from "@/utils/constants";
import { SCHOOL_ENDPOINT } from "@/utils/endpoints";
import { School } from "@/utils/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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