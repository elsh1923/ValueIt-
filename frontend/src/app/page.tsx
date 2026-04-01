"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { ShieldCheck, BarChart3, FileCheck, Users, Building2, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const features = [
    {
      icon: <ShieldCheck className="h-7 w-7 text-[#C9A227]" />,
      title: "Secure & Compliant",
      desc: "Enterprise-grade security with role-based access control for Managers, Valuers, and Inspectors."
    },
    {
      icon: <BarChart3 className="h-7 w-7 text-[#C9A227]" />,
      title: "Real-Time Analytics",
      desc: "Comprehensive dashboards with live data visualization and performance metrics."
    },
    {
      icon: <FileCheck className="h-7 w-7 text-[#C9A227]" />,
      title: "Automated Reporting",
      desc: "Generate professional PDF valuation reports with live material pricing integration."
    },
    {
      icon: <Users className="h-7 w-7 text-[#C9A227]" />,
      title: "Team Collaboration",
      desc: "Streamlined workflows for seamless coordination between field teams and management."
    },
    {
      icon: <Building2 className="h-7 w-7 text-[#C9A227]" />,
      title: "Project Management",
      desc: "Centralized project tracking with milestone management and status monitoring."
    },
    {
      icon: <TrendingUp className="h-7 w-7 text-[#C9A227]" />,
      title: "Cost Optimization",
      desc: "Data-driven insights for accurate property valuation and cost forecasting."
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "500+", label: "Projects Completed" },
    { value: "24/7", label: "Support" },
    { value: "ISO", label: "Certified" }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0F1419] flex flex-col font-sans text-[#1A1A1A] dark:text-[#E8EAED]">
      {/* Professional Navbar */}
      <nav className="fixed w-full bg-[#0B3C5D] dark:bg-[#1A1F26] backdrop-blur-sm z-50 border-b border-[#0A3351] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <span className="text-2xl font-bold text-white tracking-tight">
                  Value<span className="text-[#C9A227]">It</span>
                </span>
              </Link>
              <span className="ml-3 text-xs text-[#C9A227] font-semibold uppercase tracking-wider">Enterprise</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/features" className="text-white/80 hover:text-white font-medium transition-colors text-sm">Features</Link>
              <Link href="/solutions" className="text-white/80 hover:text-white font-medium transition-colors text-sm">Solutions</Link>
              <Link href="#about" className="text-white/80 hover:text-white font-medium transition-colors text-sm">About</Link>
              <div className="flex items-center space-x-3 ml-4">
                <ModeToggle />
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10 text-sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#C9A227] hover:bg-[#B8921F] text-[#0B3C5D] font-semibold text-sm shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Corporate Professional */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0B3C5D] via-[#124A6F] to-[#0B3C5D] dark:from-[#0F1419] dark:via-[#1A1F26] dark:to-[#0F1419]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-8">
              <motion.div variants={itemVariants} className="inline-block">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-[#C9A227] mr-2" />
                  <span className="text-[#C9A227] text-sm font-semibold">Trusted by Financial Institutions</span>
                </div>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Professional Property Valuation Management
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                Enterprise-grade cost-based valuation system designed for accuracy, compliance, and efficiency. Trusted by valuers, managers, and financial institutions.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-base h-12 bg-[#C9A227] hover:bg-[#B8921F] text-[#0B3C5D] font-semibold shadow-xl">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 border-white/30 text-white bg-transparent hover:bg-white/10">
                    Request Demo
                  </Button>
                </Link>

              </motion.div>

              {/* Stats Row */}
              <motion.div variants={itemVariants} className="grid grid-cols-4 gap-6 pt-8 border-t border-white/20">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-[#C9A227]">{stat.value}</div>
                    <div className="text-xs md:text-sm text-white/70 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dashboard Preview Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm aspect-[4/3] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/5 to-transparent"></div>
                <div className="relative z-10 text-center p-8">
                  <BarChart3 className="h-16 w-16 text-[#C9A227] mx-auto mb-4" />
                  <p className="text-white/60 font-medium">Enterprise Dashboard Preview</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Card Based */}
      <section id="features" className="py-24 bg-[#F5F7FA] dark:bg-[#0F1419]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B3C5D] dark:text-white mb-4">
              Comprehensive Valuation Platform
            </h2>
            <p className="text-lg text-[#4A5D73] dark:text-[#6B7F95] max-w-2xl mx-auto">
              Built for professionals who demand accuracy, security, and efficiency in property valuation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="h-full p-8 rounded-xl bg-white dark:bg-[#1A1F26] border border-[#E1E8ED] dark:border-[#2D3748] hover:border-[#C9A227] dark:hover:border-[#C9A227] transition-all duration-300 hover:shadow-xl">
                  <div className="bg-[#F5F7FA] dark:bg-[#0F1419] p-4 rounded-lg w-fit mb-6 group-hover:bg-[#C9A227]/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#4A5D73] dark:text-[#6B7F95] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white dark:bg-[#1A1F26] border-y border-[#E1E8ED] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <ShieldCheck className="h-12 w-12 text-[#2E8B57] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0B3C5D] dark:text-white mb-2">Bank-Level Security</h3>
              <p className="text-[#4A5D73] dark:text-[#6B7F95]">End-to-end encryption and compliance</p>
            </div>
            <div>
              <CheckCircle2 className="h-12 w-12 text-[#2E8B57] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0B3C5D] dark:text-white mb-2">ISO Certified</h3>
              <p className="text-[#4A5D73] dark:text-[#6B7F95]">International standards compliance</p>
            </div>
            <div>
              <Users className="h-12 w-12 text-[#2E8B57] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0B3C5D] dark:text-white mb-2">24/7 Support</h3>
              <p className="text-[#4A5D73] dark:text-[#6B7F95]">Dedicated enterprise support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-[#0B3C5D] dark:bg-[#0F1419] text-white/80 py-16 border-t border-[#0A3351] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                <span className="text-2xl font-bold text-white tracking-tight">
                  Value<span className="text-[#C9A227]">It</span>
                </span>
              </Link>
              <p className="mt-4 max-w-md text-sm text-white/70 leading-relaxed">
                The leading enterprise platform for cost-based property valuation management. 
                Trusted by financial institutions and valuation professionals worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} ValueIt Enterprise. All rights reserved. ISO 27001 Certified.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
