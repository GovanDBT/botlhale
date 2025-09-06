// hooks/useAddSchoolAdmin.ts
// custom hook for add a new school admin using mutation
import { updateSchoolAdminSchema } from "@/lib/validationSchema";
import { CACHE_KEY_SCHOOL_ADMIN_DETAILS, CACHE_KEY_SCHOOLADMIN } from "@/utils/constants";
import { SCHOOLADMIN_ENDPOINT } from "@/utils/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import z from "zod"

// define schema for school admin data
type schoolAdminData = z.infer<typeof updateSchoolAdminSchema>;

const useUpdateSchoolAdmin = (onAdd: (request: Promise<string>) => void, onSubmit?: () => void ) => {
    // query client for updating data
    const queryClient = useQueryClient();
    // mutation query for updating school admin
    return useMutation({
        mutationFn: async (schoolAdmin: schoolAdminData) => {
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

export default useUpdateSchoolAdmin;