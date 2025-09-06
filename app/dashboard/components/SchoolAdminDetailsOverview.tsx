import AppButton from "@/app/components/AppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { useSchoolAdminDetails } from "@/hooks/useSchoolAdmin";
import React from "react";
import TextSkeleton from "./TextSkeleton";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const SchoolAdminDetailsOverview = ({ id }: { id: string }) => {
  const { data: profile, error, isLoading } = useSchoolAdminDetails(id);
  const details = [
    { key: "User UID", value: profile?.id },
    { key: "Profile ID", value: profile?.profile_id },
    { key: "Email", value: profile?.email },
    { key: "Phone", value: profile?.phone },
    { key: "Role", value: profile?.profile_role },
    {
      key: "School",
      value: `${profile?.school?.name} ${profile?.school?.school_level}`,
    },
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
  return (
    <TabsContent value="overview" className="px-4">
      {/* Overview */}
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
              <p className="text-red-500">User will be permanently removed</p>
            </div>
            <AppButton className="bg-red-500 hover:bg-red-700">
              Delete User
            </AppButton>
          </CardContent>
        </Card>
      </div>
      {/* Sheet logs */}
    </TabsContent>
  );
};

export default SchoolAdminDetailsOverview;
