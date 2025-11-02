import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Navbar from "@/components/AppComponents/Navbar";

export default function NavLayout({ children }) {
  return (
    <SidebarProvider>
      <Navbar />
      <Sidebar variant="inset">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="pt-16 px-4">
          <SidebarTrigger />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
