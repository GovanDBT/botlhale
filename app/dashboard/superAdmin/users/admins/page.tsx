/**
 * This module shows a list of all registered admins
 * plus shows a popup sheet with a admin registration form
 */
"use client";
// modules
import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import AdminFormSheet from "../../components/AdminFormSheet";

const AdminsListPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1>Admins</h1>
          <AppInfoTooltip content="A list of all registered Admins" />
        </div>
        <AdminFormSheet />
      </div>
      <AppSeparator />
      <p>Admins table goes here...</p>
    </div>
  );
};

export default AdminsListPage;
