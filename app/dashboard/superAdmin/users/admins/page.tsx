/**
 * This module shows a list of all registered admins
 */
import AppSeparator from "@/app/components/AppSeparator";
import AppInfoTooltip from "@/app/components/AppInfoTooltip";

const AdminsListPage = () => {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl/8 sm:text-xl/8 font-bold">Admins</h1>
        <AppInfoTooltip content="A list of all registered Admins" />
      </div>
      <AppSeparator />
    </div>
  );
};

export default AdminsListPage;
