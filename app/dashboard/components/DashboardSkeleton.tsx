// app/dashboard/components/DashboardSkeleton.tsx
// the dashboard skeleton
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Image from "next/image";
import DashboardButtonSkeleton from "./DashboardButtonSkeleton";

const DashboardSkeleton = () => {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <Image
                src="/Strype-logo-primary.svg"
                alt="Strype logo"
                width={42}
                height={42}
              />
              <div>
                <h2 className="text-3xl uppercase text-primary font-logo font-bold">
                  Strype<span className="text-secondary">.</span>
                </h2>
                <p className="text-[9px] italic">
                  Earn your Strypes, Shape your Future
                </p>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Top Static Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="space-y-4">
                <DashboardButtonSkeleton />
                <DashboardButtonSkeleton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Dynamic Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="space-y-4">
                <DashboardButtonSkeleton />
                <DashboardButtonSkeleton />
                <DashboardButtonSkeleton />
                <DashboardButtonSkeleton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="space-y-4">
                <DashboardButtonSkeleton />
                <DashboardButtonSkeleton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarRail />
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSkeleton;
