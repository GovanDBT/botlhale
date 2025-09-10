// app/dashboard/superAdmin/components/EditSchoolAdmin.tsx
// client side sheet form for updating a school admin
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
import { useSchoolAdminDetails } from "@/hooks/useSchoolAdmin";
import SchoolAdminForm from "./SchoolAdminForm";

interface Props {
  children: ReactNode;
  id: string;
}

const UpdateSchoolAdmin = ({ children, id }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: profile } = useSchoolAdminDetails(id);
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
              Update School Admin
            </SheetTitle>
            <SheetDescription className="text-base sm:text-sm">
              Update the form fields below to change the school admins data.
              Cannot change email or phone for security reasons
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Area */}
        <ScrollArea className="flex-1 px-4 overflow-y-auto">
          <SchoolAdminForm
            formRef={formRef}
            onSubmittingChange={(submitting) => setIsSubmitting(submitting)}
            data={profile}
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

export default UpdateSchoolAdmin;
