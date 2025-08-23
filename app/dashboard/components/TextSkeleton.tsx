import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  width?: string;
}

const TextSkeleton = ({ width = "200px" }: Props) => {
  return <Skeleton className={`h-[25px] rounded w-[${width}]`} />;
};

export default TextSkeleton;
