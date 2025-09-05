// app/dashboard/components
// UI component for rendering school admin detail sheet
// TODO: address duplications
"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSchoolDetails } from "@/hooks/useSchools";
import { ReactNode } from "react";
import SchoolDetailsDatabase from "./SchoolDetailsDatabase";
import SchoolDetailsOverview from "./SchoolDetailsOverview";
import SchoolDetailsStats from "./SchoolDetailsStats";
import TextSkeleton from "./TextSkeleton";
import SchoolDetailsDesc from "./SchoolDetailsDesc";

interface Props {
  children: ReactNode;
  id: string;
}

const SchoolAdminDetails = ({ children, id }: Props) => {
  const { data: school, isLoading } = useGetSchoolDetails(id);
  const tabTriggerStyle: string =
    "relative py-4 rounded-none !shadow-none text-sm font-medium text-gray-600 data-[state=active]:!text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 data-[state=active]:after:scale-x-100 cursor-pointer";

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-3xl w-full flex flex-col [&>button:first-of-type]:top-3 [&>button:first-of-type]:cursor-pointer">
        <Tabs className="h-full">
          {/* Tabs tooltips */}
          <div className="border-b px-4">
            <TabsList className="flex space-x-6 bg-transparent !shadow-none rounded-none mb-0 pb-0">
              <TabsTrigger value="overview" className={tabTriggerStyle}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="description" className={tabTriggerStyle}>
                Description
              </TabsTrigger>
              <TabsTrigger value="database" className={tabTriggerStyle}>
                Database
              </TabsTrigger>
              <TabsTrigger value="statistics" className={tabTriggerStyle}>
                Statistics
              </TabsTrigger>
            </TabsList>
          </div>
          <ScrollArea className="flex-1 overflow-y-auto">
            {/* Sheet header */}
            <div className="border-b mb-4">
              <SheetHeader>
                <SheetTitle>
                  {isLoading ? (
                    <TextSkeleton />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{`${
                        `${school?.name} ${school?.school_level}` ||
                        "Failed to fetch school name"
                      }`}</span>
                      {/* <StatusBadge>{profile?.profile_status}</StatusBadge> */}
                    </div>
                  )}
                </SheetTitle>
              </SheetHeader>
            </div>
            <SchoolDetailsOverview id={id} />
            <SchoolDetailsDesc id={id} />
            <SchoolDetailsDatabase />
            <SchoolDetailsStats />
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SchoolAdminDetails;
