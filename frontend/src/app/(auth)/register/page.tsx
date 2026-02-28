"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [roleAvailability, setRoleAvailability] = useState({ admin_available: false, manager_available: false });
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get("/auth/role-availability");
        setRoleAvailability(res.data);
      } catch (err) {
        console.error("Failed to fetch role availability", err);
      } finally {
        setIsAvailabilityLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        role: data.role // manager, valuer, inspector
      });
      
      const requiresApproval = ["valuer", "inspector"].includes(data.role);
      setIsPendingApproval(requiresApproval);
      setSuccess(true);

      if (!requiresApproval) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0F1419] flex flex-col font-sans text-[#1A1A1A] dark:text-[#E8EAED]">
      {/* Professional Navbar-like Header for Auth Pages */}
      <nav className="fixed w-full bg-[#0B3C5D] dark:bg-[#1A1F26] backdrop-blur-sm z-50 border-b border-[#0A3351] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-white tracking-tight">
                  Value<span className="text-[#C9A227]">It</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10 text-sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0B3C5D] dark:text-white tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-[#4A5D73] dark:text-[#6B7F95]">
              Join the professional property valuation network.
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-[#1A1F26] py-10 px-6 shadow-xl rounded-xl border border-[#E1E8ED] dark:border-[#2D3748] sm:px-10">
            {success ? (
              <div className={`rounded-lg p-6 text-center border ${isPendingApproval ? "bg-yellow-50 border-yellow-200" : "bg-[#2E8B57]/10 border-[#2E8B57]/20"}`}>
                <div className="flex flex-col items-center">
                  {isPendingApproval ? (
                     <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <Loader2 className="h-6 w-6 text-yellow-600" />
                     </div>
                  ) : (
                    <CheckCircle2 className="h-12 w-12 text-[#2E8B57] mb-4" />
                  )}
                  
                  <h3 className={`text-lg font-bold ${isPendingApproval ? "text-yellow-800" : "text-[#2E8B57]"}`}>
                    {isPendingApproval ? "Registration Pending" : "Registration successful!"}
                  </h3>
                  
                  <p className={`mt-2 text-sm ${isPendingApproval ? "text-yellow-700" : "text-[#2E8B57]/80"}`}>
                    {isPendingApproval 
                        ? "Your account is waiting for manager approval. You will not be able to login until approved." 
                        : "Redirecting to login..."}
                  </p>

                  {isPendingApproval && (
                      <div className="mt-6">
                        <Link href="/">
                            <Button variant="outline" className="w-full">Back to Home</Button>
                        </Link>
                      </div>
                  )}
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Label htmlFor="full_name" className="text-[#0B3C5D] dark:text-gray-300 font-semibold mb-1 block">Full Name</Label>
                  <div className="mt-1">
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Enter your full name"
                      className="border-[#E1E8ED] dark:border-[#2D3748] focus:border-[#C9A227] dark:focus:border-[#C9A227] transition-colors"
                      {...register("full_name", { required: true })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#0B3C5D] dark:text-gray-300 font-semibold mb-1 block">Email address</Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="border-[#E1E8ED] dark:border-[#2D3748] focus:border-[#C9A227] dark:focus:border-[#C9A227] transition-colors"
                      {...register("email", { required: true })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role" className="text-[#0B3C5D] dark:text-gray-300 font-semibold mb-1 block">Role</Label>
                  <div className="mt-1">
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-[#E1E8ED] dark:border-[#2D3748] bg-white dark:bg-[#0F1419] px-3 py-2 text-sm text-[#1A1A1A] dark:text-[#E8EAED] focus-visible:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                      {...register("role", { required: true })}
                      defaultValue="valuer"
                      disabled={isAvailabilityLoading}
                    >
                      {roleAvailability.admin_available && <option value="admin">Administrator (Global)</option>}
                      {roleAvailability.manager_available && <option value="manager">Manager</option>}
                      <option value="valuer">Valuer</option>
                      <option value="inspector">Site Inspector</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-[#0B3C5D] dark:text-gray-300 font-semibold mb-1 block">Password</Label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="border-[#E1E8ED] dark:border-[#2D3748] focus:border-[#C9A227] dark:focus:border-[#C9A227] transition-colors"
                      {...register("password", { required: true })}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-[#B22222]/10 border border-[#B22222]/20 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-[#B22222]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-[#B22222]">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" className="w-full bg-[#0B3C5D] hover:bg-[#0D4A73] dark:bg-[#C9A227] dark:hover:bg-[#B8921F] text-white dark:text-[#0B3C5D] font-bold h-11 text-base shadow-lg transition-all" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    Create Account
                  </Button>
                </div>
              </form>
            )}
            
            <div className="mt-8 pt-8 border-t border-[#E1E8ED] dark:border-[#2D3748] text-center">
              <p className="text-sm text-[#4A5D73] dark:text-[#6B7F95]">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-[#0B3C5D] dark:text-[#C9A227] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
          
          <p className="mt-8 text-center text-xs text-[#4A5D73] dark:text-[#6B7F95]">
            © {new Date().getFullYear()} ValueIt Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
