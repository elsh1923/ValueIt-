"use client";

import { useState, useEffect } from "react";
import { 
    ClipboardList, 
    Search, 
    Loader2, 
    Calendar,
    User,
    ExternalLink,
    Activity,
    Ruler,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface InspectionRecord {
  id: number;
  project_id: number;
  project_title: string;
  inspector_name: string;
  observations: string;
  created_at: string;
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/inspections/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setInspections(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = inspections.filter(i => 
    i.project_title?.toLowerCase().includes(search.toLowerCase()) ||
    i.inspector_name?.toLowerCase().includes(search.toLowerCase()) ||
    i.observations?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        <header>
            <h1 className="text-3xl font-black tracking-tight text-primary dark:text-white flex items-center">
                <ClipboardList className="h-8 w-8 mr-3 text-accent" />
                Inspection Registry
            </h1>
            <p className="text-secondary/60 mt-1 font-medium italic">Centralized log of all site data and observations.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex items-center gap-4">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/40 group-focus-within:text-accent transition-colors" />
                    <Input 
                        placeholder="Search inspections, projects, or inspectors..." 
                        className="pl-11 py-6 bg-card border-border rounded-xl focus:ring-accent shadow-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <Card className="bg-accent/10 border-accent/20 border flex items-center p-6">
                <Activity className="h-5 w-5 text-accent mr-4" />
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent">Total Records</p>
                    <p className="text-2xl font-black text-primary dark:text-white leading-tight">{inspections.length}</p>
                </div>
            </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-accent h-8 w-8" /></div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-card rounded-2xl border border-dashed border-border opacity-50">
                    <Ruler className="h-12 w-12 mx-auto text-secondary/20 mb-4" />
                    <p className="font-bold uppercase tracking-widest text-sm">No inspections found</p>
                </div>
            ) : (
                filtered.map(insp => (
                    <Card key={insp.id} className="border-border shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/20 group-hover:bg-accent transition-colors" />
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <p className="font-bold text-primary dark:text-white text-lg">{insp.project_title}</p>
                                        <span className="text-[10px] bg-secondary/10 px-2 py-0.5 rounded font-black text-secondary tracking-widest uppercase">ID: {insp.project_id}</span>
                                    </div>
                                    <p className="text-sm text-foreground/80 line-clamp-2 italic leading-relaxed">
                                        "{insp.observations}"
                                    </p>
                                    <div className="flex items-center gap-6 pt-2">
                                        <div className="flex items-center text-[11px] font-bold text-secondary/60 uppercase tracking-wider">
                                            <User className="h-3 w-3 mr-2 text-accent" />
                                            {insp.inspector_name}
                                        </div>
                                        <div className="flex items-center text-[11px] font-bold text-secondary/60 uppercase tracking-wider">
                                            <Calendar className="h-3 w-3 mr-2" />
                                            {new Date(insp.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Link 
                                        href={`/dashboard/projects/${insp.project_id}`}
                                        className="inline-flex items-center px-6 py-3 bg-secondary/[0.03] hover:bg-accent/10 text-primary dark:text-white rounded-xl border border-border/50 transition-all font-black text-[11px] uppercase tracking-widest group"
                                    >
                                        Go to Workspace
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    </div>
  );
}
