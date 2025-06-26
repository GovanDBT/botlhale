/**
 * Admin Registration Page
 */

// modules
import AppSeparator from "@/app/components/AppSeparator";
import AdminForm from "../../../components/AdminForm";

const RegisterAdminPage = () => {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <h1 className="text-2xl/8 sm:text-xl/8 font-bold">
          Admins Registration Form
        </h1>
      </div>
      <AppSeparator />
      <AdminForm />
    </div>
  );
};

export default RegisterAdminPage;
