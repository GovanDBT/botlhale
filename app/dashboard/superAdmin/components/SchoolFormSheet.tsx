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
import React, { useRef } from "react";
import SchoolForm from "./SchoolForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const SchoolFormSheet = () => {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Register School</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full flex flex-col">
        {/* Header */}
        <div className="border-b px-4">
          <SheetHeader>
            <SheetTitle>Register New School</SheetTitle>
            <SheetDescription>
              Fill in the form below to register a new school.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Area */}
        <ScrollArea className="flex-1 px-4 overflow-y-auto">
          <SchoolForm formRef={formRef} />
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between bg-white">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={() => formRef.current?.requestSubmit()}>
            Register
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SchoolFormSheet;
