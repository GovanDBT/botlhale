// hooks/useDeleteTableData.ts
// custom hook for deleting table data (in bulk) using react query mutation
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useDeleteTableData = (onAdd: (request: Promise<string>) => void, endpoint: string, cache: string[]) => {
    // query client for updating data
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async (ids: string[]) => {
      // create a delete api request using axios
      const request = axios
        .delete(endpoint, { data: { ids } })
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
      queryClient.invalidateQueries({ queryKey: cache });
    },
  });
}

export default useDeleteTableData;