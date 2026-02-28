"use client";

import { useState, useEffect } from "react";
import { 
    ClipboardList, 
    Plus, 
    Loader2, 
    ArrowRight,
    Camera,
    FileText,
    Ruler,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming it exists or I'll create/standardize
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface InspectionPhoto {
  id: number;
  photo_url: string;
  description?: string;
}

interface Inspection {
  id: number;
  observations: string;
  measurements: Record<string, any>;
  site_notes: string;
  created_at: string;
  inspector_name?: string;
  photos?: InspectionPhoto[];
}

export default function InspectionWorkspace({ projectId }: { projectId: number }) {
  const { user } = useAuth();
  const isInspector = user?.role === "inspector" || user?.role === "admin" || user?.role === "manager";
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    observations: "",
    site_notes: "",
    measurements: [{ key: "", value: "" }]
  });
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  useEffect(() => {
    fetchInspections();
  }, [projectId]);

  const fetchInspections = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/v1/inspections/?project_id=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setInspections(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const addMeasurementField = () => {
    setForm({ ...form, measurements: [...form.measurements, { key: "", value: "" }] });
  };

  const handleMeasurementChange = (index: number, field: "key" | "value", val: string) => {
    const newMeasurements = [...form.measurements];
    newMeasurements[index][field] = val;
    setForm({ ...form, measurements: newMeasurements });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        const token = localStorage.getItem("token");
        const structuredMeasurements = form.measurements.reduce((acc: any, curr) => {
            if (curr.key) acc[curr.key] = curr.value;
            return acc;
        }, {});

        // 1. Create Core Inspection Record
        const body = {
            project_id: projectId,
            observations: form.observations,
            site_notes: form.site_notes,
            measurements: structuredMeasurements
        };

        const res = await fetch("http://127.0.0.1:8000/api/v1/inspections/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            const inspData = await res.json();
            
            // 2. Upload Photos if any
            if (selectedPhotos.length > 0) {
                const formData = new FormData();
                selectedPhotos.forEach(file => formData.append("files", file));
                
                await fetch(`http://127.0.0.1:8000/api/v1/inspections/${inspData.id}/photos`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                });
            }

            setForm({ observations: "", site_notes: "", measurements: [{ key: "", value: "" }] });
            setSelectedPhotos([]);
            setShowForm(false);
            fetchInspections();
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary dark:text-white flex items-center">
                <ClipboardList className="h-5 w-5 mr-3 text-accent" />
                Site Reports
            </h3>
            {isInspector && !showForm && (
                <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest px-6"
                >
                    <Plus className="mr-2 h-4 w-4" /> New Site Entry
                </Button>
            )}
        </div>

        {showForm && (
            <Card className="border-accent/20 shadow-2xl bg-card overflow-hidden animate-in slide-in-from-top-4 duration-300">
                <CardHeader className="bg-accent/5 border-b border-accent/10">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-[#0B3C5D] dark:text-accent">New Inspection Submission</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Site Observations</label>
                            <textarea 
                                className="w-full p-4 bg-background dark:bg-secondary/10 border border-border rounded-2xl min-h-[150px] text-sm focus:ring-2 focus:ring-accent outline-none"
                                placeholder="Describe current site conditions..."
                                value={form.observations}
                                onChange={(e) => setForm({...form, observations: e.target.value})}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Critical Measurements</label>
                            <div className="space-y-3">
                                {form.measurements.map((m, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input 
                                            placeholder="Label (e.g. Area, Floors)" 
                                            className="flex-1 bg-background h-11 rounded-xl"
                                            value={m.key}
                                            onChange={(e) => handleMeasurementChange(idx, "key", e.target.value)}
                                        />
                                        <Input 
                                            placeholder="Value" 
                                            className="flex-1 bg-background h-11 rounded-xl"
                                            value={m.value}
                                            onChange={(e) => handleMeasurementChange(idx, "value", e.target.value)}
                                        />
                                    </div>
                                ))}
                                <Button variant="ghost" size="sm" onClick={addMeasurementField} className="text-accent font-bold hover:bg-accent/10">
                                    <Plus className="h-4 w-4 mr-2" /> Add Param
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Technical Notes</label>
                            <textarea 
                                className="w-full p-4 bg-background dark:bg-secondary/10 border border-border rounded-xl min-h-[100px] text-sm focus:ring-2 focus:ring-accent outline-none"
                                placeholder="Add any specific technical or site constraints..."
                                value={form.site_notes}
                                onChange={(e) => setForm({...form, site_notes: e.target.value})}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-secondary/60 ml-1">Site Photos (Evidence)</label>
                            <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center bg-secondary/[0.02] hover:bg-accent/[0.03] transition-colors relative cursor-pointer group">
                                <Plus className="h-8 w-8 text-secondary/40 group-hover:text-accent transition-colors" />
                                <p className="text-xs font-bold text-secondary/60 mt-2 uppercase tracking-widest">Select Site Photos</p>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setSelectedPhotos(Array.from(e.target.files));
                                        }
                                    }}
                                />
                                {selectedPhotos.length > 0 && (
                                    <p className="mt-4 text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                                        {selectedPhotos.length} Photos Selected
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setShowForm(false)} className="text-secondary font-bold">Cancel</Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting}
                            className="bg-primary dark:bg-accent text-white dark:text-primary font-black uppercase tracking-widest h-12 px-10 rounded-xl"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit To Registry"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="space-y-6">
            {inspections.length === 0 ? (
                <div className="p-20 text-center bg-secondary/[0.02] border border-dashed border-border rounded-3xl">
                    <Ruler className="h-12 w-12 mx-auto text-secondary/20 mb-4" />
                    <p className="text-secondary/60 text-sm font-bold uppercase tracking-widest">No site records found</p>
                </div>
            ) : (
                inspections.map((insp) => (
                    <Card key={insp.id} className="border-border shadow-sm hover:shadow-md transition-all group">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-2 w-2 rounded-full bg-accent" />
                                            <span className="text-xs font-black uppercase tracking-widest text-primary dark:text-white">Record ID: {insp.id}</span>
                                        </div>
                                        <span className="text-[10px] bg-secondary/10 px-2 py-1 rounded font-bold text-secondary">{new Date(insp.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                        {insp.observations}
                                    </p>
                                    
                                    {/* Photo Gallery */}
                                    {insp.photos && insp.photos.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                            {insp.photos.map((photo: InspectionPhoto) => (
                                                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm group/photo">
                                                    <img 
                                                        src={`http://localhost:8000${photo.photo_url}`} 
                                                        alt={photo.description || "Site evidence"} 
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover/photo:scale-110"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="p-4 bg-secondary/[0.03] rounded-xl border border-border/50 text-[13px] italic text-secondary">
                                        {insp.site_notes || "No technical notes provided."}
                                    </div>
                                </div>
                                <div className="w-full md:w-64 space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Measurements</h4>
                                    <div className="space-y-2">
                                        {Object.entries(insp.measurements || {}).map(([k, v]) => (
                                            <div key={k} className="flex items-center justify-between bg-white dark:bg-secondary/20 p-3 rounded-lg border border-border/50">
                                                <span className="text-[11px] font-bold text-secondary/70 uppercase">{k}</span>
                                                <span className="font-black text-primary dark:text-white">{String(v)}</span>
                                            </div>
                                        ))}
                                    </div>
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
