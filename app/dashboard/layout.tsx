import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/dashboard/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen bg-white grow lg:rounded-lg lg:m-2 p-3">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
