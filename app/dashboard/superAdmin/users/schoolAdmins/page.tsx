// app/dashboard/superAdmin/users/admins/page.tsx
// module shows a list of all registered admins
"use client";
import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import SchoolAdminFormSheet from "../../components/SchoolAdminFormSheet";
import { DataTable } from "@/app/dashboard/components/DataTable";
import useSchoolAdminTable from "@/hooks/useSchoolAdminTable";
import { CACHE_KEY_SCHOOLADMIN } from "@/utils/constants";
import { columns } from "./SchoolAdminTableColumn";

const SchoolAdminPage = () => {
  // Fetch data using react-query
  const { data: schoolAdmins = [], isLoading, error } = useSchoolAdminTable();
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
        error={error && "Failed to fetch school admins"}
      />
    </div>
  );
};

export default SchoolAdminPage;
