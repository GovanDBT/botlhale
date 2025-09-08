// app/dashboard/components/DashboardButtonSkeleton.tsx
// the dashboards loading skeletons
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const DashboardButtonSkeleton = () => {
  const style = "h-7.5 bg-primary/5";
  return (
    <div className="flex gap-2">
      <Skeleton className={"w-10 rounded-full " + style} />
      <Skeleton className={"w-full " + style} />
    </div>
  );
};

export default DashboardButtonSkeleton;
