"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  ShieldAlert,
  Menu,
  Home,
  Image
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  role: string | "admin" | "super_admin";
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      allowedRoles: ["admin", "super_admin"],
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      allowedRoles: ["admin", "super_admin"],
    },
    {
      name: "Events Management",
      href: "/admin/events",
      icon: CalendarDays,
      allowedRoles: ["admin", "super_admin"],
    },
    {
      name:"Photo Gallery",
      href:"/admin/gallery",
      icon:Image,
      allowedRoles:["admin", "super_admin"],
    },
    {
      name: "Club Settings",
      href: "/admin/settings",
      icon: Settings,
      allowedRoles: ["super_admin"],
    },
    {
      name: "Security & Moderation",
      href: "/admin/security",
      icon: ShieldAlert,
      allowedRoles: ["super_admin"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(role),
  );

  const renderNavItems = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between pb-6">
      <nav className="py-6 px-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-muted/50 focus:outline-hidden",
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto pt-4 border-t border-border/50">
        <Link
          href="/"
          onClick={() => isMobile && setIsOpen(false)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus:outline-hidden border border-border/50 bg-background/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 shadow-sm",
          )}
        >
          <Home className="w-5 h-5 shrink-0" />
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between bg-card border-b border-border/50 h-16 px-4 w-full shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
            Admin Portal
          </span>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            {role.replace("_", " ")}
          </span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Admin Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[80vw] sm:w-[350px] p-0 flex flex-col"
          >
            <SheetHeader className="h-16 flex items-start justify-center px-6 border-b border-border/50 shrink-0 m-0 space-y-0 text-left">
              <SheetTitle className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
                  Admin Portal
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto w-full flex-1 flex flex-col">
              {renderNavItems(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 min-h-screen bg-card border-r border-border/50 text-card-foreground hidden md:flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
          <span className="text-xl font-bold tracking-tight bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
            Admin
          </span>
          <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            {role.replace("_", " ")}
          </span>
        </div>
        <div className="overflow-y-auto w-full flex-1 flex flex-col">
          {renderNavItems(false)}
        </div>
      </aside>
    </>
  );
}
