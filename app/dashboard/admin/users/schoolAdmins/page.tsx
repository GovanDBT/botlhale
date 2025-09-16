// app/dashboard/superAdmin/users/admins/page.tsx
// module shows a list of all registered admins
"use client";
import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import { DataTable } from "@/app/dashboard/components/DataTable";
import { CACHE_KEY_SCHOOLADMIN } from "@/utils/constants";
import { getColumns } from "./SchoolAdminTableColumn";
import { SCHOOLADMIN_ENDPOINT } from "@/utils/endpoints";
import {
  useDeleteSchoolAdmin,
  useGetSchoolAdmin,
} from "@/hooks/useSchoolAdmin";
import SchoolAdminFormSheet from "@/app/dashboard/components/SchoolAdminFormSheet";
import { toast } from "sonner";
import { useMemo } from "react";

const SchoolAdminPage = () => {
  // Fetch data using react-query
  const { data: schoolAdmins = [], isLoading, error } = useGetSchoolAdmin();
  // delete school admin mutation
  const deleteSchoolAdminMutation = useDeleteSchoolAdmin(async (request) => {
    await toast.promise(request, {
      loading: "Deleting school admin...",
      success: () => {
        return "School admin has been successfully deleted";
      },
      error: (error: unknown) =>
        error instanceof Error
          ? error.message
          : "Failed to delete school admin. An unexpected error has occurred",
    });
  });
  const columns = useMemo(() => {
    return getColumns(deleteSchoolAdminMutation.mutate);
  }, [deleteSchoolAdminMutation.mutate]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1>School Admins</h1>
          <AppInfoTooltip content="A list of all registered school Admins" />
        </div>
        <SchoolAdminFormSheet />
      </div>
      <AppSeparator />
      <DataTable
        search={["fullname", "school"]}
        columns={columns}
        data={schoolAdmins}
        isLoading={isLoading}
        refresh={`${CACHE_KEY_SCHOOLADMIN}`}
        endpoint={SCHOOLADMIN_ENDPOINT}
        error={error && "Failed to fetch school admins"}
      />
    </div>
  );
};

export default SchoolAdminPage;
