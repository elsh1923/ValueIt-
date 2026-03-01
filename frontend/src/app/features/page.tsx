"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import {
  ShieldCheck,
  BarChart3,
  FileCheck,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Bell,
  Lock,
  Zap,
  Database,
  RefreshCw,
  MessageSquare,
  Download,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 90 } },
};

const features = [
  {
    category: "Valuation & Inspection",
    color: "bg-[#0B3C5D]/10",
    items: [
      {
        icon: <ClipboardList className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Structured Inspection Workflows",
        desc: "Guided inspection checklists for field teams with photo uploads, notes, and real-time syncing. Every field assessment is logged, timestamped, and linked to the project.",
        highlights: ["Digital inspection forms", "Photo capture & upload", "GPS tagging", "Offline mode support"],
      },
      {
        icon: <Database className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Live Material Price Database",
        desc: "Access a continuously updated database of construction material and labour costs. Valuations always reflect real-world market pricing, reducing margin for error.",
        highlights: ["Up-to-date material rates", "Regional price variants", "Custom rate overrides", "Historical rate tracking"],
      },
      {
        icon: <Building2 className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Cost-Based Valuation Engine",
        desc: "Our proprietary engine calculates replacement cost, depreciation, and net valuation with structured methodology aligned to IVS and RICS standards.",
        highlights: ["Replacement cost method", "Depreciation models", "IVS/RICS alignment", "Automated calculations"],
      },
    ],
  },
  {
    category: "Reporting & Analytics",
    color: "bg-[#C9A227]/10",
    items: [
      {
        icon: <FileCheck className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Professional PDF Reports",
        desc: "Generate branded, court-ready and client-grade valuation reports in one click. Templates cover residential, commercial, infrastructure, and industrial property types.",
        highlights: ["One-click PDF generation", "Branded report templates", "Multi-property reports", "Digital signature support"],
      },
      {
        icon: <BarChart3 className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Real-Time Analytics Dashboard",
        desc: "Visualise valuation data, project progress, and team performance through role-specific live dashboards. Drill into any project or valuation at a glance.",
        highlights: ["Role-specific dashboards", "Live KPI tracking", "Project timeline view", "Performance heatmaps"],
      },
      {
        icon: <TrendingUp className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Portfolio & Cost Analytics",
        desc: "Aggregate cost valuations across projects and time periods. Track depreciation trends, compare properties, and forecast replacement costs for strategic planning.",
        highlights: ["Cross-project aggregation", "Depreciation forecasting", "Cost trend analysis", "Exportable data tables"],
      },
    ],
  },
  {
    category: "Team & Project Management",
    color: "bg-[#2E8B57]/10",
    items: [
      {
        icon: <Users className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Role-Based Collaboration",
        desc: "Managers assign projects, Valuers conduct assessments, and Inspectors capture field data — all within clearly defined permissions and workflows.",
        highlights: ["Manager / Valuer / Inspector roles", "Task assignment", "Progress tracking", "Approval workflows"],
      },
      {
        icon: <Bell className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Smart Notifications",
        desc: "Keep your team aligned with automated alerts for status changes, pending approvals, report submissions, and inspection completions.",
        highlights: ["In-app notifications", "Email alerts", "Approval reminders", "Status change triggers"],
      },
      {
        icon: <RefreshCw className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Project Lifecycle Management",
        desc: "Track every valuation project from inception to delivery. Manage milestones, deadlines, assignments, and status changes in a single organised workspace.",
        highlights: ["Milestone tracking", "Deadline management", "Project status board", "Activity history"],
      },
    ],
  },
  {
    category: "Security & Compliance",
    color: "bg-[#7C3AED]/10",
    items: [
      {
        icon: <Lock className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Enterprise-Grade Security",
        desc: "Your data is protected by end-to-end encryption, secure authentication, and industry-grade access controls. We are aligned with ISO 27001 data security standards.",
        highlights: ["JWT authentication", "End-to-end encryption", "ISO 27001 alignment", "Secure data storage"],
      },
      {
        icon: <ShieldCheck className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "Full Audit Trail",
        desc: "Every action — from edits to approvals — is logged with timestamps and user attribution. Maintain a fully auditable record for regulatory and legal review.",
        highlights: ["Timestamped activity logs", "User attribution", "Immutable audit history", "Export for compliance"],
      },
      {
        icon: <MessageSquare className="h-7 w-7 text-[#0B3C5D] dark:text-[#C9A227]" />,
        title: "AI-Assisted Insights",
        desc: "Leverage AI-driven suggestions during valuations to flag anomalies, suggest comparable rates, and surface data-driven insights to improve report accuracy.",
        highlights: ["Anomaly detection", "Rate suggestions", "Comparative analysis", "Smart report hints"],
      },
    ],
  },
];

