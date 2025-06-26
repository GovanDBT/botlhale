"use client";
/**
 * This module shows a list of all registered admins
 */
import { useContext, useEffect } from "react";
// modules
import layoutButtonContext from "@/app/context/layoutButtonContext";
import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";

const AdminsListPage = () => {
  const { setButtonTitle, setButtonLink } = useContext(layoutButtonContext); // our button context

  // effect hook for setting the button link and title and unmounting when done
  useEffect(() => {
    setButtonTitle("Create Admin");
    setButtonLink("/dashboard/superAdmin/users/admins/registerAdmin");

    return () => {
      setButtonTitle("");
      setButtonLink("");
    };
  }, [setButtonLink, setButtonTitle]);

  return (
    <div>
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl/8 sm:text-xl/8 font-bold">Admins</h1>
        <AppInfoTooltip content="A list of all registered Admins" />
      </div>
      <AppSeparator />
      <p>Admins table goes here...</p>
    </div>
  );
};

export default AdminsListPage;
