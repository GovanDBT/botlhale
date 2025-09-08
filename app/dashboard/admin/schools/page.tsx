// app/dashboard/superAdmin/schools/page.tsx
// page for showing a table of registered schools
"use client";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import AppSeparator from "@/app/components/AppSeparator";
import { useGetSchool } from "@/hooks/useSchools";
import { DataTable } from "../../components/DataTable";
import SchoolFormSheet from "../components/SchoolFormSheet";
import { columns } from "./SchoolTableColumn";
import { CACHE_KEY_SCHOOLS } from "@/utils/constants";
import { SCHOOL_ENDPOINT } from "@/utils/endpoints";

const SchoolsPage = () => {
  // fetch school using react-query
  const { data: schools = [], isLoading, error } = useGetSchool();
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
        columns={columns}
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
