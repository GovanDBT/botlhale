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
import SchoolForm from "./SchoolForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const SchoolFormSheet = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRegisterClick = () => {
    formRef.current?.requestSubmit();
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-base sm:text-sm cursor-pointer">
          Register School
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full flex flex-col">
        {/* Header */}
        <div className="border-b px-4">
          <SheetHeader>
            <SheetTitle className="text-xl/8 sm:text-lg font-bold">
              Register New School
            </SheetTitle>
            <SheetDescription className="text-base sm:text-sm">
              Fill in the form below to register a new school.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Area */}
        <ScrollArea className="flex-1 px-4 overflow-y-auto">
          <SchoolForm
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
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SchoolFormSheet;
