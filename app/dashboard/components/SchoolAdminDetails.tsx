// app/dashboard/components
// UI component for rendering school admin detail sheet
"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/services/supabase/client";
import { CACHE_KEY_SCHOOL_ADMIN_DETAILS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  id: string;
}

const SchoolAdminDetails = ({ children, id }: Props) => {
  const supabase = createClient();

  const fetchSchoolAdmin = async () => {
    let { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const { data } = useQuery({
    queryKey: CACHE_KEY_SCHOOL_ADMIN_DETAILS,
    queryFn: fetchSchoolAdmin,
  });

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
              <SheetTitle>{`${data?.firstname} ${data?.lastname}`}</SheetTitle>
            </SheetHeader>
          </div>
          <TabsContent value="overview" className="px-4">
            <ul className="mt-4 space-y-2">
              <li className="flex justify-between border-b pb-2 items-center group">
                <p className="text-gray-500">User UID</p>
                <div className="flex items-center gap-2">
                  <p>user id</p>
                  <Button
                    variant="ghost"
                    className="cursor-pointer !m-0 !p-2 invisible group-hover:visible transition ease-in-out"
                  >
                    <Copy />
                  </Button>
                </div>
              </li>
              <li className="flex justify-between border-b pb-2 items-center group">
                <p className="text-gray-500">Profile ID</p>
                <div className="flex items-center gap-2">
                  <p>profile id</p>
                  <Button
                    variant="ghost"
                    className="cursor-pointer !m-0 !p-2 invisible group-hover:visible transition ease-in-out"
                  >
                    <Copy />
                  </Button>
                </div>
              </li>
            </ul>
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
