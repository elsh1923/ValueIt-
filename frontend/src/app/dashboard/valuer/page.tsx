"use client";

import { Button } from "@/components/ui/button";
import { Calculator, ClipboardList, Clock, Search, Loader2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ValuerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedProjects: 0,
    pendingReview: 0,
    completedThisMonth: 0,
  });
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch projects assigned to me
        const res = await fetch("http://127.0.0.1:8000/api/v1/projects/", { headers });
        const projects = res.ok ? await res.json() : [];

        // Filter for my assigned projects
        const myAssignedProjects = projects.filter((p: any) => 
          p.assigned_valuer_id === (user as any)?.id
        );

        setStats({
          assignedProjects: myAssignedProjects.length,
          pendingReview: myAssignedProjects.filter((p: any) => 
            p.status === "in_progress" || p.status === "pending"
          ).length,
          completedThisMonth: myAssignedProjects.filter((p: any) => 
            p.status === "valuation_completed" || p.status === "completed"
          ).length,
        });

        setMyProjects(myAssignedProjects);
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">Valuer Workspace</h2>
          <p className="text-secondary dark:text-slate-400 mt-1">Manage your assigned valuations and access pricing tools.</p>
        </div>
      </div>

       {/* Quick Stats */}
       <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-primary dark:bg-card rounded-xl p-6 text-white dark:text-foreground shadow-lg dark:shadow-none border border-transparent dark:border-border relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-white/70 dark:text-muted-foreground font-medium">Assigned to Me</p>
                <h3 className="text-4xl font-bold mt-2 text-white dark:text-primary">{stats.assignedProjects}</h3>
                <p className="text-xs text-accent mt-1">{stats.pendingReview} pending review</p>
            </div>
             <ClipboardList className="absolute right-[-10px] bottom-[-10px] h-32 w-32 text-white/5 dark:text-primary/10" />
        </div>
         <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col justify-center">
             <div className="flex items-center space-x-3 mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-primary dark:text-white">Pending Review</h3>
             </div>
             <p className="text-3xl font-bold text-foreground">{stats.pendingReview}</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col justify-center">
             <div className="flex items-center space-x-3 mb-2">
                <Calculator className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-primary dark:text-white">Completed</h3>
             </div>
             <p className="text-3xl font-bold text-foreground">{stats.completedThisMonth}</p>
        </div>
       </div>

      {/* Task List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-primary dark:text-white">My Assigned Projects</h3>
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            {myProjects.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p>No projects assigned yet.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                      <tr>
                          <th className="p-4 font-semibold text-primary dark:text-white">Project Name</th>
                          <th className="p-4 font-semibold text-primary dark:text-white">Client</th>
                          <th className="p-4 font-semibold text-primary dark:text-white">Status</th>
                          <th className="p-4 font-semibold text-primary dark:text-white">Location</th>
                          <th className="p-4 font-semibold text-primary dark:text-white text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                      {myProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-secondary/5 transition-colors">
                            <td className="p-4 font-medium text-foreground">{project.title}</td>
                            <td className="p-4 text-secondary/80">{project.client_name}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
                                ${project.status === 'completed' || project.status === 'valuation_completed' ? 'bg-green-500/10 text-green-600' : 
                                project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600' : 
                                'bg-amber-500/10 text-amber-600'}`}>
                                {project.status.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-4 text-secondary/80">{project.location || "N/A"}</td>
                            <td className="p-4 text-right">
                              <Link href={`/dashboard/projects/${project.id}`}>
                                <Button size="sm" variant="outline" className="text-secondary hover:text-primary dark:border-border dark:hover:bg-secondary/10">
                                  View Details
                                </Button>
                              </Link>
                            </td>
                        </tr>
                      ))}
                  </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
}
