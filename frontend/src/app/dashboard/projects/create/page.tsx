"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Need to create this or use standard textarea
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    location: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create project");
      }

      router.push("/dashboard/projects");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/projects" className="text-secondary hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-3xl font-bold text-primary dark:text-white">Create New Project</h2>
      </div>

      <Card className="border-border shadow-md bg-card">
        <CardHeader>
            <CardTitle className="text-primary dark:text-white">Project Details</CardTitle>
            <CardDescription className="text-secondary/70">Enter the information for the new valuation project.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-primary dark:text-white font-semibold">Project Title <span className="text-red-500">*</span></Label>
                    <Input 
                        id="title" 
                        required
                        value={formData.title} 
                        onChange={handleChange}
                        placeholder="e.g. Riverside Commercial Complex Valuation"
                        className="bg-background border-border focus:ring-accent"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="client_name" className="text-primary dark:text-white font-semibold">Client Name <span className="text-red-500">*</span></Label>
                        <Input 
                            id="client_name" 
                            required
                            value={formData.client_name} 
                            onChange={handleChange}
                            placeholder="e.g. ACME Corp"
                            className="bg-background border-border focus:ring-accent"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-primary dark:text-white font-semibold">Property Location</Label>
                        <Input 
                            id="location" 
                            value={formData.location} 
                            onChange={handleChange}
                            placeholder="e.g. 123 Main St, Addis Ababa"
                            className="bg-background border-border focus:ring-accent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="client_email" className="text-primary dark:text-white font-semibold">Client Email</Label>
                        <Input 
                            id="client_email" 
                            type="email"
                            value={formData.client_email} 
                            onChange={handleChange}
                            placeholder="contact@acme.com"
                            className="bg-background border-border focus:ring-accent"
                        />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="client_phone" className="text-primary dark:text-white font-semibold">Client Phone</Label>
                        <Input 
                            id="client_phone" 
                            value={formData.client_phone} 
                            onChange={handleChange}
                            placeholder="+251 9..."
                            className="bg-background border-border focus:ring-accent"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-primary dark:text-white font-semibold">Description / Notes</Label>
                    <textarea
                        id="description"
                        className="flex min-h-[100px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Additional details about the project..."
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="bg-primary dark:bg-accent text-white dark:text-primary font-bold shadow-lg">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Create Project
                    </Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
