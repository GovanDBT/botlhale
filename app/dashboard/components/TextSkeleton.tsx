// app/dashboard/components/TextSkeleton.tsx
// custom skeleton component for short text
import { Skeleton } from "@/components/ui/skeleton";

const TextSkeleton = () => {
  return <Skeleton className={`h-[25px] rounded w-[200]`} />;
};

export default TextSkeleton;
