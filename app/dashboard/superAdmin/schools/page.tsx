"use client";
import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import SchoolTable from "../components/SchoolTable";
import SchoolFormSheet from "../components/SchoolFormSheet";

const SchoolsPage = () => {
  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl/8 sm:text-xl/8 font-bold">Schools</h1>
            <AppInfoTooltip content="A list of all registered Schools" />
          </div>
          <SchoolFormSheet />
        </div>
        <AppSeparator />
        <SchoolTable />
      </div>
    </>
  );
};

export default SchoolsPage;
