"use client";

import { Button } from "@/components/ui/button";
import { ClipboardCheck, MapPin, Camera, UploadCloud, Loader2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function InspectorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    scheduledVisits: 0,
    reportsSubmitted: 0,
    pendingInspections: 0,
  });
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch projects assigned to me as inspector
        const res = await fetch("http://127.0.0.1:8000/api/v1/projects/", { headers });
        const projects = res.ok ? await res.json() : [];

        // Filter for my assigned projects
        const myAssignedProjects = projects.filter((p: any) => 
          p.assigned_inspector_id === (user as any)?.id
        );

        setStats({
          scheduledVisits: myAssignedProjects.filter((p: any) => 
            p.status === "pending" || p.status === "in_progress"
          ).length,
          reportsSubmitted: myAssignedProjects.filter((p: any) => 
            p.status === "inspection_completed" || p.status === "completed"
          ).length,
          pendingInspections: myAssignedProjects.filter((p: any) => 
            p.status === "pending"
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
          <h2 className="text-3xl font-bold text-primary dark:text-white">Field Inspector Workspace</h2>
          <p className="text-secondary dark:text-slate-400 mt-1">Manage site visits and upload inspection data.</p>
        </div>
      </div>

       {/* Quick Stats */}
       <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card rounded-xl p-6 border border-l-4 border-l-accent border-border shadow-sm">
             <div className="flex items-center space-x-3 mb-2">
                <MapPin className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-primary dark:text-white">Scheduled Visits</h3>
             </div>
             <p className="text-3xl font-bold text-foreground">{stats.scheduledVisits}</p>
             <p className="text-xs text-secondary/70 mt-2">{stats.pendingInspections} pending</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
             <div className="flex items-center space-x-3 mb-2">
                <ClipboardCheck className="h-5 w-5 text-green-600" />
                <h3 className="font-bold text-primary dark:text-white">Reports Submitted</h3>
             </div>
             <p className="text-3xl font-bold text-foreground">{stats.reportsSubmitted}</p>
             <p className="text-xs text-secondary/70 mt-2">Completed inspections</p>
        </div>
         <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
             <div className="flex items-center space-x-3 mb-2">
                <Camera className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-primary dark:text-white">Total Assigned</h3>
             </div>
             <p className="text-3xl font-bold text-foreground">{myProjects.length}</p>
             <p className="text-xs text-secondary/70 mt-2">All projects</p>
        </div>
       </div>

      {/* Inspection Schedule */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-primary dark:text-white">My Assigned Inspections</h3>
        {myProjects.length === 0 ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-secondary/30 mb-3" />
            <p className="text-secondary/60">No inspections assigned yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myProjects.map((project) => (
              <div key={project.id} className="bg-card rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded uppercase
                        ${project.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 
                        project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600' : 
                        'bg-green-500/10 text-green-600'}`}>
                        {project.status.replace("_", " ")}
                      </span>
                      <MapPin className="h-5 w-5 text-secondary/40 group-hover:text-accent transition-colors" />
                  </div>
                  <h4 className="font-bold text-primary dark:text-white text-lg">{project.title}</h4>
                  <p className="text-secondary/70 text-sm mb-4">{project.location || "Location not specified"}</p>
                  <div className="flex justify-between items-center border-t border-border pt-4">
                      <p className="text-xs text-secondary/60">Client: {project.client_name}</p>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Button size="sm" variant="ghost" className="text-accent hover:text-accent/80 hover:bg-accent/10 p-0 h-auto font-bold">
                          View Details &rarr;
                        </Button>
                      </Link>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
