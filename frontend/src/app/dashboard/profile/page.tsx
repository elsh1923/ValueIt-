"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Loader2, User as UserIcon, Mail, Shield, Save, Camera, X, 
  CheckCircle2, AlertCircle, FileText, Activity, ShieldCheck,
  Undo2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Cropper from "react-easy-crop";

// Utility to create the cropped image
const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
};

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    new_password: "",
    confirm_password: ""
  });

  // Cropping state
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Initialize form
  const resetForm = useCallback(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email,
        new_password: "",
        confirm_password: ""
      });
      setError("");
      setSuccess("");
    }
  }, [user]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // Auto-clear success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result?.toString() || null);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      setIsLoading(true);
      setError("");
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      
      if (!croppedImageBlob) throw new Error("Could not process image");

      const file = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/v1/users/me/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      if (res.ok) {
        setSuccess("Profile photo updated successfully!");
        setImageToCrop(null);
        await refreshUser();
      } else {
        const err = await res.json();
        throw new Error(err.detail || "Failed to upload avatar");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const body: any = {};
      
      if (formData.full_name !== user?.full_name) body.full_name = formData.full_name;
      if (formData.new_password) body.password = formData.new_password;

      if (Object.keys(body).length === 0) {
        setIsLoading(false);
        setSuccess("No changes detected.");
        return;
      }

      const res = await fetch("http://localhost:8000/api/v1/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setFormData(prev => ({ ...prev, new_password: "", confirm_password: "" }));
      await refreshUser();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
     return (
       <div className="flex justify-center items-center h-64">
         <Loader2 className="h-8 w-8 animate-spin text-accent" />
       </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Cropping Modal */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg border border-border">
            <div className="p-5 border-b border-border flex justify-between items-center bg-background/50">
              <div>
                <h3 className="font-bold text-primary dark:text-white text-lg">Crop Profile Photo</h3>
                <p className="text-xs text-secondary/60">Drag to position, scroll to zoom</p>
              </div>
              <button 
                onClick={() => setImageToCrop(null)} 
                className="p-2 hover:bg-secondary/10 rounded-full text-secondary transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative h-[400px] w-full bg-secondary/5">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-6 space-y-6 bg-card">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-secondary uppercase tracking-widest">Zoom Control</Label>
                    <span className="text-xs font-medium text-secondary/60">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl h-11" 
                  onClick={() => setImageToCrop(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 rounded-xl h-11 text-white dark:text-primary font-bold shadow-lg" 
                  onClick={handleCropSave}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Set Profile Photo"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Profile Section */}
      <div className="relative mb-8 pt-16">
        {/* Cover Gradient */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-primary to-primary/80 dark:from-sidebar dark:to-sidebar/80 rounded-3xl" />
        
        <div className="relative px-8 flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar Section */}
          <div className="relative shrink-0">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full flex items-center justify-center overflow-hidden border-8 border-background bg-secondary/10 shadow-xl">
                {user?.avatar_url ? (
                    <img 
                        src={`http://localhost:8000${user.avatar_url.startsWith('/') ? '' : '/'}${user.avatar_url}?v=${Date.now()}`} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <UserIcon className="h-16 w-16 text-primary/30" />
                )}
            </div>
            <label 
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 p-2.5 bg-accent hover:bg-accent/90 rounded-full text-white cursor-pointer transition-all shadow-lg hover:scale-110 active:scale-95"
                title="Change Photo"
            >
                <Camera className="h-5 w-5" />
                <Input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </label>
          </div>

          {/* User Basic Info */}
          <div className="flex-1 text-center md:text-left md:pb-8 space-y-2">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
                {user.full_name && user.full_name !== user.email ? user.full_name : "Complete Your Profile"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-black/30 text-accent border border-white/10 backdrop-blur-md">
                   <ShieldCheck className="h-3.5 w-3.5 mr-2" /> {user.role}
                </span>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-black/20 text-white border border-white/10 backdrop-blur-md">
                   <Mail className="h-3.5 w-3.5 mr-2" /> {user.email}
                </span>
            </div>
            {(!user.full_name || user.full_name === user.email) && (
                <p className="text-[10px] text-accent font-bold mt-1">
                    Please provide your full name below for professional reports.
                </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics & Meta Info */}
        <div className="space-y-6">
            <Card className="border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-secondary/5 pb-4 border-b border-border">
                    <CardTitle className="text-sm font-bold text-secondary uppercase tracking-widest flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-accent" /> Activity Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-secondary/60">Assigned Projects</p>
                            <p className="text-xl font-bold text-primary dark:text-white">{user.active_projects_count || 0}</p>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="h-px bg-border w-full" />
                    <div className="space-y-1">
                        <p className="text-xs text-secondary/60">Account Status</p>
                        <div className="flex items-center text-green-600 font-semibold text-sm">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" /> Active & Approved
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-3">
                <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" /> Security Note
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-200/80 leading-relaxed">
                    Keep your account secure by using a strong password. We recommend a mix of letters, numbers, and symbols.
                </p>
            </div>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-2">
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-primary dark:text-white">Update Information</CardTitle>
                    <CardDescription className="dark:text-slate-400">Modify your profile details and security settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Status Messages */}
                        {(error || success) && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                                error ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
                            }`}>
                                {error ? <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
                                <div className="text-sm font-medium">{error || success}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-xs font-bold uppercase text-secondary tracking-wide">Full Name</Label>
                                <div className="relative group">
                                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-secondary/60 group-focus-within:text-accent transition-colors" />
                                    <Input 
                                        id="full_name" 
                                        value={formData.full_name} 
                                        onChange={handleChange}
                                        className="pl-9 h-11 border-border bg-card focus:ring-accent focus:border-accent rounded-xl transition-all" 
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>
 
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase text-secondary tracking-wide">Email Address</Label>
                                <div className="relative opacity-60">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-secondary/60" />
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        value={formData.email || ""} 
                                        className="pl-9 h-11 border-border bg-secondary/5 cursor-not-allowed rounded-xl" 
                                        disabled
                                    />
                                </div>
                                <p className="text-[10px] text-secondary/60 italic">Email cannot be changed directly.</p>
                            </div>
                        </div>

                        <div className="pt-4 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-border flex-1" />
                                <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-[0.2em]">Password Security</span>
                                <div className="h-px bg-border flex-1" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="new_password" className="text-xs font-bold uppercase text-secondary tracking-wide">New Password</Label>
                                    <div className="relative group">
                                        <Shield className="absolute left-3 top-2.5 h-4 w-4 text-secondary/60 group-focus-within:text-accent transition-colors" />
                                        <Input 
                                            id="new_password" 
                                            type="password" 
                                            placeholder="Leave blank to keep current"
                                            value={formData.new_password} 
                                            onChange={handleChange}
                                            className="pl-9 h-11 border-border rounded-xl bg-card" 
                                        />
                                    </div>
                                </div>
 
                                <div className="space-y-2">
                                    <Label htmlFor="confirm_password" className="text-xs font-bold uppercase text-secondary tracking-wide">Confirm Password</Label>
                                    <div className="relative group">
                                        <Shield className="absolute left-3 top-2.5 h-4 w-4 text-secondary/60 group-focus-within:text-accent transition-colors" />
                                        <Input 
                                            id="confirm_password" 
                                            type="password" 
                                            placeholder="Repeat your new password"
                                            value={formData.confirm_password} 
                                            onChange={handleChange}
                                            className="pl-9 h-11 border-border rounded-xl bg-card" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={resetForm}
                                disabled={isLoading}
                                className="w-full sm:w-auto text-secondary hover:text-primary dark:hover:text-white rounded-xl"
                            >
                                <Undo2 className="mr-2 h-4 w-4" /> Discard Changes
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full sm:w-auto bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 text-white dark:text-primary font-bold rounded-xl px-8 h-11 shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Profile Refinements
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
