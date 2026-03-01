"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
    Plus, 
    Search, 
    Loader2, 
    AlertCircle, 
    Settings, 
    Trash2, 
    Pencil,
    TrendingUp,
    Package,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MaterialPrice {
  id: number;
  material_name: string;
  unit: string;
  price: number;
  updated_at: string;
}

export default function PricingPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "manager";
  const [prices, setPrices] = useState<MaterialPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<MaterialPrice | null>(null);
  const [formData, setFormData] = useState({ material_name: "", unit: "", price: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPrices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/pricing/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch material pricing data");
      const data = await res.json();
      setPrices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleEdit = (price: MaterialPrice) => {
    setEditingPrice(price);
    setFormData({ 
        material_name: price.material_name, 
        unit: price.unit, 
        price: price.price.toString() 
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPrice(null);
    setFormData({ material_name: "", unit: "", price: "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this pricing record? This may affect historical valuations referencing this ID.")) return;
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/v1/pricing/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) fetchPrices();
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const token = localStorage.getItem("token");
        const method = editingPrice ? "PUT" : "POST";
        const url = editingPrice 
            ? `http://127.0.0.1:8000/api/v1/pricing/${editingPrice.id}` 
            : "http://127.0.0.1:8000/api/v1/pricing/";

        const res = await fetch(url, {
            method,
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({
                ...formData,
                price: parseFloat(formData.price)
            })
        });

        if (res.ok) {
            setIsModalOpen(false);
            fetchPrices();
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsSubmitting(false);
    }
  };

  const filteredPrices = prices.filter(p => 
    p.material_name.toLowerCase().includes(search.toLowerCase()) ||
    p.unit.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
        <p className="font-bold animate-pulse">Syncing market rates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">Material Pricing Index</h2>
          <p className="text-secondary dark:text-slate-400 mt-1">
            {isAdmin 
                ? "Maintain authoritative building material price list." 
                : "Real-time pricing data for valuation accuracy."}
          </p>
          {isAdmin && (
            <span className="inline-block mt-1 text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded bg-accent/10 text-accent">
              {user?.role === "manager" ? "Manager" : "Admin"} Access
            </span>
          )}
        </div>
        
        {isAdmin && (
            <Button 
                onClick={handleAdd}
                className="bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest shadow-lg shadow-accent/20 h-12 px-6 rounded-xl transition-all hover:scale-[1.02]"
            >
                <Plus className="mr-2 h-5 w-5" /> Add New Material
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats/Summary */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="bg-primary dark:bg-card border-none shadow-xl overflow-hidden text-white dark:text-foreground">
                <CardContent className="p-8 relative">
                    <TrendingUp className="absolute right-[-20px] top-[-20px] h-40 w-40 text-white/5 dark:text-primary/10" />
                    <div className="relative z-10">
                        <div className="h-10 w-10 rounded-lg bg-white/20 dark:bg-accent/20 flex items-center justify-center mb-6">
                            <Package className="h-6 w-6 text-white dark:text-accent" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] opacity-70">Catalogued Items</h3>
                        <p className="text-5xl font-black mt-2">{prices.length}</p>
                        <div className="mt-8 flex items-center text-xs font-bold text-accent bg-white/10 dark:bg-accent/10 px-3 py-2 rounded-lg w-fit">
                            DATABASE STATUS: OPTIMIZED
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border shadow-md bg-card">
                <CardHeader>
                    <CardTitle className="text-sm text-primary dark:text-white uppercase tracking-widest font-black">Quick Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs font-medium text-secondary/70 leading-relaxed">
                    <p>• Prices are updated weekly based on central market indices.</p>
                    <p>• Valuers should use these as baseline rates for cost-based valuations.</p>
                    <p>• Regional variances may apply and should be noted in the valuation narrative.</p>
                    <div className="pt-2 border-t border-border mt-4">
                         <span className="text-[10px] bg-secondary/5 px-2 py-1 rounded text-primary dark:text-accent font-bold">
                            V 2.4.0 INDEX
                         </span>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Main Pricing List */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary/40 group-focus-within:text-accent transition-colors" />
                    <Input 
                        placeholder="Search materials, units, or categories..." 
                        className="pl-12 py-7 bg-card border-border rounded-2xl focus:ring-accent shadow-sm group-hover:border-accent/30 transition-all text-base"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                {filteredPrices.length === 0 ? (
                    <div className="p-20 text-center text-secondary/60">
                         <div className="h-20 w-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                             <Search className="h-10 w-10 text-secondary/30" />
                         </div>
                         <h4 className="text-xl font-bold text-primary dark:text-white">No matches found</h4>
                         <p className="mt-2 text-sm italic">"Try broadening your search criteria."</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/5 border-b border-border">
                            <tr>
                                <th className="px-8 py-5 font-black text-primary dark:text-white uppercase tracking-tighter">Material Description</th>
                                <th className="px-8 py-5 font-black text-primary dark:text-white uppercase tracking-tighter">Metric Unit</th>
                                <th className="px-8 py-5 font-black text-primary dark:text-white uppercase tracking-tighter">Base Rate (ETB)</th>
                                {isAdmin && <th className="px-8 py-5 font-black text-primary dark:text-white uppercase tracking-tighter text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredPrices.map((p) => (
                                <tr key={p.id} className="hover:bg-accent/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-accent mr-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-bold text-primary dark:text-white text-base">{p.material_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-secondary/80 font-medium">
                                        <span className="bg-secondary/10 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest leading-none">
                                            {p.unit}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-lg font-black text-primary dark:text-accent">
                                            {p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    onClick={() => handleEdit(p)}
                                                    size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(p.id)}
                                                    size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-red-500/10 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 flex items-center justify-center gap-3">
                <Settings className="h-4 w-4 text-accent animate-spin-slow" />
                <p className="text-[10px] font-bold text-primary/60 dark:text-accent/60 uppercase tracking-[0.3em]">
                    Enterprise Pricing Engine Active • Last Update: Today
                </p>
            </div>
        </div>
      </div>

      {/* Admin CRUD Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
              <Card className="w-full max-w-lg shadow-2xl border-border animate-in zoom-in-95 duration-200">
                  <CardHeader className="border-b border-border bg-secondary/5">
                      <CardTitle className="text-xl font-bold flex items-center gap-3">
                          <Package className="h-5 w-5 text-accent" />
                          {editingPrice ? "Edit Pricing Data" : "Add New Material"}
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-secondary/60">Material Name</label>
                                <Input 
                                    required
                                    placeholder="e.g. Cement Grade C"
                                    className="h-12 bg-secondary/5 border-border rounded-xl"
                                    value={formData.material_name}
                                    onChange={(e) => setFormData({...formData, material_name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60">Unit</label>
                                    <Input 
                                        required
                                        placeholder="e.g. Quintal, Kg"
                                        className="h-12 bg-secondary/5 border-border rounded-xl"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-secondary/60">Price (ETB)</label>
                                    <Input 
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="h-12 bg-secondary/5 border-border rounded-xl"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="button"
                                    variant="outline" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-12 rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-12 bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest rounded-xl"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (editingPrice ? "Save Changes" : "Confirm Entry")}
                                </Button>
                            </div>
                      </form>
                  </CardContent>
              </Card>
          </div>
      )}
    </div>
  );
}
