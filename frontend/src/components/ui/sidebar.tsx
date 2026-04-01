"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  ClipboardCheck,
  Calculator,
  Settings,
  LogOut,
  Users,
  Bell,
  BarChart3
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role = (user as any)?.role || "guest"; // fallback

  const links = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      roles: ["manager", "valuer", "inspector"],
    },
    {
      href: "/dashboard/projects",
      label: "Projects",
      icon: FolderOpen,
      roles: ["manager", "valuer", "inspector"],
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: BarChart3,
      roles: ["manager"],
    },
    {
      href: "/dashboard/inspections", 
      label: "Inspections",
      icon: ClipboardCheck,
      roles: ["manager", "inspector"],
    },
    {
      href: "/dashboard/valuations",
      label: "Valuations",
      icon: Calculator,
      roles: ["manager", "valuer"],
    },
    {
      href: "/dashboard/pricing",
      label: role === "admin" ? "Price Management" : "Pricing Data",
      icon: Settings,
      roles: ["admin", "manager", "valuer"],
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: Users,
      roles: ["manager"],
    },
    {
      href: "/dashboard/profile",
      label: "Settings",
      icon: Settings,
      roles: ["manager", "valuer", "inspector"],
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
      roles: ["manager", "valuer", "inspector"],
    },
  ];

  const filteredLinks = links.filter((link) => link.roles.includes(role));

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar text-white transition-colors duration-300">
      <Link 
        href="/" 
        className="flex h-16 items-center px-6 font-bold text-xl tracking-tight border-b border-border hover:opacity-80 transition-opacity"
      >
        Value<span className="text-[#C9A227]">It</span>
      </Link>
      
      {/* User Profile Section at Top */}
      <div className="border-b border-border p-4 bg-white/5">
        <div className="flex items-center space-x-3 px-3 py-1">
            <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center text-primary font-bold border border-accent/30 bg-accent/10 flex-shrink-0">
                {user?.avatar_url ? (
                    <img 
                        src={`http://localhost:8000${user.avatar_url.startsWith('/') ? '' : '/'}${user.avatar_url}?v=${Date.now()}`} 
                        alt="User Profile" 
                        className="h-full w-full object-cover"
                    />
                ) : (
                    (user?.email?.[0] || (user as any)?.full_name?.[0] || "U").toUpperCase()
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-white">
                    {user?.full_name && user.full_name !== user.email ? user.full_name : (user?.email?.split('@')[0] || "User")}
                </p>
                <p className="text-[10px] uppercase font-bold text-[#C9A227] tracking-wider truncate opacity-90">{ role }</p>
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === "/dashboard"
              ? pathname === "/dashboard" || ["/dashboard/manager", "/dashboard/valuer", "/dashboard/inspector"].includes(pathname)
              : pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#C9A227] text-[#0B3C5D] shadow-md dark:shadow-amber-900/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-border p-4">
        <button
          onClick={logout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
