"use client";
import { useContext, useEffect } from "react";
import { Info } from "lucide-react";

import layoutButtonContext from "@/app/context/layoutButtonContext";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <Separator />
    </div>
  );
};

export default SchoolsPage;
