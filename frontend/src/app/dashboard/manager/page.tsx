"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, CheckCircle2, AlertCircle, Plus, Loader2 } from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    pendingUsers: 0,
    activeStaff: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all projects
        const projectsRes = await fetch("http://127.0.0.1:8000/api/v1/projects/", { headers });
        const projects = projectsRes.ok ? await projectsRes.json() : [];

        // Fetch pending users
        const pendingRes = await fetch("http://127.0.0.1:8000/api/v1/users/?is_approved=false", { headers });
        const pendingUsers = pendingRes.ok ? await pendingRes.json() : [];

        // Fetch active staff
        const staffRes = await fetch("http://127.0.0.1:8000/api/v1/users/?is_active=true&is_approved=true", { headers });
        const staff = staffRes.ok ? await staffRes.json() : [];

        setStats({
          totalProjects: projects.length,
          completedProjects: projects.filter((p: any) => p.status === "completed").length,
          pendingUsers: pendingUsers.length,
          activeStaff: staff.length,
        });

        // Get recent projects (last 5)
        setRecentProjects(projects.slice(0, 5));
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notification Area */}
      {stats.pendingUsers > 0 && (
         <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-3">
                <div className="bg-amber-500/20 p-2 rounded-full">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-300">Action Required</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-200/80">You have <span className="font-bold">{stats.pendingUsers} pending user(s)</span> waiting for approval.</p>
                </div>
            </div>
            <Link href="/dashboard/admin/users">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white border-none shadow-none">
                    Review Requests
                </Button>
            </Link>
         </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">Manager Overview</h2>
          <p className="text-secondary dark:text-slate-400 mt-1">Monitor project performance and manage team approvals.</p>
        </div>
        <Link href="/dashboard/projects/create">
            <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard 
            icon={<FileText className="h-6 w-6" />}
            label="Total Projects"
            value={stats.totalProjects.toString()}
        />
        <StatsCard 
            icon={<CheckCircle2 className="h-6 w-6" />}
            label="Completed"
            value={stats.completedProjects.toString()}
        />
        <StatsCard 
            icon={<AlertCircle className="h-6 w-6" />}
            label="Pending Approval"
            value={stats.pendingUsers.toString()}
            alert={stats.pendingUsers > 0}
        />
        <StatsCard 
            icon={<Users className="h-6 w-6" />}
            label="Active Staff"
            value={stats.activeStaff.toString()}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Projects Table - Takes 2 cols */}
        <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-primary dark:text-white">Recent Projects</h3>
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {recentProjects.length === 0 ? (
                  <div className="p-6 text-center text-secondary/60 py-12">
                      <FileText className="h-12 w-12 mx-auto text-secondary/30 mb-3" />
                      <p>No projects yet.</p>
                      <Link href="/dashboard/projects/create">
                        <Button variant="link" className="text-accent hover:text-accent/80">Create your first project</Button>
                      </Link>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/5 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-primary dark:text-white">Title</th>
                        <th className="px-6 py-4 font-semibold text-primary dark:text-white">Client</th>
                        <th className="px-6 py-4 font-semibold text-primary dark:text-white">Status</th>
                        <th className="px-6 py-4 font-semibold text-primary dark:text-white text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{project.title}</td>
                          <td className="px-6 py-4 text-secondary/80">{project.client_name}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${project.status === 'completed' ? 'bg-green-500/10 text-green-600' : 
                              project.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 
                              'bg-blue-500/10 text-blue-600'}`}>
                              {project.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/dashboard/projects/${project.id}`}>
                              <Button size="sm" variant="ghost" className="text-secondary hover:text-primary dark:text-slate-300 dark:hover:text-white">
                                Details
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

        {/* User Approvals Widget - Takes 1 col */}
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary dark:text-white">Pending User Approvals</h3>
            <div className="bg-card rounded-xl shadow-sm border border-border p-4 space-y-3">
                 {stats.pendingUsers === 0 ? (
                    <div className="text-center py-8 text-secondary/60 text-sm">
                        <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                        No pending approvals.
                    </div>
                 ) : (
                    <div className="text-center py-6">
                        <p className="text-primary dark:text-white font-medium mb-3">You have {stats.pendingUsers} request(s).</p>
                         <Link href="/dashboard/admin/users">
                            <Button className="w-full bg-primary dark:bg-accent text-white dark:text-primary font-bold">Go to Approvals</Button>
                        </Link>
                    </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, trend, alert }: any) {
    return (
        <div className={`p-6 bg-card rounded-xl border ${alert ? 'border-red-500/20 bg-red-500/5' : 'border-border'} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${alert ? 'bg-red-500/10 text-red-600' : 'bg-accent/10 text-accent'}`}>
                    {icon}
                </div>
                {alert && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
            </div>
            <div>
                <p className="text-sm font-medium text-secondary">{label}</p>
                <h4 className="text-2xl font-bold text-primary dark:text-white mt-1">{value}</h4>
                {trend && <p className="text-xs text-secondary/70 mt-1">{trend}</p>}
            </div>
        </div>
    )
}
