// utils/dashboardMenu.ts
import { LayoutDashboard, UserRound, School } from "lucide-react";

export type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  subItem?: { subTitle: string; subUrl: string }[];
};

export const menuConfig: Record<string, MenuItem[]> = {
  superAdmin: [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Schools",
      url: "/dashboard/admin/schools",
      icon: School,
    },
    {
      title: "Users",
      url: "/dashboard/admin/users",
      icon: UserRound,
      subItem: [
        { subTitle: "School Admins", subUrl: "/dashboard/admin/users/schoolAdmins" },
        { subTitle: "Staff/Teachers", subUrl: "/dashboard/admin/users/teachers" },
        { subTitle: "Students", subUrl: "/dashboard/admin/users/students" },
        { subTitle: "Parents", subUrl: "/dashboard/admin/users/parents" },
      ],
    },
  ],
  schoolAdmin: [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "#",
      icon: UserRound,
      subItem: [{ subTitle: "Students", subUrl: "/dashboard/admin/users/students" }],
    },
  ],
  student: [
    {
      title: "Dashboard",
      url: "/dashboard/student",
      icon: LayoutDashboard,
    },
    {
      title: "Subjects",
      url: "/dashboard/student/subjects",
      icon: UserRound,
    },
  ],
};
