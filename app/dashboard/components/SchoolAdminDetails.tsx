// app/dashboard/components
// UI component for rendering school admin detail sheet
// TODO: address duplications
"use client";
import AppButton from "@/app/components/AppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSchoolAdminDetails from "@/hooks/useSchoolAdminDetails";
import { Copy } from "lucide-react";
import { ReactNode } from "react";
import StatusBadge from "./StatusBadge";
import TextSkeleton from "./TextSkeleton";

interface Props {
  children: ReactNode;
  id: string;
}

const SchoolAdminDetails = ({ children, id }: Props) => {
  const { data: profile, error, isLoading } = useSchoolAdminDetails(id);

  const details = [
    { key: "User UID", value: profile?.id },
    { key: "Profile ID", value: profile?.profile_id },
    { key: "Email", value: profile?.email },
    { key: "Phone", value: profile?.phone },
    { key: "Role", value: profile?.profile_role },
    { key: "School", value: profile?.school?.name },
    {
      key: "Date Created",
      value: profile?.created_at
        ? new Date(profile.created_at).toDateString()
        : null,
    },
    { key: "Created By", value: "N/A" },
    { key: "Last Login", value: "N/A" },
    { key: "Last Update", value: "N/A" },
  ];

  const tabTriggerStyle: string =
    "relative py-4 rounded-none !shadow-none text-sm font-medium text-gray-600 data-[state=active]:!text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 data-[state=active]:after:scale-x-100 cursor-pointer";

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full flex flex-col [&>button:first-of-type]:top-3 [&>button:first-of-type]:cursor-pointer">
        <Tabs className="h-full">
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
          <ScrollArea className="flex-1 overflow-y-auto">
            {/* Sheet overview */}
            <div className="border-b">
              <SheetHeader>
                <SheetTitle>
                  {isLoading ? (
                    <TextSkeleton />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{`${profile?.firstname} ${profile?.lastname}`}</span>
                      <StatusBadge>{profile?.profile_status}</StatusBadge>
                    </div>
                  )}
                </SheetTitle>
              </SheetHeader>
            </div>
            <TabsContent value="overview" className="mt-4 px-4">
              {error ? (
                <p className="text-center">{error.message}</p>
              ) : (
                <ul className="space-y-6 md:space-y-2">
                  {details.map((item) => (
                    <li
                      className="flex justify-between border-b pb-2 items-center group"
                      key={item.key}
                    >
                      <p className="text-gray-500">{item.key}</p>
                      <div>
                        {isLoading ? (
                          <TextSkeleton />
                        ) : (
                          <span className="flex items-center gap-2">
                            <p>{item.value}</p>
                            <Button
                              variant="ghost"
                              className="cursor-pointer !m-0 !p-2 invisible group-hover:visible transition ease-in-out hidden lg:inline-flex"
                            >
                              <Copy />
                            </Button>
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6">
                <h3 className="font-bold mb-3">Recovery Zone</h3>
                <Card className="py-5 rounded-sm">
                  <CardContent className="flex flex-col lg:flex-row items-center gap-3 justify-between px-5">
                    <div>
                      <p className="font-bold mb-1 text-center lg:text-left">
                        Reset Password
                      </p>
                      <p>Send a password recovery email to user</p>
                    </div>
                    <AppButton>Send Recovery Email</AppButton>
                  </CardContent>
                </Card>
              </div>
              <Separator className="my-6" />
              <div className="mt-6">
                <h3 className="font-bold mb-1">Danger Zone</h3>
                <p className="mb-3">
                  Be wary of the following features as they cannot be undone
                </p>
                <Card className="py-5 rounded-sm mb-5 border-red-500">
                  <CardContent className="flex items-center gap-3 justify-between px-5 flex-col lg:flex-row text-center lg:text-left">
                    <div>
                      <p className="font-bold mb-1">Deactivate User</p>
                      <p>Prevents the user from logging in</p>
                    </div>
                    <AppButton>Deactivate User</AppButton>
                  </CardContent>
                  <Separator className="!bg-red-500" />
                  <CardContent className="flex items-center gap-3 justify-between px-5 flex-col lg:flex-row text-center lg:text-left">
                    <div>
                      <p className="font-bold mb-1">Suspend User (0)</p>
                      <p>Temporary revokes access for a set duration</p>
                    </div>
                    <AppButton>Suspend User</AppButton>
                  </CardContent>
                  <Separator className="!bg-red-500" />
                  <CardContent className="flex items-center gap-3 justify-between px-5 flex-col lg:flex-row text-center lg:text-left">
                    <div>
                      <p className="font-bold mb-1">Ban User</p>
                      <p>Revokes access and blacklists user</p>
                    </div>
                    <AppButton>Ban User</AppButton>
                  </CardContent>
                  <Separator className="!bg-red-500" />
                  <CardContent className="flex items-center gap-3 justify-between px-5 flex-col lg:flex-row text-center lg:text-left">
                    <div>
                      <p className="font-bold mb-1 text-red-500">Delete User</p>
                      <p className="text-red-500">
                        User will be permanently removed
                      </p>
                    </div>
                    <AppButton className="bg-red-500 hover:bg-red-700">
                      Delete User
                    </AppButton>
                  </CardContent>
                </Card>
              </div>
              {/* Sheet logs */}
            </TabsContent>
            <TabsContent value="logs" className="px-4">
              Logs not yet implemented...
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SchoolAdminDetails;
