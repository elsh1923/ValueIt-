"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, FileText, CheckCircle2, AlertCircle, Plus, Loader2, Package, Search, Pencil, Trash2, TrendingUp } from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MaterialPrice {
  id: number;
  material_name: string;
  unit: string;
  price: number;
  updated_at: string;
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    pendingUsers: 0,
    activeStaff: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Material Prices state
  const [prices, setPrices] = useState<MaterialPrice[]>([]);
  const [priceSearch, setPriceSearch] = useState("");
  const [pricesLoading, setPricesLoading] = useState(true);
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
      if (res.ok) setPrices(await res.json());
    } catch (e) { console.error(e); } finally { setPricesLoading(false); }
  };

  const handleEdit = (p: MaterialPrice) => {
    setEditingPrice(p);
    setFormData({ material_name: p.material_name, unit: p.unit, price: p.price.toString() });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPrice(null);
    setFormData({ material_name: "", unit: "", price: "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this material price? This may affect historical valuations.")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://127.0.0.1:8000/api/v1/pricing/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) fetchPrices();
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, price: parseFloat(formData.price) }),
      });
      if (res.ok) { setIsModalOpen(false); fetchPrices(); }
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const projectsRes = await fetch("http://127.0.0.1:8000/api/v1/projects/", { headers });
        const projects = projectsRes.ok ? await projectsRes.json() : [];

        const pendingRes = await fetch("http://127.0.0.1:8000/api/v1/users/?is_approved=false", { headers });
        const pendingUsers = pendingRes.ok ? await pendingRes.json() : [];

        const staffRes = await fetch("http://127.0.0.1:8000/api/v1/users/?is_active=true&is_approved=true", { headers });
        const staff = staffRes.ok ? await staffRes.json() : [];

        setStats({
          totalProjects: projects.length,
          completedProjects: projects.filter((p: any) => p.status === "completed").length,
          pendingUsers: pendingUsers.length,
          activeStaff: staff.length,
        });
        setRecentProjects(projects.slice(0, 5));
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
    fetchPrices();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notification Area */}
      {stats.pendingUsers > 0 && (
         <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-3">
                <div className="bg-amber-500/20 p-2 rounded-full">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-300">Action Required</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-200/80">You have <span className="font-bold">{stats.pendingUsers} pending user(s)</span> waiting for approval.</p>
                </div>
            </div>
            <Link href="/dashboard/admin/users">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white border-none shadow-none">
                    Review Requests
                </Button>
            </Link>
         </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">Manager Overview</h2>
          <p className="text-secondary dark:text-slate-400 mt-1">Monitor project performance and manage team approvals.</p>
        </div>
        <Link href="/dashboard/projects/create">
            <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard 
            icon={<FileText className="h-6 w-6" />}
            label="Total Projects"
            value={stats.totalProjects.toString()}
        />
        <StatsCard 
            icon={<CheckCircle2 className="h-6 w-6" />}
            label="Completed"
            value={stats.completedProjects.toString()}
        />
        <StatsCard 
            icon={<AlertCircle className="h-6 w-6" />}
            label="Pending Approval"
            value={stats.pendingUsers.toString()}
            alert={stats.pendingUsers > 0}
        />
        <StatsCard 
            icon={<Users className="h-6 w-6" />}
            label="Active Staff"
            value={stats.activeStaff.toString()}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Projects Table - Takes 2 cols */}
        <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-primary dark:text-white">Recent Projects</h3>
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {recentProjects.length === 0 ? (
                  <div className="p-6 text-center text-secondary/60 py-12">
                      <FileText className="h-12 w-12 mx-auto text-secondary/30 mb-3" />
                      <p>No projects yet.</p>
                      <Link href="/dashboard/projects/create">
                        <Button variant="link" className="text-accent hover:text-accent/80">Create your first project</Button>
                      </Link>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/5 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-primary dark:text-white">Title</th>
                        <th className="px-6 py-4 font-semibold text-primary dark:text-white">Client</th>
                        <th className="px-6 py-4 font-semibold text-primary dark:text-white">Status</th>
                        <th className="px-6 py-4 font-semibold text-primary dark:text-white text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{project.title}</td>
                          <td className="px-6 py-4 text-secondary/80">{project.client_name}</td>
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
                              <Button size="sm" variant="ghost" className="text-secondary hover:text-primary dark:text-slate-300 dark:hover:text-white">
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

        {/* User Approvals Widget - Takes 1 col */}
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary dark:text-white">Pending User Approvals</h3>
            <div className="bg-card rounded-xl shadow-sm border border-border p-4 space-y-3">
                 {stats.pendingUsers === 0 ? (
                    <div className="text-center py-8 text-secondary/60 text-sm">
                        <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                        No pending approvals.
                    </div>
                 ) : (
                    <div className="text-center py-6">
                        <p className="text-primary dark:text-white font-medium mb-3">You have {stats.pendingUsers} request(s).</p>
                         <Link href="/dashboard/admin/users">
                            <Button className="w-full bg-primary dark:bg-accent text-white dark:text-primary font-bold">Go to Approvals</Button>
                        </Link>
                    </div>
                 )}
            </div>
        </div>
      </div>

      {/* ── Material Prices Management ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary dark:text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" /> Material Price Database
            </h3>
            <p className="text-sm text-secondary dark:text-slate-400 mt-0.5">Add, update or remove construction material rates used in valuations.</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest shadow-lg shadow-accent/20 h-10 px-5 rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Material
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/40" />
          <Input
            placeholder="Search materials or units..."
            className="pl-10 bg-card border-border rounded-xl"
            value={priceSearch}
            onChange={(e) => setPriceSearch(e.target.value)}
          />
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {pricesLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : prices.filter(p =>
              p.material_name.toLowerCase().includes(priceSearch.toLowerCase()) ||
              p.unit.toLowerCase().includes(priceSearch.toLowerCase())
            ).length === 0 ? (
            <div className="py-16 text-center text-secondary/60">
              <Package className="h-10 w-10 mx-auto text-secondary/20 mb-3" />
              <p className="text-sm">No materials found. <button onClick={handleAdd} className="text-accent hover:underline font-medium">Add one now.</button></p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-primary dark:text-white uppercase tracking-tight text-xs">#</th>
                  <th className="px-6 py-4 font-bold text-primary dark:text-white uppercase tracking-tight text-xs">Material</th>
                  <th className="px-6 py-4 font-bold text-primary dark:text-white uppercase tracking-tight text-xs">Unit</th>
                  <th className="px-6 py-4 font-bold text-primary dark:text-white uppercase tracking-tight text-xs">Price (ETB)</th>
                  <th className="px-6 py-4 font-bold text-primary dark:text-white uppercase tracking-tight text-xs">Last Updated</th>
                  <th className="px-6 py-4 font-bold text-primary dark:text-white uppercase tracking-tight text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {prices
                  .filter(p =>
                    p.material_name.toLowerCase().includes(priceSearch.toLowerCase()) ||
                    p.unit.toLowerCase().includes(priceSearch.toLowerCase())
                  )
                  .map((p, idx) => (
                  <tr key={p.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-6 py-4 text-secondary/50 text-xs font-mono">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary dark:text-white">{p.material_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary/10 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-widest">{p.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary dark:text-accent">
                        {p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary/60 text-xs">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleEdit(p)}
                          size="sm" variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(p.id)}
                          size="sm" variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-secondary/50">{prices.length} material{prices.length !== 1 ? 's' : ''} in database</p>
          <Link href="/dashboard/pricing">
            <Button variant="link" className="text-accent text-xs h-auto p-0">Open full pricing panel →</Button>
          </Link>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl border-border animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border bg-secondary/5 flex items-center gap-3">
              <Package className="h-5 w-5 text-accent" />
              <h4 className="text-lg font-bold">{editingPrice ? "Edit Material Price" : "Add New Material"}</h4>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary/60">Material Name</label>
                  <Input
                    required
                    placeholder="e.g. Cement Grade C"
                    className="h-11 bg-secondary/5 border-border rounded-xl"
                    value={formData.material_name}
                    onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary/60">Unit</label>
                    <Input
                      required
                      placeholder="e.g. Quintal"
                      className="h-11 bg-secondary/5 border-border rounded-xl"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary/60">Price (ETB)</label>
                    <Input
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="h-11 bg-secondary/5 border-border rounded-xl"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button" variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-11 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit" disabled={isSubmitting}
                    className="flex-1 h-11 bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest rounded-xl"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (editingPrice ? "Save Changes" : "Add Material")}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatsCard({ icon, label, value, trend, alert }: any) {
    return (
        <div className={`p-6 bg-card rounded-xl border ${alert ? 'border-red-500/20 bg-red-500/5' : 'border-border'} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${alert ? 'bg-red-500/10 text-red-600' : 'bg-accent/10 text-accent'}`}>
                    {icon}
                </div>
                {alert && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
            </div>
            <div>
                <p className="text-sm font-medium text-secondary">{label}</p>
                <h4 className="text-2xl font-bold text-primary dark:text-white mt-1">{value}</h4>
                {trend && <p className="text-xs text-secondary/70 mt-1">{trend}</p>}
            </div>
        </div>
    )
}
