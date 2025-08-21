// app/hooks/useSchool_adminTable.ts
// for fetching school admin data for the school admin table
import SchoolAdmin from "@/app/dashboard/superAdmin/users/schoolAdmins/SchoolAdminTableColumn";
import { CACHE_KEY_SCHOOLADMIN } from "@/utils/constants";
import { SCHOOLADMIN_TABLE_ENDPOINT } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useAdminTable() {
    const fetchSchoolAdmins = async (): Promise<SchoolAdmin[]> => {
        const { data } = await axios.get(SCHOOLADMIN_TABLE_ENDPOINT);
        return data || [];
    }
    return useQuery<SchoolAdmin[], Error>({
        queryKey: CACHE_KEY_SCHOOLADMIN,
        queryFn: fetchSchoolAdmins,
    });
}