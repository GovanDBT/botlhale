// app/dashboard/components/Dashboard.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Inbox, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useUserRole from "@/hooks/useUserRole";
import { menuConfig, MenuItem } from "@/utils/dashboardMenu";
import DashboardSkeleton from "./DashboardSkeleton";

export function Dashboard() {
  const { fetchUserRole } = useUserRole();
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadMenu = async () => {
      const role = await fetchUserRole();
      setMenuItems(menuConfig[role as keyof typeof menuConfig] || []);
      setLoading(false);
    };
    loadMenu();
  }, [fetchUserRole]);

  const upperMenus = [
    { title: "Search", url: "#", icon: Search },
    { title: "Inbox", url: "#", icon: Inbox },
  ];

  const toggleCollapsible = (title: string) => {
    setOpenStates((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (loading) return <DashboardSkeleton />;

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
              {upperMenus.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`h-9 hover:bg-primary/10 ${
                      pathname === item.url &&
                      "bg-primary/10 text-primary font-bold"
                    }`}
                  >
                    <Link href={item.url}>
                      <item.icon size={40} />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Dynamic Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItem ? (
                    <Collapsible
                      open={openStates[item.title] || false}
                      onOpenChange={() => toggleCollapsible(item.title)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          className="hover:bg-primary/10"
                        >
                          <div className="cursor-pointer">
                            <item.icon />
                            <span className="text-base">{item.title}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItem.map((sub) => (
                            <SidebarMenuSubItem key={sub.subTitle}>
                              <SidebarMenuSubButton
                                asChild
                                className={`h-9 hover:bg-primary/10 ${
                                  pathname === sub.subUrl &&
                                  "bg-primary/10 !text-primary font-bold"
                                }`}
                              >
                                <Link href={sub.subUrl}>
                                  <span className="text-base">
                                    {sub.subTitle}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={`h-9 hover:bg-primary/10 ${
                        pathname === item.url &&
                        "bg-primary/10 !text-primary font-bold"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarRail />
      </SidebarContent>
    </Sidebar>
  );
}
