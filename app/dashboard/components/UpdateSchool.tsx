import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { ReactNode, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/app/components/Spinner";
import SchoolForm from "../admin/components/SchoolForm";
import { useGetSchoolDetails } from "@/hooks/useSchools";

interface Props {
  children: ReactNode;
  id: number;
}

const UpdateSchool = ({ children, id }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: school } = useGetSchoolDetails(id);
  const handleRegisterClick = () => {
    formRef.current?.requestSubmit();
  };
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="sm:max-w-xl w-full flex flex-col"
        onInteractOutside={(event) => event.preventDefault()}
      >
        {/* Header */}
        <div className="border-b">
          <SheetHeader>
            <SheetTitle className="text-xl/8 sm:text-lg font-bold">
              Update School
            </SheetTitle>
            <SheetDescription className="text-base sm:text-sm">
              Change the data in the input fields below to update a schools
              information.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Area */}
        <ScrollArea className="flex-1 px-4 overflow-y-auto">
          <SchoolForm
            formRef={formRef}
            onSubmittingChange={(submitting) => setIsSubmitting(submitting)}
            data={school}
          />
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between bg-white">
          <SheetClose asChild>
            <Button
              variant="outline"
              className="text-base sm:text-sm cursor-pointer"
            >
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleRegisterClick}
            className="text-base sm:text-sm cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner />
                Updating...
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateSchool;
