'use client'
import { Calendar, Home, Inbox, Search, Command, Settings2, Sparkles, LogOut, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Agents", url: "/agents", icon: Inbox },
  { title: "History", url: "/history", icon: Calendar },
  { title: "User Info", url: "/user-info", icon: Search },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar dark:bg-zinc-950/50 backdrop-blur-md">
      <SidebarHeader className="p-5 flex h-[72px] items-center flex-row gap-3 border-b border-border/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
          <Command className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight truncate leading-tight">AutoSync</span>
          <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Pro Account</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 pt-6 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Menu Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={`transition-all duration-300 cursor-pointer h-10 px-3 relative group overflow-hidden ${isActive ? 'bg-primary/10 text-primary font-semibold shadow-sm' : 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                        )}
                        <item.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4 space-y-4 bg-muted/10">
         
         <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 space-y-3 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-16 h-16 bg-primary/20 blur-xl rounded-full" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Upgrade Plan</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unlock unlimited AI post generation and VIP support.
            </p>
         </div>

         <div className="flex flex-col gap-1">
           <SidebarMenu>
             <SidebarMenuItem>
               <SidebarMenuButton asChild className="hover:bg-muted text-muted-foreground transition-all cursor-pointer h-10 px-3">
                 <Link href="/settings" className="flex items-center gap-3 w-full">
                   <Settings2 className="h-4 w-4" />
                   <span>Settings</span>
                 </Link>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
         </div>

         {/* User Card */}
         <div className="flex items-center gap-3 w-full group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors border border-transparent hover:border-border/50" onClick={() => signOut()}>
            <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 overflow-hidden">
               {user?.imageUrl ? (
                 <img src={user.imageUrl} className="h-full w-full object-cover" alt="Profile" />
               ) : (
                 <span className="text-xs font-bold text-primary">{user?.firstName?.charAt(0) || "U"}</span>
               )}
            </div>
            <div className="flex flex-col justify-center flex-1 overflow-hidden">
               <span className="text-sm font-semibold text-foreground truncate">{user?.fullName || "User Account"}</span>
               <span className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress || "Sign Out"}</span>
            </div>
            <LogOut className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
