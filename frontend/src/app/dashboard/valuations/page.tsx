"use client";

import { useState, useEffect } from "react";
import { 
    Calculator, 
    Search, 
    Loader2, 
    ArrowRight,
    TrendingUp,
    Filter,
    Calendar,
    User,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ValuationRecord {
  id: number;
  project_id: number;
  project_title: string;
  valuer_name: string;
  calculated_value: number;
  currency: string;
  created_at: string;
}

export default function ValuationsPage() {
  const [valuations, setValuations] = useState<ValuationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchValuations();
  }, []);

  const fetchValuations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/valuations/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setValuations(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredValuations = valuations.filter(v => 
    v.project_title?.toLowerCase().includes(search.toLowerCase()) ||
    v.valuer_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-primary dark:text-white flex items-center">
                    <Calculator className="h-8 w-8 mr-3 text-accent" />
                    Valuation Records
                </h1>
                <p className="text-secondary/60 mt-1 font-medium italic">Global audit log of all validated property appraisals.</p>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-accent text-[#0B3C5D] border-none shadow-xl">
                <CardContent className="p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Appraisals</p>
                    <p className="text-3xl font-black mt-2">{valuations.length}</p>
                </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Registry Health</p>
                    <p className="text-3xl font-black mt-2 text-green-500">100%</p>
                </CardContent>
            </Card>
            <div className="md:col-span-2 flex items-end">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/40 group-focus-within:text-accent transition-colors" />
                    <Input 
                        placeholder="Search by project or valuer..." 
                        className="pl-11 py-6 bg-card border-border rounded-xl focus:ring-accent shadow-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <Card className="border-border shadow-2xl bg-card overflow-hidden">
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="animate-spin text-accent h-8 w-8" />
                    </div>
                ) : filteredValuations.length === 0 ? (
                    <div className="py-20 text-center opacity-40">
                        <TrendingUp className="h-16 w-16 mb-4 mx-auto text-secondary/20" />
                        <p className="font-black uppercase tracking-widest text-sm text-secondary">No records found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/5 border-b border-border">
                                <tr>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary/60">Asset/Project</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary/60">Professional</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary/60">Valuation Date</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary/60 text-right">Appraised Value</th>
                                    <th className="px-6 py-5 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredValuations.map(v => (
                                    <tr key={v.id} className="group hover:bg-secondary/[0.02] transition-colors relative">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-primary dark:text-white truncate max-w-[200px]">{v.project_title}</p>
                                            <span className="text-[10px] text-secondary/50 font-black uppercase tracking-widest">ID: {v.project_id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center">
                                                <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                                                    <User className="h-3 w-3 text-accent" />
                                                </div>
                                                <p className="text-sm font-bold text-foreground/80">{v.valuer_name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-secondary/70">
                                                <Calendar className="h-3 w-3 mr-2" />
                                                <span className="text-[13px] font-medium">{new Date(v.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <p className="text-base font-black text-primary dark:text-accent">
                                                {v.calculated_value.toLocaleString()} 
                                                <span className="text-[10px] ml-1 opacity-50 uppercase">{v.currency}</span>
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Link 
                                                href={`/dashboard/projects/${v.project_id}`}
                                                className="p-2 text-secondary/20 hover:text-accent transition-all inline-block"
                                                title="View in Workspace"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <div className="flex items-center gap-4 p-5 bg-accent/5 rounded-2xl border border-accent/10 shadow-inner">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Calculator className="h-5 w-5 text-accent" />
            </div>
            <p className="text-[11px] font-bold text-accent/80 leading-relaxed uppercase tracking-wider">
                This registry contains finalized valuations. For real-time calculations or to submit new data, please navigate to the specific project workspace.
            </p>
        </div>
    </div>
  );
}
