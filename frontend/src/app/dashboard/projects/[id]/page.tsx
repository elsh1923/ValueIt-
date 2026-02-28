"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save, User as UserIcon, Calendar, MapPin, Trash2, FolderOpen } from "lucide-react";
import Link from "next/link";
import ChatWindow from "@/components/chat/ChatWindow";
import InspectionWorkspace from "@/components/project/InspectionWorkspace";
import CalculationWorkspace from "@/components/valuation/CalculationWorkspace";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  full_name: string;
  email: string;
  active_projects_count?: number;
}

interface Project {
  id: number;
  title: string;
  client_name: string;
  status: string;
  location: string;
  description: string;
  assigned_valuer_id: number | null;
  assigned_inspector_id: number | null;
  created_at: string;
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const isStaff = user?.role === "admin" || user?.role === "manager";
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [valuers, setValuers] = useState<User[]>([]);
  const [inspectors, setInspectors] = useState<User[]>([]);
  
  const [assignments, setAssignments] = useState({
    assigned_valuer_id: "",
    assigned_inspector_id: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Project using specific endpoint
        const projRes = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}`, { headers });
        
        if (projRes.ok) {
            const found = await projRes.json();
            setProject(found);
            setAssignments({
                assigned_valuer_id: found.assigned_valuer_id?.toString() || "",
                assigned_inspector_id: found.assigned_inspector_id?.toString() || ""
            });
        } else {
            throw new Error("Project not found");
        }

        // 2. Fetch Valuers (only active and approved)
        const valRes = await fetch(`http://127.0.0.1:8000/api/v1/users/?role=valuer&is_approved=true&is_active=true`, { headers });
        if (valRes.ok) setValuers(await valRes.json());

        // 3. Fetch Inspectors (only active and approved)
        const inspRes = await fetch(`http://127.0.0.1:8000/api/v1/users/?role=inspector&is_approved=true&is_active=true`, { headers });
        if (inspRes.ok) setInspectors(await inspRes.json());

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const body = {
        assigned_valuer_id: assignments.assigned_valuer_id ? Number(assignments.assigned_valuer_id) : null,
        assigned_inspector_id: assignments.assigned_inspector_id ? Number(assignments.assigned_inspector_id) : null,
      };

      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to update assignments");

      setSuccess("Team assignments updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to delete project");
      }

