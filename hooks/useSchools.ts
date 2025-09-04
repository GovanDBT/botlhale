// hooks/useGetSchool.ts
// custom hook used for managing schools data

import { CACHE_KEY_SCHOOLS } from "@/utils/constants";
import { SCHOOL_ENDPOINT } from "@/utils/endpoints";
import { School } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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