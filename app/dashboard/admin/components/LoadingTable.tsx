import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

const LoadingTable = () => {
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Skeleton className="h-8 w-95" />
        <Skeleton className="h-8 w-30 ml-auto" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-8/10" />
        <Skeleton className="h-9 w-5/10" />
      </div>
      <div className="flex justify-between py-4">
        <Skeleton className="h-6 w-30" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-25" />
          <Skeleton className="h-8 w-25" />
        </div>
      </div>
    </div>
  );
};

export default LoadingTable;
