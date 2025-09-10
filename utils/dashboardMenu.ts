// utils/dashboardMenu.ts
// the dashboards for the menu lists
import { LayoutDashboard, UserRound, School } from "lucide-react";

export type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  subItem?: { subTitle: string; subUrl: string }[];
};

export const getMenuConfig = (
  role: string,
  schoolId?: number
): MenuItem[] => {

  const config: Record<string, MenuItem[]> = {
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
        url: `/dashboard/${schoolId}`,
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        url: "#",
        icon: UserRound,
        subItem: [
          {
            subTitle: "Students",
            subUrl: "/dashboard/[id]/users/students",
          },
        ],
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
    parent: [
      {
        title: "Dashboard",
        url: "/dashboard/parent",
        icon: LayoutDashboard,
      },
    ],
  };

  return config[role] || [];
};