      // Redirect to projects list after successful deletion
      router.push("/dashboard/projects");
    } catch (err: any) {
      setError(err.message);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-accent" /></div>;
  if (!project) return <div className="p-8 text-red-500">Project not found</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/projects" className="text-secondary hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-3xl font-bold text-primary dark:text-white">Project Details</h2>
        </div>
        {isStaff && (
          <Button 
            variant="ghost" 
            className="text-red-600 hover:text-red-800 hover:bg-red-500/10 dark:hover:bg-red-500/20"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </Button>
        )}
      </div>

      <div className="flex border-b border-border/50 mb-8 space-x-8 overflow-x-auto scrollbar-hide">
        {[
            { id: "overview", label: "Overview", icon: FolderOpen },
            { id: "inspections", label: "Inspections", icon: Calendar },
            { id: "valuation", label: "Valuation Engine", icon: Save },
            { id: "chat", label: "Team Chat", icon: UserIcon }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 transition-all font-bold text-sm tracking-tight",
                    activeTab === tab.id 
                        ? "border-accent text-accent" 
                        : "border-transparent text-secondary hover:text-primary dark:hover:text-white"
                )}
            >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {activeTab === "overview" && (
            <>
                <div className={cn(
                    "space-y-8",
                    isStaff ? "lg:col-span-2" : "lg:col-span-4"
                )}>
                    <Card className="border-border shadow-md bg-card overflow-hidden">
                        <div className="h-1 bg-accent/20 w-full" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-primary dark:text-white flex items-center justify-between">
                                {project.title}
                                <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded uppercase tracking-widest">
                                    Project ID: {project.id}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div className="space-y-1">
                                    <p className="text-secondary/60 text-[11px] font-bold uppercase tracking-wider">Client Portfolio</p>
                                    <p className="font-bold text-primary dark:text-white text-base">{project.client_name}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-secondary/60 text-[11px] font-bold uppercase tracking-wider">Primary Location</p>
                                    <p className="font-bold text-primary dark:text-white flex items-center justify-end"><MapPin className="h-3 w-3 mr-1 text-accent"/> {project.location || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-secondary/60 text-[11px] font-bold uppercase tracking-wider">Operational Status</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-accent/20 text-accent uppercase tracking-widest border border-accent/20">
                                        {project.status.replace("_", " ")}
                                    </span>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-secondary/60 text-[11px] font-bold uppercase tracking-wider">Registration Date</p>
                                    <p className="font-bold text-primary dark:text-white flex items-center justify-end"><Calendar className="h-3 w-3 mr-1 text-accent"/> {new Date(project.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-secondary/60 text-[11px] font-bold uppercase tracking-wider">Valuation Narrative</p>
                                    <div className="h-[1px] flex-1 mx-4 bg-border/50" />
                                </div>
                                <div className="p-5 bg-secondary/[0.03] dark:bg-white/[0.02] border border-border/50 rounded-2xl text-[13px] text-foreground/80 leading-relaxed italic shadow-inner">
                                    {project.description || "Project narrative hasn't been established yet."}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {isStaff && (
                        <Card className="border-l-4 border-l-accent shadow-lg bg-card overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-lg text-primary dark:text-white flex items-center">
                                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center mr-3">
                                        <UserIcon className="h-4 w-4 text-accent" />
                                    </div>
                                    Strategic Team Allocation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#0B3C5D] dark:text-accent ml-1">Principal Valuer</label>
                                        <select 
                                            className="w-full p-3 border border-border rounded-xl text-sm bg-background dark:bg-secondary/20 text-foreground focus:ring-2 focus:ring-accent outline-none transition-all shadow-sm"
                                            value={assignments.assigned_valuer_id}
                                            onChange={(e) => setAssignments({...assignments, assigned_valuer_id: e.target.value})}
                                        >
                                            <option value="">Select Professional</option>
                                            {valuers.map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.full_name} {u.active_projects_count !== undefined && u.active_projects_count > 0 
                                                        ? `(${u.active_projects_count} active)` 
                                                        : '(Highly Available)'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#0B3C5D] dark:text-accent ml-1">Field Inspector</label>
                                        <select 
                                            className="w-full p-3 border border-border rounded-xl text-sm bg-background dark:bg-secondary/20 text-foreground focus:ring-2 focus:ring-accent outline-none transition-all shadow-sm"
                                            value={assignments.assigned_inspector_id}
                                            onChange={(e) => setAssignments({...assignments, assigned_inspector_id: e.target.value})}
                                        >
                                            <option value="">Select Professional</option>
                                            {inspectors.map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.full_name} {u.active_projects_count !== undefined && u.active_projects_count > 0 
                                                        ? `(${u.active_projects_count} active)` 
                                                        : '(Highly Available)'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">{error}</div>}
                                {success && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-600 dark:text-green-400 font-medium">{success}</div>}

                                <Button onClick={handleSave} disabled={isSaving} className="w-full bg-primary dark:bg-accent text-white dark:text-primary font-black uppercase tracking-widest h-12 rounded-xl shadow-lg hover:shadow-accent/20 transition-all">
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Commit Allocation
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className={cn(
                    "flex flex-col h-[750px]",
                    isStaff ? "lg:col-span-2" : "hidden" // Hide chat in overview for non-staff to keep it clean, available in chat tab
                )}>
                    <ChatWindow projectId={Number(projectId)} className="flex-1 shadow-2xl" />
                </div>
            </>
        )}

        {activeTab === "inspections" && (
            <div className="lg:col-span-4">
                <InspectionWorkspace projectId={Number(projectId)} />
            </div>
        )}

        {activeTab === "valuation" && (
            <div className="lg:col-span-4">
                <CalculationWorkspace 
                    projectId={Number(projectId)} 
                    onSaveSuccess={() => {
                        // Optionally refresh some data or show toast
                    }} 
                />
            </div>
        )}

        {activeTab === "chat" && (
            <div className="lg:col-span-4 flex flex-col h-[700px]">
                <ChatWindow projectId={Number(projectId)} className="flex-1 shadow-2xl" />
            </div>
        )}
      </div>


      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4">Delete Project?</h3>
            <p className="text-secondary mb-8 leading-relaxed">
              Are you sure you want to delete <strong className="text-primary dark:text-white">{project?.title}</strong>? 
              This will permanently remove all related data.
              <span className="block mt-2 font-semibold text-red-600/80">This action cannot be undone.</span>
            </p>
            <div className="flex flex-col sm:flex-row-reverse gap-3">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="text-secondary hover:text-primary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
