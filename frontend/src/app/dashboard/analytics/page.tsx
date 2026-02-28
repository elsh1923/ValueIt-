"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, Users, FileText, CheckCircle2, Clock, 
  TrendingUp, AlertCircle, Loader2, Activity 
} from "lucide-react";

interface AnalyticsData {
  overview: {
    total_projects: number;
    completed_projects: number;
    active_projects: number;
    completion_rate: number;
    unassigned_projects: number;
    total_users: number;
    active_users: number;
  };
  project_status_breakdown: Record<string, number>;
  user_role_breakdown: Record<string, number>;
  user_workload: Array<{
    user_id: number;
    name: string;
    email: string;
    role: string;
    assigned_projects: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/v1/analytics/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const analyticsData = await res.json();
        setData(analyticsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-600">{error || "Failed to load analytics"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary dark:text-white">Performance Analytics</h2>
        <p className="text-secondary dark:text-slate-400 mt-1">
          Comprehensive insights into project performance and team productivity.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<FileText className="h-6 w-6" />}
          label="Total Projects"
          value={data.overview.total_projects}
          subtext={`${data.overview.active_projects} active`}
          color="blue"
        />
        <StatsCard
          icon={<CheckCircle2 className="h-6 w-6" />}
          label="Completion Rate"
          value={`${data.overview.completion_rate}%`}
          subtext={`${data.overview.completed_projects} completed`}
          color="green"
        />
        <StatsCard
          icon={<Users className="h-6 w-6" />}
          label="Active Users"
          value={data.overview.active_users}
          subtext={`of ${data.overview.total_users} total`}
          color="purple"
        />
        <StatsCard
          icon={<AlertCircle className="h-6 w-6" />}
          label="Unassigned Projects"
          value={data.overview.unassigned_projects}
          subtext="Need assignment"
          color={data.overview.unassigned_projects > 0 ? "red" : "gray"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Status Breakdown */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-primary dark:text-white">
              <BarChart3 className="h-5 w-5 mr-2 text-accent" />
              Project Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.project_status_breakdown).map(([status, count]) => (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize text-foreground/80">
                      {status.replace("_", " ")}
                    </span>
                    <span className="text-secondary dark:text-secondary/80">{count} projects</span>
                  </div>
                  <div className="w-full bg-secondary/10 dark:bg-secondary/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${getStatusColor(status)}`}
                      style={{
                        width: `${(count / data.overview.total_projects) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Role Breakdown */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-primary dark:text-white">
              <Users className="h-5 w-5 mr-2 text-accent" />
              Team Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.user_role_breakdown).map(([role, count]) => (
                <div key={role} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize text-foreground/80">
                      {role}
                    </span>
                    <span className="text-secondary dark:text-secondary/80">{count} users</span>
                  </div>
                  <div className="w-full bg-secondary/10 dark:bg-secondary/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${getRoleColor(role)}`}
                      style={{
                        width: `${(count / data.overview.total_users) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Workload Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center text-primary dark:text-white">
            <Activity className="h-5 w-5 mr-2 text-accent" />
            User Workload Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.user_workload.length === 0 ? (
            <div className="text-center py-12 text-secondary/60">
              <Users className="h-12 w-12 mx-auto text-secondary/30 mb-3" />
              <p>No users with assigned projects yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/5 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-primary dark:text-white">Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-primary dark:text-white">Email</th>
                    <th className="px-6 py-4 text-left font-semibold text-primary dark:text-white">Role</th>
                    <th className="px-6 py-4 text-left font-semibold text-primary dark:text-white">Assigned Projects</th>
                    <th className="px-6 py-4 text-left font-semibold text-primary dark:text-white">Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.user_workload.map((user) => (
                    <tr key={user.user_id} className="hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-secondary/80">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                          ${user.role === 'admin' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 
                            user.role === 'manager' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 
                            user.role === 'valuer' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 
                            'bg-purple-500/10 text-purple-600 dark:text-purple-400'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground font-semibold">
                        {user.assigned_projects}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-secondary/10 dark:bg-secondary/20 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${getWorkloadColor(user.assigned_projects)}`}
                              style={{
                                width: `${Math.min((user.assigned_projects / 10) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-secondary/70">
                            {user.assigned_projects >= 8 ? "High" : user.assigned_projects >= 4 ? "Medium" : "Low"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ icon, label, value, subtext, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-400/10",
    green: "bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-400/10",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-400/10",
    red: "bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-400/10",
    gray: "bg-secondary/10 text-secondary dark:text-secondary/80 dark:bg-secondary/20",
  };

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.gray}`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-secondary">{label}</p>
          <h4 className="text-2xl font-bold text-primary dark:text-white mt-1">{value}</h4>
          {subtext && <p className="text-xs text-secondary/70 mt-1">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500 dark:bg-yellow-400",
    in_progress: "bg-blue-500 dark:bg-blue-400",
    inspection_completed: "bg-indigo-500 dark:bg-indigo-400",
    valuation_completed: "bg-purple-500 dark:bg-purple-400",
    completed: "bg-green-500 dark:bg-green-400",
  };
  return colors[status] || "bg-slate-500 dark:bg-slate-400";
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    admin: "bg-red-500 dark:bg-red-400",
    manager: "bg-blue-500 dark:bg-blue-400",
    valuer: "bg-green-500 dark:bg-green-400",
    inspector: "bg-purple-500 dark:bg-purple-400",
  };
  return colors[role.toLowerCase()] || "bg-slate-500 dark:bg-slate-400";
}

function getWorkloadColor(count: number): string {
  if (count >= 8) return "bg-red-500 dark:bg-red-400";
  if (count >= 4) return "bg-yellow-500 dark:bg-yellow-400";
  return "bg-green-500 dark:bg-green-400";
}
