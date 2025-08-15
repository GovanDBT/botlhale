"use client";

import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import { DataTable } from "../../components/DataTable";
import { columns } from "./SchoolTableColumn";
import SchoolFormSheet from "../components/SchoolFormSheet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const SchoolsPage = () => {
  // Fetch data using react-query
  const fetchSchools = async () => {
    const { data } = await axios.get("/api/schools/table");
    return data;
  };

  const {
    data: schools = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
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
        columns={columns}
        data={schools}
        isLoading={isLoading}
        error={error ? "Failed to fetch schools" : null}
      />
    </div>
  );
};

export default SchoolsPage;
