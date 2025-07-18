"use client";
// react components
import { ReactNode, useState } from "react";
// Shadcn components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// custom components
import { AppSidebar } from "@/app/dashboard/components/Sidebar";
import layoutButtonContext from "../context/layoutButtonContext";
import AppButton from "../components/AppButton";
interface Props {
  children?: React.ReactNode;
  breadcrumbs: ReactNode;
}

export default function Layout({ children, breadcrumbs }: Props) {
  const [buttonTitle, setButtonTitle] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen bg-white grow lg:rounded-lg lg:m-2 px-9 lg:px-20 py-8">
        <div className="mb-3 flex justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            {breadcrumbs}
          </div>
          {buttonTitle && buttonLink && (
            <AppButton href={buttonLink}>{buttonTitle}</AppButton>
          )}
        </div>
        <layoutButtonContext.Provider value={{ setButtonLink, setButtonTitle }}>
          {children}
        </layoutButtonContext.Provider>
      </main>
    </SidebarProvider>
  );
}
