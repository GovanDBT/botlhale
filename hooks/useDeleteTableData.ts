// hooks/useDeleteTableData.ts
// custom hook for deleting table data (in bulk) using react query mutation
// TODO: make hook reusable to delete other data besides school admins
import { CACHE_KEY_SCHOOLADMIN } from "@/utils/constants";
import { SCHOOLADMIN_ENDPOINT } from "@/utils/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useDeleteTableData = (onAdd: (request: Promise<string>) => void) => {
    // query client for updating data
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async (ids: string[]) => {
      // create a delete api request using axios
      const request = axios
        .delete(SCHOOLADMIN_ENDPOINT, { data: { ids } })
        .then((res) => res.data)
        .catch((err) => {
          const apiError = err?.response?.data?.error;
          if (apiError) throw new Error(apiError);
          throw err;
        });

      onAdd(request)
      // Return the resolved data so useMutation has it
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CACHE_KEY_SCHOOLADMIN });
    },
  });
}

export default useDeleteTableData;