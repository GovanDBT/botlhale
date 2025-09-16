// app/dashboard/superAdmin/schools/page.tsx
// page for showing a table of registered schools
"use client";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import AppSeparator from "@/app/components/AppSeparator";
import { useDeleteSchool, useGetSchool } from "@/hooks/useSchools";
import { DataTable } from "../../components/DataTable";
import { getColumns } from "./SchoolTableColumn";
import { CACHE_KEY_SCHOOLS } from "@/utils/constants";
import { SCHOOL_ENDPOINT } from "@/utils/endpoints";
import SchoolFormSheet from "../../components/SchoolFormSheet";
import { toast } from "sonner";

const SchoolsPage = () => {
  // fetch school using react-query
  const { data: schools = [], isLoading, error } = useGetSchool();
  // delete mutation for deleting school
  const deleteSchoolMutation = useDeleteSchool(async (request) => {
    await toast.promise(request, {
      loading: "Deleting school...",
      success: () => "School has been successfully deleted",
      error: (error: unknown) =>
        error instanceof Error
          ? error.message
          : "Failed to delete school. An unexpected error has occurred",
    });
  });
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1>Schools</h1>
          <AppInfoTooltip content="A list of all registered Schools" />
        </div>
        <SchoolFormSheet />
      </div>
      <AppSeparator />
      <DataTable
        search={["name"]}
        columns={getColumns(deleteSchoolMutation)}
        data={schools}
        isLoading={isLoading}
        refresh={`${CACHE_KEY_SCHOOLS}`}
        endpoint={SCHOOL_ENDPOINT}
        error={error && "Failed to fetch schools"}
      />
    </div>
  );
};

export default SchoolsPage;
