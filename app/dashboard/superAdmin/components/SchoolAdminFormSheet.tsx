// app/dashboard/superAdmin/components/SchoolAdminFormSheet.tsx
// client side sheet form for registering school admin
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
import React, { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SchoolAdminForm from "./SchoolAdminForm";
import Spinner from "@/app/components/Spinner";

const SchoolAdminFormSheet = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRegisterClick = () => {
    formRef.current?.requestSubmit();
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-base sm:text-sm cursor-pointer">
          Register Admin
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:max-w-xl w-full flex flex-col"
        onInteractOutside={(event) => event.preventDefault()}
      >
        {/* Header */}
        <div className="border-b">
          <SheetHeader>
            <SheetTitle className="text-xl/8 sm:text-lg font-bold">
              Register New School Admin
            </SheetTitle>
            <SheetDescription className="text-base sm:text-sm">
              Fill in the form below to register a new school admin. An email
              will be sent to the user where they will be prompted to complete
              their registration.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Area */}
        <ScrollArea className="flex-1 px-4 overflow-y-auto">
          <SchoolAdminForm
            formRef={formRef}
            onSubmittingChange={(submitting) => setIsSubmitting(submitting)}
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
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SchoolAdminFormSheet;
