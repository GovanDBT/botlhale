import React from "react";

import { Separator } from "@/components/ui/separator";
import SchoolForm from "../../components/SchoolForm";

const SchoolRegistrationPage = () => {
  return (
    <div>
      <h1 className="text-2xl/8 sm:text-xl/8 font-bold">
        Schools Registration Form
      </h1>
      <Separator />
      <SchoolForm />
    </div>
  );
};

export default SchoolRegistrationPage;
