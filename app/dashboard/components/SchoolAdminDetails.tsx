// app/dashboard/components
// UI component for rendering school admin detail sheet
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookUser } from "lucide-react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SchoolAdminDetails = ({ children }: Props) => {
  const tabTriggerStyle: string =
    "relative py-4 rounded-none !shadow-none text-sm font-medium text-gray-600 data-[state=active]:!text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 data-[state=active]:after:scale-x-100 cursor-pointer";

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full flex flex-col [&>button:first-of-type]:top-3 [&>button:first-of-type]:cursor-pointer">
        <Tabs>
          <div className="border-b px-4">
            <TabsList className="flex space-x-6 bg-transparent !shadow-none rounded-none mb-0 pb-0">
              <TabsTrigger value="overview" className={tabTriggerStyle}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="logs" className={tabTriggerStyle}>
                Logs
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Sheet overview */}
          <div className="border-b">
            <SheetHeader>
              <SheetTitle>Timmy Tunner</SheetTitle>
            </SheetHeader>
          </div>
          <TabsContent value="overview" className="px-4">
            Some content
          </TabsContent>
          {/* Sheet logs */}
          <TabsContent value="logs" className="px-4">
            Logs not yet implemented...
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SchoolAdminDetails;
