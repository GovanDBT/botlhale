// app/dashboard/components/SchoolDetailsDesc.tsx
// tab component for showing schools description
import { TabsContent } from "@/components/ui/tabs";
import { useGetSchoolDetails } from "@/hooks/useSchools";
import MultiLineTextSkeleton from "./MultiLineTextSkeleton";

const SchoolDetailsDesc = ({ id }: { id: number }) => {
  const { data, error, isLoading } = useGetSchoolDetails(id);
  return (
    <TabsContent value="description" className="px-4">
      {isLoading ? (
        <MultiLineTextSkeleton />
      ) : error ? (
        "Failed to fetch school description"
      ) : (
        data?.description || "This school has not provided a description..."
      )}
    </TabsContent>
  );
};

export default SchoolDetailsDesc;
