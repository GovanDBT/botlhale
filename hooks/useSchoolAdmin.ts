// hooks/useSchoolAdmin.ts
// custom hook used for managing school admins data
import { schoolAdminSchema, updateSchoolAdminSchema } from "@/lib/validationSchema";
import { createClient } from "@/services/supabase/client";
import { CACHE_KEY_SCHOOL_ADMIN_DETAILS, CACHE_KEY_SCHOOLADMIN } from "@/utils/constants";
import { SCHOOLADMIN_ENDPOINT } from "@/utils/endpoints";
import { Profile, SchoolAdmin } from "@/utils/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs"
import axios from "axios";
import z from "zod"

// define schema for school admin data
type schoolAdminData = z.infer<typeof schoolAdminSchema>;
type updateSchoolAdminData = z.infer<typeof updateSchoolAdminSchema>;

// manages fetched data
export function useGetSchoolAdmin() {
    const fetchSchoolAdmins = async (): Promise<SchoolAdmin[]> => {
        const { data } = await axios.get(SCHOOLADMIN_ENDPOINT);
        return data || [];
    }
    return useQuery<SchoolAdmin[], Error>({
        queryKey: CACHE_KEY_SCHOOLADMIN,
        queryFn: fetchSchoolAdmins,
    });
}

// manages fetched data for a specific user
export function useSchoolAdminDetails(id: string) {
    const fetchSchoolAdmin = async (): Promise<Profile> => {
        const supabase = await createClient();
            const { data, error } = await supabase
            .from("profile")
            .select("*, school!school(id, name, school_level)")
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

// manages inserted data
export function useAddSchoolAdmin(onAdd: (request: Promise<string>) => void, onSubmit?: () => void ) {
    // query client for updating data
    const queryClient = useQueryClient();
    // mutation query for creating school admin
    return useMutation({
        mutationFn: async (schoolAdmin: schoolAdminData) => {
            // create school admin api request
            const request = axios
                .post(SCHOOLADMIN_ENDPOINT, schoolAdmin)
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
            queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOLADMIN });
        },
        onSettled: () => {
            onSubmit?.();
        },
    });
}

// manages updated data
export function useUpdateSchoolAdmin(onAdd: (request: Promise<string>) => void, onSubmit?: () => void ) {
    // query client for updating data
    const queryClient = useQueryClient();
    // mutation query for updating school admin
    return useMutation({
        mutationFn: async (schoolAdmin: updateSchoolAdminData) => {
            // update school admin api request
            const request = axios
                .patch(SCHOOLADMIN_ENDPOINT, schoolAdmin)
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
            queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOLADMIN });
            queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOL_ADMIN_DETAILS });
        },
        onSettled: () => {
            // pass submission to the form sheet
            onSubmit?.();
        },
    });
}

export function useDeleteSchoolAdmin(onAdd: (request: Promise<string>) => void) {
    const queryClient = useQueryClient(); // query client for updating data

    return useMutation({
        mutationFn: async (ids: string[]) => {
            // api request for deleting school admin
          const request = axios
            .delete(SCHOOLADMIN_ENDPOINT, { data: { ids } })
            .then((res) => res.data)
            .catch((err) => {
              const apiError = err.response.data.error;
              if (apiError) throw new Error(apiError);
              throw err;
            });
            // loading UI
            onAdd(request);
            return request;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOLADMIN });
        },
    });
}
