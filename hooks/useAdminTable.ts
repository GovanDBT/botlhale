// app/hooks/useAdminTable.ts
// for fetching admin data for the admin table
import Admin from "@/app/dashboard/superAdmin/users/admins/AdminTableColumn";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useAdminTable() {
    const fetchAdmins = async (): Promise<Admin[]> => {
        const { data } = await axios.get("/api/users/admin/table");
        return data || [];
    }
    return useQuery<Admin[], Error>({
        queryKey: ["admins"],
        queryFn: fetchAdmins,
    });
}