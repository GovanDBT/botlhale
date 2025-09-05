// app/dashboard/components/MultiLineTextSkeleton.tsx
// multi line or paragraph skeleton
import { Skeleton } from "@/components/ui/skeleton";

const MultiLineTextSkeleton = () => {
  return (
    <div className="space-y-9">
      <div className="space-y-3">
        <Skeleton className="h-[30px] rounded w-full" />
        <Skeleton className="h-[30px] rounded w-[70%]" />
        <Skeleton className="h-[30px] rounded w-[50%]" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-[30px] rounded w-full" />
        <Skeleton className="h-[30px] rounded w-[70%]" />
      </div>
    </div>
  );
};

export default MultiLineTextSkeleton;
