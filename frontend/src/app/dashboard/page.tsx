"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const role = (user as any)?.role;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
        router.push("/login"); // Should be handled by layout but extra safety
        return;
    }

    if (role) {
      console.log("User role:", role); // Debug log
      const normalizedRole = role.toLowerCase();
      
      switch (normalizedRole) {
        case "manager":
        case "admin": 
          router.push("/dashboard/manager");
          break;
        case "valuer":
            router.push("/dashboard/valuer");
            break;
        case "inspector":
            router.push("/dashboard/inspector");
            break;
        default:
             setError(`Role not recognized: ${role}`);
             break;
      }
    } else {
        setError("User has no role assigned.");
    }
  }, [user, role, isLoading, router]);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-6 bg-background">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-primary dark:text-white mb-2">Access Issue</h2>
            <p className="text-secondary dark:text-slate-400 mb-6">{error}</p>
             <div className="flex gap-4">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Retry
                </Button>
                <Button onClick={() => router.push("/login")} variant="default" className="bg-primary dark:bg-accent dark:text-primary">
                    Back to Login
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-96 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
        <p className="text-secondary dark:text-slate-400 font-medium">Redirecting to your workspace...</p>
        <p className="text-sm text-secondary/60 mt-2">Detected Role: {role || "Loading..."}</p>
    </div>
  );
}
