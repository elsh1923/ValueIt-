"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { NotificationIndicator } from "@/components/dashboard/notification-indicator";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="fn-full h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                     <h1 className="text-2xl font-bold text-primary dark:text-white">Dashboard</h1>
                     <p className="text-secondary dark:text-slate-400 font-medium text-sm">Welcome back, {user?.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <ModeToggle />
                    <NotificationIndicator />
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-primary dark:text-white">
                            {user?.full_name && user.full_name !== user.email ? user.full_name : (user?.email?.split('@')[0] || "User")}
                        </span>
                        <span className="text-[10px] text-accent font-bold uppercase tracking-widest leading-none">
                            {user?.role || "Member"}
                        </span>
                    </div>
                    <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center text-primary font-bold border-2 border-accent/20 bg-card shadow-sm">
                        {user?.avatar_url ? (
                            <img 
                                src={`http://localhost:8000${user.avatar_url.startsWith('/') ? '' : '/'}${user.avatar_url}?v=${Date.now()}`} 
                                alt="User Profile" 
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            (user?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()
                        )}
                    </div>
                </div>
            </header>

            {children}
        </div>
      </main>
    </div>
  );
}
