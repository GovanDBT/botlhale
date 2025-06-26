/**
 * This file is used to show a list of all the registered schools
 */
"use client";
import { useContext, useEffect } from "react";
// modules
import layoutButtonContext from "@/app/context/layoutButtonContext";
import SchoolTable from "../components/SchoolTable";
import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";

const SchoolsPage = () => {
  const { setButtonTitle, setButtonLink } = useContext(layoutButtonContext); // our button context

  // effect hook for setting the button link and title and unmounting when done
  useEffect(() => {
    setButtonTitle("Create School");
    setButtonLink("/dashboard/superAdmin/schools/registerSchool");

    return () => {
      setButtonTitle("");
      setButtonLink("");
    };
  }, [setButtonLink, setButtonTitle]);

  return (
    <div>
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl/8 sm:text-xl/8 font-bold">Schools</h1>
        <AppInfoTooltip content="A list of all registered Schools" />
      </div>
      <AppSeparator />
      <SchoolTable />
    </div>
  );
};

export default SchoolsPage;
