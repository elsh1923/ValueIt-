"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Loader2, AlertCircle, Shield, User as UserIcon, X } from "lucide-react";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_approved: boolean;
  is_active: boolean;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_approved: true }),
      });

      if (!res.ok) throw new Error("Failed to approve user");
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, is_approved: true } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      // Update local state
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">User Management</h2>
          <p className="text-secondary dark:text-slate-400 mt-1">Approve registrations and manage system access.</p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/5 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-primary dark:text-white">User</th>
              <th className="px-6 py-4 font-semibold text-primary dark:text-white">Role</th>
              <th className="px-6 py-4 font-semibold text-primary dark:text-white">Status</th>
              <th className="px-6 py-4 font-semibold text-primary dark:text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-secondary/5 transition-colors">
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center text-primary dark:text-accent">
                            <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{user.full_name || "No Name"}</p>
                            <p className="text-secondary/70">{user.email}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.role === 'manager' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 
                          user.role === 'valuer' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 
                          'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                        {user.role}
                    </span>
                </td>
                <td className="px-6 py-4">
                    {user.is_approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Pending Approval
                        </span>
                    )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                    {!user.is_approved && (
                        <>
                            <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(user.id)}
                            >
                                <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                                size="sm" 
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => {
                                    if (confirm("Are you sure you want to REJECT this registration request? This will delete the user.")) {
                                        handleDelete(user.id);
                                    }
                                }}
                            >
                                <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                        </>
                    )}
                    {user.is_approved && (
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                            onClick={() => handleDelete(user.id)}
                            title="Delete User"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-secondary/60">
                        <UserIcon className="h-10 w-10 mx-auto text-secondary/30 mb-3" />
                        No users found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
