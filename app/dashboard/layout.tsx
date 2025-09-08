"use client";
// react components
import { ReactNode, useState } from "react";
// Shadcn components
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
// custom components
import { Dashboard } from "@/app/dashboard/components/Dashboard";
interface Props {
  children?: React.ReactNode;
  breadcrumbs: ReactNode;
}

export default function Layout({ children, breadcrumbs }: Props) {
  return (
    <SidebarProvider>
      <Dashboard />
      <main className="w-screen bg-white grow lg:rounded-lg lg:m-2 px-4 lg:px-20 py-8">
        <div className="flex items-center gap-4 mb-3">
          <SidebarTrigger />
          {breadcrumbs}
        </div>
        {children}
      </main>
      <Toaster richColors position="top-center" />
    </SidebarProvider>
  );
}
