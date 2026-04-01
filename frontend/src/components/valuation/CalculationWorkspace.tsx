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
    CheckCircle2,
    Home,
    Hammer,
    MapPin,
    AlertCircle,
    Info,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Valuation Parameters
  const [landValue, setLandValue] = useState<number>(0);
  const [laborPercent, setLaborPercent] = useState<number>(25);
  const [overheadPercent, setOverheadPercent] = useState<number>(10);
  const [depreciationPercent, setDepreciationPercent] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<"materials" | "adjustments" | "summary">("materials");

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

  // Cost Calculations
  const materialTotal = lines.reduce((acc, curr) => acc + curr.total, 0);
  const laborCost = materialTotal * (laborPercent / 100);
  const overheadCost = (materialTotal + laborCost) * (overheadPercent / 100);
  const replacementCost = materialTotal + laborCost + overheadCost;
  const improvementValue = replacementCost * (1 - depreciationPercent / 100);
  const finalValuation = improvementValue + landValue;

  const handleSaveValuation = async () => {
    setIsSaving(true);
    try {
        const token = localStorage.getItem("token");
        const body = {
            project_id: projectId,
            calculated_value: finalValuation,
            currency: "ETB",
            calculation_details: { 
                materials: lines,
                material_total: materialTotal,
                labor_percent: laborPercent,
                labor_cost: laborCost,
                overhead_percent: overheadPercent,
                overhead_cost: overheadCost,
                replacement_cost: replacementCost,
                depreciation_percent: depreciationPercent,
                land_value: landValue,
                final_valuation: finalValuation
            },
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
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-muted/30 p-1.5 rounded-2xl border border-border/50 max-w-fit">
            {[
                { id: "materials", label: "Material Index (BoQ)", icon: Package },
                { id: "adjustments", label: "Appraisal Factors", icon: Hammer },
                { id: "summary", label: "Final Appraisal", icon: TrendingUp }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={cn(
                        "flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                        activeSection === tab.id 
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                            : "text-secondary/60 hover:text-primary hover:bg-secondary/10"
                    )}
                >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content Area (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
                
                {activeSection === "materials" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-secondary/60 flex items-center">
                                <Search className="h-4 w-4 mr-2 text-accent" />
                                Add Construction Materials
                            </h4>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary/40 group-focus-within:text-accent transition-colors" />
                            <Input 
                                placeholder="Search materials (e.g. Concrete, Steel, Paint)..." 
                                className="pl-12 py-8 bg-card border-border rounded-2xl focus:ring-accent shadow-xl text-lg font-medium"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setIsSearching(e.target.value.length > 0);
                                }}
                            />
                            {isSearching && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                                    {isLoadingPrices ? (
                                        <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-accent" /></div>
                                    ) : filteredPrices.length === 0 ? (
                                        <div className="p-8 text-center text-sm text-secondary italic">No fresh materials found in this category</div>
                                    ) : (
                                        filteredPrices.map(m => (
                                            <button 
                                                key={m.id}
                                                onClick={() => addLine(m)}
                                                className="w-full p-6 flex items-center justify-between hover:bg-accent/10 transition-colors border-b border-border/50 last:border-0"
                                            >
                                                <div className="text-left">
                                                    <p className="font-black text-primary dark:text-white text-lg">{m.material_name}</p>
                                                    <p className="text-xs text-secondary/60 uppercase font-black tracking-widest">{m.unit}</p>
                                                </div>
                                                <div className="text-right flex items-center px-4 py-2 bg-accent/10 rounded-xl">
                                                    <p className="text-accent font-black text-xl mr-4">{m.price.toLocaleString()} </p>
                                                    <div className="bg-accent h-8 w-8 rounded-full flex items-center justify-center text-primary">
                                                        <Plus className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden min-h-[400px]">
                            {lines.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-40">
                                    <TrendingUp className="h-20 w-20 mb-8 text-secondary/20" />
                                    <p className="font-black uppercase tracking-[0.2em] text-sm text-secondary">No current entries in BoQ</p>
                                    <p className="text-xs italic mt-3 max-w-[250px]">Material costs will be calculated as the foundation of your appraisal.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-secondary/5 border-b border-border">
                                        <tr>
                                            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-secondary/60">Component Description</th>
                                            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-secondary/60 text-center">Unit Qty</th>
                                            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-secondary/60">Snapshot Price</th>
                                            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-secondary/60 text-right font-black">Line Sum</th>
                                            <th className="w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {lines.map(line => (
                                            <tr key={line.materialId} className="group hover:bg-secondary/[0.02] transition-colors">
                                                <td className="px-8 py-6">
                                                    <p className="font-black text-primary dark:text-white text-base leading-none mb-1">{line.materialName}</p>
                                                    <span className="text-[10px] text-secondary/50 font-black uppercase tracking-[0.2em]">{line.unit}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-center">
                                                        <Input 
                                                            type="number"
                                                            className="w-24 h-11 bg-background border-border font-black text-center rounded-xl focus:ring-accent"
                                                            value={line.quantity}
                                                            onChange={(e) => updateQuantity(line.materialId, e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-bold text-secondary/80">
                                                    {line.unitPrice.toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-xl font-black text-primary dark:text-accent">
                                                        {line.total.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="pr-6 py-6 text-center">
                                                    <button 
                                                        onClick={() => removeLine(line.materialId)}
                                                        className="p-3 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === "adjustments" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">
                        <Card className="border-border shadow-xl bg-card overflow-hidden">
                            <CardHeader className="bg-primary/5 dark:bg-accent/5 border-b border-border/50">
                                <CardTitle className="text-lg font-black uppercase tracking-widest text-primary dark:text-white flex items-center italic">
                                    <Hammer className="h-5 w-5 mr-3 text-accent" />
                                    Labor & Overhead
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-secondary/60">Direct Labor Rate (%)</label>
                                        <span className="px-2 py-1 bg-accent/20 text-accent font-black rounded text-xs">{laborPercent}%</span>
                                    </div>
                                    <Input 
                                        type="range" min="0" max="100" step="1"
                                        value={laborPercent}
                                        onChange={(e) => setLaborPercent(parseInt(e.target.value))}
                                        className="accent-accent"
                                    />
                                    <p className="text-[10px] text-secondary/50 italic leading-snug">
                                        Standard labor rates fluctuate between 20-35% of total material costs depending on project complexity.
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border/50">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-secondary/60">Overhead & Indirects (%)</label>
                                        <span className="px-2 py-1 bg-accent/20 text-accent font-black rounded text-xs">{overheadPercent}%</span>
                                    </div>
                                    <Input 
                                        type="range" min="0" max="100" step="1"
                                        value={overheadPercent}
                                        onChange={(e) => setOverheadPercent(parseInt(e.target.value))}
                                        className="accent-accent"
                                    />
                                    <p className="text-[10px] text-secondary/50 italic leading-snug">
                                        Includes equipment rental, permits, inspections, and contractor profit margin.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-xl bg-card overflow-hidden">
                            <CardHeader className="bg-primary/5 dark:bg-accent/5 border-b border-border/50">
                                <CardTitle className="text-lg font-black uppercase tracking-widest text-primary dark:text-white flex items-center italic">
                                    <AlertCircle className="h-5 w-5 mr-3 text-accent" />
                                    Depreciation & Loss
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-secondary/60">Total Accrued Depreciation (%)</label>
                                        <span className="px-2 py-1 bg-red-500/10 text-red-500 font-black rounded text-xs">-{depreciationPercent}%</span>
                                    </div>
                                    <Input 
                                        type="range" min="0" max="100" step="1"
                                        value={depreciationPercent}
                                        onChange={(e) => setDepreciationPercent(parseInt(e.target.value))}
                                        className="accent-red-500"
                                    />
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="p-3 bg-secondary/5 rounded-xl text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Condition</p>
                                            <p className="text-xs font-bold mt-1 text-primary dark:text-white">
                                                {depreciationPercent < 10 ? "Pristine" : depreciationPercent < 30 ? "Fair" : "Needs Repair"}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-secondary/5 rounded-xl text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Obsolescence</p>
                                            <p className="text-xs font-bold mt-1 text-primary dark:text-white">Managed</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-start space-x-3">
                                    <Info className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500/80 leading-relaxed uppercase tracking-wider">
                                        Calculates based on Age/Life method. 100% loss equals end of structural economic utility.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 border-border shadow-xl bg-card overflow-hidden">
                            <CardHeader className="bg-primary/5 dark:bg-accent/5 border-b border-border/50">
                                <CardTitle className="text-lg font-black uppercase tracking-widest text-primary dark:text-white flex items-center italic">
                                    <MapPin className="h-5 w-5 mr-3 text-accent" />
                                    Site & Land Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-secondary/60">Estimated Site Appreciation/Value (ETB)</label>
                                        <div className="relative">
                                            <Input 
                                                type="number" 
                                                className="pl-12 py-7 text-2xl font-black bg-background border-border rounded-2xl focus:ring-accent"
                                                value={landValue}
                                                onChange={(e) => setLandValue(parseFloat(e.target.value) || 0)}
                                            />
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                                        </div>
                                    </div>
                                    <div className="p-8 bg-accent/5 rounded-3xl border border-accent/10 text-center min-w-[200px]">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-2">Total Land Input</p>
                                        <p className="text-3xl font-black text-primary dark:text-white">{landValue.toLocaleString()} <span className="text-sm opacity-40">ETB</span></p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeSection === "summary" && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <Card className="border-none shadow-2xl bg-gradient-to-br from-primary via-[#124A6F] to-primary text-white overflow-hidden relative p-12 rounded-[2.5rem]">
                            <TrendingUp className="absolute right-[-40px] top-[-40px] h-96 w-96 text-white/[0.03]" />
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                                        Final Appraisal Result
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em]">Indicated Market Value</p>
                                        <h2 className="text-6xl md:text-7xl font-black tracking-tighter">
                                            {finalValuation.toLocaleString()}
                                            <span className="text-2xl ml-3 opacity-40 font-medium">ETB</span>
                                        </h2>
                                    </div>
                                    <div className="pt-8 border-t border-white/10 flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <Calculator className="h-6 w-6 text-accent" />
                                        </div>
                                        <p className="text-xs text-white/70 italic max-w-[280px]">
                                            Calculated using the standard Cost-Based Approach with fresh material index snapshots.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Cost Breakdown Ledger</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-white/40 uppercase font-black">Base Assets</p>
                                                <p className="font-bold">Materials Cost</p>
                                            </div>
                                            <p className="font-black text-lg">{materialTotal.toLocaleString()} </p>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-white/40 uppercase font-black">Labor & Overhead</p>
                                                <p className="font-bold">Execution Costs</p>
                                            </div>
                                            <p className="font-black text-lg">{(laborCost + overheadCost).toLocaleString()} </p>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-white/40 uppercase font-black">Adjustments</p>
                                                <p className="font-bold">Accrued Depreciation</p>
                                            </div>
                                            <p className="font-black text-lg text-red-400">-{ (replacementCost - improvementValue).toLocaleString() } </p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-white/40 uppercase font-black">Site Value</p>
                                                <p className="font-bold text-accent">Land Appraisal</p>
                                            </div>
                                            <p className="font-black text-lg text-accent">+{landValue.toLocaleString()} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Button 
                                onClick={handleSaveValuation}
                                disabled={lines.length === 0 || isSaving}
                                className="md:col-span-2 bg-accent hover:bg-accent/90 text-primary font-black py-10 rounded-3xl text-xl uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
                            >
                                {isSaving ? <Loader2 className="animate-spin mr-4 h-8 w-8" /> : success ? <CheckCircle2 className="mr-4 h-8 w-8" /> : <Save className="mr-4 h-8 w-8" />}
                                {isSaving ? "Synchronizing with Server..." : success ? "Ledger Entry Successful" : "Publish Valuation Report"}
                            </Button>
                            <Card className="bg-card border-border shadow-xl flex items-center justify-center p-8 rounded-3xl">
                                <div className="text-center">
                                    <Info className="h-6 w-6 text-secondary/30 mx-auto mb-2" />
                                    <p className="text-[10px] text-secondary/60 font-black uppercase tracking-widest">Version Control</p>
                                    <p className="text-xs font-bold text-primary dark:text-white mt-1">V1.4 - CBA Engine</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side Sticky Preview (4 cols) */}
            <div className="lg:col-span-4 transition-all duration-500">
                <div className="sticky top-24 space-y-6">
                    <Card className="bg-primary dark:bg-card border-none shadow-2xl overflow-hidden text-white dark:text-foreground rounded-[2rem]">
                        <CardContent className="p-10 relative">
                            <Calculator className="absolute right-[-20px] top-[-20px] h-48 w-48 text-white/5 dark:text-primary/10" />
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Running Estimate</h3>
                                    <p className="text-5xl font-black tracking-tighter">
                                        {finalValuation.toLocaleString()} <span className="text-lg opacity-40 font-medium">ETB</span>
                                    </p>
                                </div>
                                
                                <div className="space-y-4 pt-8 border-t border-white/10 dark:border-border/50">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
                                        <span>BOM Count</span>
                                        <span>{lines.length} Line Items</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
                                        <span>Labor Weight</span>
                                        <span>{laborPercent}%</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
                                        <span>Land %</span>
                                        <span>{((landValue / (finalValuation || 1)) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button 
                                        className="w-full bg-white/10 hover:bg-white/20 text-white dark:text-foreground backdrop-blur-md border border-white/10 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs"
                                        onClick={() => setActiveSection("summary")}
                                    >
                                        View Full Breakdown <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4 p-6 bg-accent/5 rounded-[2rem] border border-accent/10 shadow-inner">
                        <div className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Home className="h-6 w-6 text-accent" />
                        </div>
                        <p className="text-[11px] font-bold text-accent/80 leading-relaxed uppercase tracking-widest">
                            All appraisals follow the International Valuation Standards (IVS) framework for replacement cost.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
