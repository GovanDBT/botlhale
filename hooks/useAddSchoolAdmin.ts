// hooks/useAddSchoolAdmin.ts
// custom hook for add a new school admin using mutation
import { schoolAdminSchema } from "@/lib/validationSchema";
import { CACHE_KEY_SCHOOLADMIN } from "@/utils/constants";
import { SCHOOLADMIN_ENDPOINT } from "@/utils/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import z from "zod"

// define schema for school admin data
type schoolAdminData = z.infer<typeof schoolAdminSchema>;

const useAddSchoolAdmin = (onAdd: (request: Promise<string>) => void, onSubmit?: () => void ) => {
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

export default useAddSchoolAdmin;