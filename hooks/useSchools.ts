import { createClient } from "@/services/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Define the type for the school table
interface School {
  id: number;
  name: string;
  location: string;
  students: string[];
}

const useSchools = () => {
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

export default useSchools;