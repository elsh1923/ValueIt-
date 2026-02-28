"use client";

import { useState, useEffect } from "react";
import { 
    Calculator, 
    Plus, 
    Trash2, 
    Search, 
    Loader2, 
    Save, 
    ArrowRight,
    Package,
    TrendingUp,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MaterialPrice {
  id: number;
  material_name: string;
  unit: string;
  price: number;
}

interface CalculationLine {
  materialId: number;
  materialName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export default function CalculationWorkspace({ projectId, onSaveSuccess }: { projectId: number, onSaveSuccess?: () => void }) {
  const [prices, setPrices] = useState<MaterialPrice[]>([]);
  const [lines, setLines] = useState<CalculationLine[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/v1/pricing/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setPrices(await res.json());
      } catch (e) {
        console.error("Failed to fetch prices", e);
      } finally {
        setIsLoadingPrices(false);
      }
    };
    fetchPrices();
  }, []);

  const filteredPrices = prices.filter(p => 
    p.material_name.toLowerCase().includes(search.toLowerCase()) &&
    !lines.some(l => l.materialId === p.id)
  );

  const addLine = (m: MaterialPrice) => {
    setLines([...lines, {
      materialId: m.id,
      materialName: m.material_name,
      unit: m.unit,
      unitPrice: m.price,
      quantity: 1,
      total: m.price
    }]);
    setSearch("");
    setIsSearching(false);
  };

  const removeLine = (id: number) => {
    setLines(lines.filter(l => l.materialId !== id));
  };

  const updateQuantity = (id: number, qty: string) => {
    const nQty = parseFloat(qty) || 0;
    setLines(lines.map(l => 
      l.materialId === id ? { ...l, quantity: nQty, total: nQty * l.unitPrice } : l
    ));
  };

  const grandTotal = lines.reduce((acc, curr) => acc + curr.total, 0);

  const handleSaveValuation = async () => {
    setIsSaving(true);
    try {
        const token = localStorage.getItem("token");
        const body = {
            project_id: projectId,
            calculated_value: grandTotal,
            currency: "ETB",
            calculation_details: { lines },
            pricing_references_used: prices.filter(p => lines.some(l => l.materialId === p.id))
        };

        const res = await fetch("http://127.0.0.1:8000/api/v1/valuations/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error("Failed to save valuation");
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        if (onSaveSuccess) onSaveSuccess();
    } catch (e) {
        console.error(e);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Calculator Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                 <Card className="bg-primary dark:bg-card border-none shadow-2xl overflow-hidden text-white dark:text-foreground">
                    <CardContent className="p-8 relative">
                        <Calculator className="absolute right-[-20px] top-[-20px] h-40 w-40 text-white/5 dark:text-primary/10" />
                        <div className="relative z-10">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] opacity-70">Project Valuation</h3>
                            <p className="text-4xl font-black mt-2">
                                {grandTotal.toLocaleString()} <span className="text-lg opacity-50">ETB</span>
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10 dark:border-border/50 space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                                    <span>Items Included</span>
                                    <span>{lines.length}</span>
                                </div>
                                <Button 
                                    onClick={handleSaveValuation}
                                    disabled={lines.length === 0 || isSaving}
                                    className="w-full bg-accent hover:bg-accent/90 text-primary font-black py-6 rounded-xl shadow-lg transition-all active:scale-95"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : success ? <CheckCircle2 className="mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                                    {isSaving ? "Finalizing..." : success ? "Valuation Saved" : "Generate Report"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Material Search */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary/60 ml-1">Market Index Lookup</h4>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/40 group-focus-within:text-accent transition-colors" />
                        <Input 
                            placeholder="Type to search materials..." 
                            className="pl-11 py-6 bg-card border-border rounded-xl focus:ring-accent shadow-sm"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setIsSearching(e.target.value.length > 0);
                            }}
                        />
                        {isSearching && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                                {isLoadingPrices ? (
                                    <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-accent" /></div>
                                ) : filteredPrices.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-secondary italic">No fresh materials found</div>
                                ) : (
                                    filteredPrices.map(m => (
                                        <button 
                                            key={m.id}
                                            onClick={() => addLine(m)}
                                            className="w-full p-4 flex items-center justify-between hover:bg-accent/10 transition-colors border-b border-border/50 last:border-0"
                                        >
                                            <div className="text-left">
                                                <p className="font-bold text-primary dark:text-white text-sm">{m.material_name}</p>
                                                <p className="text-[10px] text-secondary/60 uppercase font-black">{m.unit}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-accent font-black">{m.price.toLocaleString()} </p>
                                                <Plus className="h-4 w-4 text-accent ml-auto" />
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Bill of Quantities */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary/60 flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2 text-accent" />
                        Cost Breakdown Structure
                    </h4>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden min-h-[400px]">
                    {lines.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-40">
                            <TrendingUp className="h-16 w-16 mb-6 text-secondary/20" />
                            <p className="font-black uppercase tracking-widest text-sm text-secondary">No data entries</p>
                            <p className="text-xs italic mt-2">Start by searching and adding materials from the market index.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-secondary/5 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary/60">Description</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary/60">Qty</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary/60">Unit Price</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary/60 text-right">Line total</th>
                                    <th className="px-4 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {lines.map(line => (
                                    <tr key={line.materialId} className="group hover:bg-secondary/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-primary dark:text-white">{line.materialName}</p>
                                            <span className="text-[10px] text-secondary/50 font-black uppercase tracking-widest">{line.unit}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Input 
                                                type="number"
                                                className="w-24 h-9 bg-background/50 border-border font-bold text-center rounded-lg"
                                                value={line.quantity}
                                                onChange={(e) => updateQuantity(line.materialId, e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-secondary/80">
                                            {line.unitPrice.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-base font-black text-primary dark:text-accent">
                                                {line.total.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button 
                                                onClick={() => removeLine(line.materialId)}
                                                className="p-2 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-xl border border-accent/10">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Package className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-[10px] font-bold text-accent tracking-[0.05em]">All pricing references are synchronized with the Enterprise Market Data Index.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
