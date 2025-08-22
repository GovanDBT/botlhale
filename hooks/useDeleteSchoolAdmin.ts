// hooks/useDeleteSchoolAdmin.ts
// custom hook for deleting a school admin using react-query useMutation
import { CACHE_KEY_SCHOOLADMIN } from "@/utils/constants";
import { SCHOOLADMIN_ENDPOINT } from "@/utils/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useDeleteSchoolAdmin = (options?: {onSuccess?: () => void, onError?: (error: any) => void}) => {
    const queryClient = useQueryClient(); // query client for updating data

    return useMutation({
        mutationFn: async (ids: string[]) => {
          return axios
            .delete(SCHOOLADMIN_ENDPOINT, { data: { ids } })
            .then((res) => res.data)
            .catch((err) => {
              const apiError = err.response.data.error;
              if (apiError) throw new Error(apiError);
              throw err;
            });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOLADMIN });
          options?.onSuccess?.()
        },
        onError: (error: any) => {
            options?.onError?.(error)
        }
    });
}

export default useDeleteSchoolAdmin;