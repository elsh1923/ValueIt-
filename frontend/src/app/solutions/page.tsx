"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import {
  Building2,
  BarChart3,
  FileCheck,
  ShieldCheck,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Landmark,
  Briefcase,
  Home,
  Globe,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 90 } },
};

const solutions = [
  {
    icon: <Landmark className="h-8 w-8 text-[#C9A227]" />,
    title: "Financial Institutions",
    subtitle: "Banks & Credit Unions",
    description:
      "Streamline mortgage and loan collateral valuations with automated workflows, audit trails, and compliance reporting built specifically for regulated financial environments.",
    benefits: [
      "Automated collateral review",
      "Regulatory compliance reports",
      "Multi-branch access control",
      "Real-time portfolio monitoring",
    ],
    tag: "Most Popular",
  },
  {
    icon: <Building2 className="h-8 w-8 text-[#C9A227]" />,
    title: "Real Estate Firms",
    subtitle: "Agencies & Developers",
    description:
      "Manage large property portfolios with precision cost-based valuations, team collaboration tools, and professional PDF report generation for client presentations.",
    benefits: [
      "Portfolio-wide valuations",
      "Client-ready PDF reports",
      "Team collaboration workspace",
      "Milestone tracking",
    ],
    tag: null,
  },
  {
    icon: <Briefcase className="h-8 w-8 text-[#C9A227]" />,
    title: "Valuation Firms",
    subtitle: "Professional Valuers",
    description:
      "Designed for certified valuers who need a structured, standardized workflow for cost-based assessments — from site inspection to final report with live material pricing.",
    benefits: [
      "Standardized valuation forms",
      "Live material price DB",
      "Inspection management",
      "IVS/RICS report templates",
    ],
    tag: null,
  },
  {
    icon: <Home className="h-8 w-8 text-[#C9A227]" />,
    title: "Insurance Companies",
    subtitle: "Risk & Claims Teams",
    description:
      "Accurately assess property replacement costs for underwriting, claims adjusting, and risk analysis using our structured inspection and cost-estimate engine.",
    benefits: [
      "Replacement cost estimates",
      "Claims workflow integration",
      "Inspection audit logs",
      "Risk scoring dashboards",
    ],
    tag: null,
  },
  {
    icon: <Globe className="h-8 w-8 text-[#C9A227]" />,
    title: "Government Agencies",
    subtitle: "Public Sector & Municipalities",
    description:
      "Support public asset valuation for infrastructure, land, and property registries with full traceability, role segregation, and government-grade reporting.",
    benefits: [
      "Public asset registers",
      "Role-based access",
      "Full audit trail",
      "Bulk valuation processing",
    ],
    tag: null,
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-[#C9A227]" />,
    title: "Investment Managers",
    subtitle: "PE Funds & Asset Managers",
    description:
      "Gain data-driven insights across property investments with aggregated cost valuations, performance dashboards, and portfolio analytics.",
    benefits: [
      "Portfolio cost analytics",
      "Depreciation tracking",
      "Cross-asset comparison",
      "Custom KPI dashboards",
    ],
    tag: null,
  },
];

const whyChoose = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-[#C9A227]" />,
    title: "Enterprise Security",
    desc: "SOC 2 and ISO 27001 aligned. Role-based access, end-to-end encryption, and comprehensive audit logging.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-[#C9A227]" />,
    title: "Accurate Cost Engine",
    desc: "Valuations backed by live material pricing databases and standardized cost-based methodologies.",
  },
  {
    icon: <FileCheck className="h-6 w-6 text-[#C9A227]" />,
    title: "Professional Reports",
    desc: "Generate IVS/RICS-aligned PDF reports in one click, ready for clients, courts, or regulators.",
  },
  {
    icon: <Users className="h-6 w-6 text-[#C9A227]" />,
    title: "Seamless Collaboration",
    desc: "Managers, valuers, and inspectors work in one unified platform with clear role separation.",
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0F1419] flex flex-col font-sans text-[#1A1A1A] dark:text-[#E8EAED]">
      {/* Navbar */}
      <nav className="fixed w-full bg-[#0B3C5D] dark:bg-[#1A1F26] backdrop-blur-sm z-50 border-b border-[#0A3351] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0 flex items-center gap-0">
              <span className="text-2xl font-bold text-white tracking-tight">
                Vaue<span className="text-[#C9A227]">IT</span>
              </span>
              <span className="ml-3 text-xs text-[#C9A227] font-semibold uppercase tracking-wider">
                Enterprise
              </span>
            </Link>
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                href="/#features"
                className="text-white/80 hover:text-white font-medium transition-colors text-sm"
              >
                Features
              </Link>
              <Link
                href="/solutions"
                className="text-white font-semibold text-sm border-b-2 border-[#C9A227] pb-0.5"
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
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 text-sm"
                  >
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
                  Tailored for Every Industry
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
            >
              Solutions Built for{" "}
              <span className="text-[#C9A227]">Your Industry</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              VaueIT adapts to the needs of financial institutions, real estate
              professionals, insurers, and government agencies — delivering
              accurate cost-based valuations at enterprise scale.
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
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base h-12 border-white/30 text-white hover:bg-white/10"
                >
                  Request a Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-[#F5F7FA] dark:bg-[#0F1419]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B3C5D] dark:text-white mb-4">
              Industry-Specific Solutions
            </h2>
            <p className="text-lg text-[#4A5D73] dark:text-[#6B7F95] max-w-2xl mx-auto">
              Whether you are a bank, valuation firm, or government agency,
              VaueIT has a purpose-built solution for your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((sol, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                {sol.tag && (
                  <span className="absolute -top-3 left-6 z-10 bg-[#C9A227] text-[#0B3C5D] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {sol.tag}
                  </span>
                )}
                <div className="h-full p-8 rounded-xl bg-white dark:bg-[#1A1F26] border border-[#E1E8ED] dark:border-[#2D3748] hover:border-[#C9A227] dark:hover:border-[#C9A227] transition-all duration-300 hover:shadow-xl flex flex-col">
                  <div className="bg-[#F5F7FA] dark:bg-[#0F1419] p-4 rounded-lg w-fit mb-5 group-hover:bg-[#C9A227]/10 transition-colors">
                    {sol.icon}
                  </div>
                  <div className="mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                      {sol.subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white mt-1 mb-3">
                      {sol.title}
                    </h3>
                  </div>
                  <p className="text-[#4A5D73] dark:text-[#6B7F95] leading-relaxed text-sm mb-6">
                    {sol.description}
                  </p>
                  <ul className="space-y-2 mt-auto">
                    {sol.benefits.map((b, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-[#2E8B57] flex-shrink-0" />
                        <span className="text-[#1A1A1A] dark:text-[#CBD5E0]">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="mt-6 block">
                    <Button
                      variant="outline"
                      className="w-full border-[#0B3C5D] dark:border-[#4A5D73] text-[#0B3C5D] dark:text-white hover:bg-[#0B3C5D] hover:text-white transition-colors"
                    >
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why VaueIT */}
      <section className="py-20 bg-white dark:bg-[#1A1F26] border-y border-[#E1E8ED] dark:border-[#2D3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B3C5D] dark:text-white mb-4">
              Why VaueIT?
            </h2>
            <p className="text-lg text-[#4A5D73] dark:text-[#6B7F95] max-w-xl mx-auto">
              Built from the ground up with professionals in mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-[#F5F7FA] dark:bg-[#0F1419] border border-[#E1E8ED] dark:border-[#2D3748] hover:border-[#C9A227] transition-colors"
              >
                <div className="bg-[#C9A227]/10 p-3 rounded-full w-fit mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#0B3C5D] dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#4A5D73] dark:text-[#6B7F95] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              Ready to Transform Your Valuation Workflow?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Join hundreds of professionals who trust VaueIT for accurate,
              compliant, and efficient property valuations.
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
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base h-12 border-white/30 text-white hover:bg-white/10"
                >
                  Sign In
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
                The leading enterprise platform for cost-based property
                valuation management. Trusted by financial institutions and
                valuation professionals worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/#features" className="hover:text-[#C9A227] transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-[#C9A227] transition-colors">
                    Solutions
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-[#C9A227] transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#C9A227] transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-[#C9A227] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#C9A227] transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#C9A227] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#C9A227] transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} VaueIT Enterprise. All rights
              reserved. ISO 27001 Certified.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
