"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("username", data.email);
      formData.append("password", data.password);
      
      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      
      login(res.data.access_token);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to login. Please check your credentials.");
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
              <Link href="/register">
                <Button variant="ghost" className="text-white hover:bg-white/10 text-sm">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0B3C5D] dark:text-white tracking-tight">
              Sign in to ValueIt
            </h2>
            <p className="mt-2 text-sm text-[#4A5D73] dark:text-[#6B7F95]">
              Access your property valuation workspace.
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-[#1A1F26] py-10 px-6 shadow-xl rounded-xl border border-[#E1E8ED] dark:border-[#2D3748] sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email" className="text-[#0B3C5D] dark:text-gray-300 font-semibold mb-1 block">
                  Email address
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#4A5D73] dark:text-[#6B7F95]" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="pl-10 border-[#E1E8ED] dark:border-[#2D3748] focus:border-[#C9A227] dark:focus:border-[#C9A227] transition-colors"
                    {...register("email", { required: true })}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="password" title="Password" className="text-[#0B3C5D] dark:text-gray-300 font-semibold">
                    Password
                  </Label>
                  <Link href="/forgot-password" title="Forgot password?" className="text-xs font-medium text-[#0B3C5D] dark:text-[#C9A227] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#4A5D73] dark:text-[#6B7F95]" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pl-10 border-[#E1E8ED] dark:border-[#2D3748] focus:border-[#C9A227] dark:focus:border-[#C9A227] transition-colors"
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
                  Sign In
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-[#E1E8ED] dark:border-[#2D3748] text-center">
              <p className="text-sm text-[#4A5D73] dark:text-[#6B7F95]">
                Don't have an account?{" "}
                <Link href="/register" className="font-bold text-[#0B3C5D] dark:text-[#C9A227] hover:underline">
                  Create Account
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
