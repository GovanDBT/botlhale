"use client";
// react components
import { useState } from "react";
import Link from "next/link";

// Shadcn components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// custom components
import { AppSidebar } from "@/app/dashboard/components/Sidebar";
import layoutButtonContext from "../context/layoutButtonContext";

interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const [buttonTitle, setButtonTitle] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen bg-white grow lg:rounded-lg lg:m-2 px-9 lg:px-20 py-8">
        <div className="mb-3 flex justify-between">
          <SidebarTrigger />
          {buttonTitle && buttonLink && (
            <Button className="cursor-pointer">
              <Link href={buttonLink}>{buttonTitle}</Link>
            </Button>
          )}
        </div>
        <layoutButtonContext.Provider value={{ setButtonLink, setButtonTitle }}>
          {children}
        </layoutButtonContext.Provider>
      </main>
    </SidebarProvider>
  );
}
