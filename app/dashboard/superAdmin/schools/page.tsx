/**
 * This file is used to show a list of all the registered schools
 */
"use client";
import { useContext, useEffect } from "react";
import { Info, Rows3, School, GraduationCap } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import layoutButtonContext from "@/app/context/layoutButtonContext";
import SchoolTable from "../components/SchoolTable";
import LoadingTable from "../components/LoadingTable";

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
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} color="#696969" />
          </TooltipTrigger>
          <TooltipContent>
            <p>A list of all registered schools</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Separator className="my-4" />
      {/* <div className="my-4 flex gap-8">
        <span className="flex items-center gap-1.5">
          <Rows3 size={15} color="#696969" />
          <p className="text-[15px] text-[#696969] font-medium">All</p>
        </span>
        <span className="flex items-center gap-1.5">
          <School size={15} color="#696969" />
          <p className="text-[15px] text-[#696969] font-medium">Public</p>
        </span>
        <span className="flex items-center gap-1.5">
          <GraduationCap size={16} color="#696969" />
          <p className="text-[15px] text-[#696969] font-medium">Private</p>
        </span>
      </div> */}
      <SchoolTable />
    </div>
  );
};

export default SchoolsPage;
