// app/dashboard/components/SchoolDetailsOverview.tsx
// tab component for showing a schools overview or summary
import AppButton from "@/app/components/AppButton";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import TextSkeleton from "./TextSkeleton";
import { Button } from "@/components/ui/button";
import { Copy, ShieldMinus, Trash2 } from "lucide-react";
import { useGetSchoolDetails } from "@/hooks/useSchools";
import { Separator } from "@/components/ui/separator";

const SchoolDetailsOverview = ({ id }: { id: number }) => {
  const { data: school, error, isLoading } = useGetSchoolDetails(id);

  const details = [
    { key: "School ID", value: school?.id || "N/A" },
    { key: "Email", value: school?.email || "N/A" },
    { key: "Phone", value: school?.phone || "N/A" },
    { key: "Role", value: school?.location || "N/A" },
    { key: "School Type", value: school?.school_type || "N/A" },
    {
      key: "Date Created",
      value: school?.created_at
        ? new Date(school.created_at).toDateString()
        : "N/A",
    },
    {
      key: "Created By",
      value:
        `${school?.profile?.firstname} ${school?.profile?.lastname}` || "N/A",
    },
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
      {/* Danger zone */}
      <div className="mt-6">
        <h3 className="font-bold mb-1">Danger Zone</h3>
        <p className="mb-3">
          Be wary of the following features as they cannot be undone and can
          affect other users under this school
        </p>
        <Card className="py-5 rounded-sm mb-5 border-red-500">
          <CardContent className="flex items-center gap-3 justify-between px-5 flex-col lg:flex-row text-center lg:text-left">
            <div>
              <p className="font-bold mb-1 flex items-center gap-1">
                <ShieldMinus size={14} />
                Deactivate School
              </p>
              <p>
                Temporary prevents users under this school from logging back in
              </p>
            </div>
            <AppButton>Deactivate School</AppButton>
          </CardContent>
          <Separator className="!bg-red-500" />
          <CardContent className="flex items-center gap-3 justify-between px-5 flex-col lg:flex-row text-center lg:text-left">
            <div>
              <p className="font-bold mb-1 text-red-500 flex items-center gap-1">
                {" "}
                <Trash2 size={14} />
                Delete School
              </p>
              <p className="text-red-500">School will be permanently removed</p>
            </div>
            <AppButton className="bg-red-500 hover:bg-red-700">
              Delete School
            </AppButton>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default SchoolDetailsOverview;
