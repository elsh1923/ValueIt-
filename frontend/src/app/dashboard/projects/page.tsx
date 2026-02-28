"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, FolderOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Project {
  id: number;
  title: string;
  client_name: string;
  status: string;
  location: string;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const isStaff = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/v1/projects/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
      );
  }

  return (
    <div className="space-y-8 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">Projects</h2>
          <p className="text-secondary dark:text-slate-400 mt-1">
            {isStaff ? "Manage all valuation projects." : "View your assigned valuation projects."}
          </p>
        </div>
        {isStaff && (
          <Link href="/dashboard/projects/create">
              <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {projects.length === 0 ? (
            <div className="p-12 text-center text-secondary/60">
                <FolderOpen className="h-12 w-12 mx-auto text-secondary/30 mb-3" />
                <p>No projects found. Create one to get started.</p>
            </div>
        ) : (
            <table className="w-full text-left text-sm">
            <thead className="bg-secondary/5 border-b border-border">
                <tr>
                <th className="px-6 py-4 font-semibold text-primary dark:text-white">Title</th>
                <th className="px-6 py-4 font-semibold text-primary dark:text-white">Client</th>
                <th className="px-6 py-4 font-semibold text-primary dark:text-white">Location</th>
                <th className="px-6 py-4 font-semibold text-primary dark:text-white">Status</th>
                <th className="px-6 py-4 font-semibold text-primary dark:text-white text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {projects.map((project) => (
                <tr key={project.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{project.title}</td>
                    <td className="px-6 py-4 text-secondary/80">{project.client_name}</td>
                    <td className="px-6 py-4 text-secondary/80">{project.location || "-"}</td>
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
                            <Button size="sm" variant="ghost" className="text-secondary hover:text-primary dark:text-slate-300 dark:hover:text-white hover:bg-secondary/10">
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
  );
}