const highlights = [
  { icon: <Zap className="h-5 w-5 text-[#C9A227]" />, label: "Fast Setup", value: "Under 10 min onboarding" },
  { icon: <RefreshCw className="h-5 w-5 text-[#C9A227]" />, label: "Always Up to Date", value: "Real-time sync across all devices" },
  { icon: <Download className="h-5 w-5 text-[#C9A227]" />, label: "Export Anywhere", value: "PDF, CSV, and Excel exports" },
  { icon: <ShieldCheck className="h-5 w-5 text-[#C9A227]" />, label: "Compliant", value: "ISO 27001 & IVS aligned" },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0F1419] flex flex-col font-sans text-[#1A1A1A] dark:text-[#E8EAED]">
      {/* Navbar */}
      <nav className="fixed w-full bg-[#0B3C5D] dark:bg-[#1A1F26] backdrop-blur-sm z-50 border-b border-[#0A3351] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">
                Vaue<span className="text-[#C9A227]">IT</span>
              </span>
              <span className="ml-3 text-xs text-[#C9A227] font-semibold uppercase tracking-wider">
                Enterprise
              </span>
            </Link>
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                href="/features"
                className="text-white font-semibold text-sm border-b-2 border-[#C9A227] pb-0.5"
              >
                Features
              </Link>
              <Link
                href="/solutions"
                className="text-white/80 hover:text-white font-medium transition-colors text-sm"
              >
                Solutions
              </Link>
              <Link
                href="/#about"
                className="text-white/80 hover:text-white font-medium transition-colors text-sm"
              >
                About
              </Link>
              <div className="flex items-center space-x-3 ml-4">
                <ModeToggle />
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10 text-sm">
                    Sign In
                  </Button>
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0B3C5D] via-[#124A6F] to-[#0B3C5D] dark:from-[#0F1419] dark:via-[#1A1F26] dark:to-[#0F1419]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="inline-block">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30">
                <CheckCircle2 className="h-4 w-4 text-[#C9A227] mr-2" />
                <span className="text-[#C9A227] text-sm font-semibold">
                  Everything You Need in One Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
            >
              Powerful Features for{" "}
              <span className="text-[#C9A227]">Modern Valuers</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              From structured field inspections to AI-assisted insights and
              one-click professional reports — VaueIT equips your team with
              every tool required for accurate, efficient, and compliant
              cost-based valuations.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base h-12 bg-[#C9A227] hover:bg-[#B8921F] text-[#0B3C5D] font-semibold shadow-xl"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/solutions">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base h-12 border-white/30 text-white hover:bg-white/10"
                >
                  View Solutions
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Highlights Bar */}
      <section className="py-6 bg-[#0B3C5D] dark:bg-[#1A1F26] border-b border-[#0A3351] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 px-4">
                <div className="bg-[#C9A227]/10 p-2 rounded-lg flex-shrink-0">{h.icon}</div>
                <div>
                  <p className="text-[#C9A227] text-xs font-semibold uppercase tracking-wider">{h.label}</p>
                  <p className="text-white text-sm font-medium">{h.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      {features.map((group, gi) => (
        <section
          key={gi}
          className={`py-24 ${gi % 2 === 0 ? "bg-[#F5F7FA] dark:bg-[#0F1419]" : "bg-white dark:bg-[#1A1F26]"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14 flex items-center gap-4">
              <div className={`h-1 w-10 rounded-full bg-[#C9A227]`} />
              <h2 className="text-2xl md:text-3xl font-bold text-[#0B3C5D] dark:text-white">
                {group.category}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {group.items.map((feature, fi) => (
                <motion.div
                  key={fi}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: fi * 0.12 }}
                  className="group h-full"
                >
                  <div className="h-full p-8 rounded-xl bg-white dark:bg-[#1A1F26] border border-[#E1E8ED] dark:border-[#2D3748] hover:border-[#C9A227] dark:hover:border-[#C9A227] transition-all duration-300 hover:shadow-xl flex flex-col">
                    <div className="bg-[#F5F7FA] dark:bg-[#0F1419] p-4 rounded-lg w-fit mb-5 group-hover:bg-[#C9A227]/10 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#0B3C5D] dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[#4A5D73] dark:text-[#6B7F95] leading-relaxed text-sm mb-6">
                      {feature.desc}
                    </p>
                    <ul className="space-y-2 mt-auto">
                      {feature.highlights.map((h, hi) => (
                        <li key={hi} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[#2E8B57] flex-shrink-0" />
                          <span className="text-[#1A1A1A] dark:text-[#CBD5E0]">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[#0B3C5D] to-[#124A6F] dark:from-[#0F1419] dark:to-[#1A1F26]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              See VaueIT in Action
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Start your free trial today and experience the full power of enterprise cost-based valuation management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base h-12 bg-[#C9A227] hover:bg-[#B8921F] text-[#0B3C5D] font-semibold shadow-xl"
                >
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/solutions">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base h-12 border-white/30 text-white hover:bg-white/10"
                >
                  Explore Solutions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B3C5D] dark:bg-[#0F1419] text-white/80 py-16 border-t border-[#0A3351] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-bold text-white tracking-tight">
                Vaue<span className="text-[#C9A227]">IT</span>
              </span>
              <p className="mt-4 max-w-md text-sm text-white/70 leading-relaxed">
                The leading enterprise platform for cost-based property valuation management.
                Trusted by financial institutions and valuation professionals worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/features" className="hover:text-[#C9A227] transition-colors">Features</Link></li>
                <li><Link href="/solutions" className="hover:text-[#C9A227] transition-colors">Solutions</Link></li>
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#C9A227] transition-colors">Security</a></li>
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
              © {new Date().getFullYear()} VaueIT Enterprise. All rights reserved. ISO 27001 Certified.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
