/**
 * This module shows a list of all registered admins
 * plus shows a popup sheet with a admin registration form
 */
"use client";
// modules
import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import AdminFormSheet from "../../components/AdminFormSheet";
import { DataTable } from "@/app/dashboard/components/DataTable";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./AdminTableColumn";

const AdminsListPage = () => {
  // Fetch data using react-query
  const fetchAdmins = async () => {
    const { data } = await axios.get("/api/users/admin/table");
    return data;
  };

  const {
    data: admins = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1>Admins</h1>
          <AppInfoTooltip content="A list of all registered Admins" />
        </div>
        <AdminFormSheet />
      </div>
      <AppSeparator />
      <DataTable
        search="fullname"
        columns={columns}
        data={admins}
        isLoading={isLoading}
        error={error ? "Failed to fetch admins" : null}
      />
    </div>
  );
};

export default AdminsListPage;
