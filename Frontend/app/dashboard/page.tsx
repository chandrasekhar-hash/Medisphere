"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ScanLine, Users, PillBottle, BellRing, FolderHeart, HeartPulse,
  Heart, Activity, Moon, ArrowRight, TrendingUp, Clock, Shield,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUser } from "@/lib/userContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const featureModules = [
  { id: "medicine-scanner", title: "Camera Scanner", description: "Scan food labels & medicine strips to detect harmful ingredients, allergens & health conflicts", icon: ScanLine, gradient: "linear-gradient(135deg, rgba(232,196,160,0.38) 0%, rgba(250,247,242,0.65) 100%)", accent: "#D4956A", tag: "Safety Check", stat: "Label + medicine strip", statIcon: TrendingUp, href: "/dashboard/medicine-scanner" },
  { id: "doctor-queue", title: "Virtual Doctor Queue", description: "Join a digital queue, track your token & get real-time waiting estimates", icon: Users, gradient: "linear-gradient(135deg, rgba(168,184,154,0.32) 0%, rgba(250,247,242,0.65) 100%)", accent: "#7A9470", tag: "Live Queue", stat: "Token #4 · 12 min", statIcon: Clock, href: "/dashboard/doctor-queue" },
  { id: "medicine-finder", title: "Generic Medicine Finder", description: "Find affordable generic alternatives & compare prices side-by-side", icon: PillBottle, gradient: "linear-gradient(135deg, rgba(201,168,76,0.20) 0%, rgba(250,247,242,0.65) 100%)", accent: "#C9A84C", tag: "Save Money", stat: "Avg. 68% cheaper", statIcon: TrendingUp, href: "/dashboard/medicine-finder" },
  { id: "pill-reminder", title: "Smart Pill Reminder", description: "Never miss a dose — set intelligent reminders with browser notifications", icon: BellRing, gradient: "linear-gradient(135deg, rgba(232,196,196,0.28) 0%, rgba(250,247,242,0.65) 100%)", accent: "#C47A7A", tag: "Daily Wellness", stat: "Browser alerts enabled", statIcon: Clock, href: "/dashboard/pill-reminder" },
  { id: "records-vault", title: "Medical Records Vault", description: "Upload & securely store prescriptions, lab reports & your complete health history", icon: FolderHeart, gradient: "linear-gradient(135deg, rgba(168,184,154,0.22) 0%, rgba(232,196,160,0.22) 100%)", accent: "#7A9470", tag: "Secure Storage", stat: "Upload real files", statIcon: Shield, href: "/dashboard/records-vault" },
  { id: "health-profile", title: "Health Profile & Insights", description: "Your personal wellness identity — AI-generated insights, conditions & lifestyle tips", icon: HeartPulse, gradient: "linear-gradient(135deg, rgba(173,196,232,0.22) 0%, rgba(250,247,242,0.65) 100%)", accent: "#6A8AB0", tag: "AI Insights", stat: "Wellness score: 82", statIcon: TrendingUp, href: "/dashboard/health-profile" },
];

const healthStats = [
  { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, color: "#C47A7A", bg: "rgba(232,196,196,0.20)" },
  { label: "Blood Pressure", value: "118/76", unit: "mmHg", icon: Activity, color: "#D4956A", bg: "rgba(232,196,160,0.20)" },
  { label: "Sleep Score", value: "8.4", unit: "hrs", icon: Moon, color: "#7A9470", bg: "rgba(168,184,154,0.20)" },
];

export default function DashboardPage() {
  const { user } = useUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const emoji = hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙";
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="px-8 xl:px-12 py-10 max-w-5xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <p className="text-sm mb-2" style={{ color: "var(--color-warm-gray)" }}>{greeting} {emoji}</p>
        <h1 className="font-display text-5xl xl:text-6xl font-light leading-[1.1] mb-3" style={{ color: "var(--color-charcoal)" }}>
          {firstName},<br /><span style={{ color: "var(--color-warm-brown)" }}>how are you feeling?</span>
        </h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Your personal health OS — all your care, beautifully in one place.</p>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-3 gap-4 mb-12" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        {healthStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.50)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.70)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: stat.bg }}>
                <Icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: "var(--color-warm-gray)" }}>{stat.label}</p>
                <p className="text-base font-semibold leading-none" style={{ color: "var(--color-charcoal)" }}>
                  {stat.value} <span className="text-xs font-normal" style={{ color: "var(--color-warm-gray)" }}>{stat.unit}</span>
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div className="flex items-center gap-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>Your Health Modules</p>
        <div className="flex-1 h-px" style={{ background: "rgba(139,115,85,0.10)" }} />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featureModules.map((module, i) => {
          const Icon = module.icon;
          const StatIcon = module.statIcon;
          return (
            <motion.div key={module.id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
              <Link href={module.href}>
                <GlassCard className="p-6 h-full flex flex-col" style={{ background: module.gradient }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.60)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                      <Icon className="w-5 h-5" style={{ color: module.accent }} strokeWidth={1.7} />
                    </div>
                    <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: `${module.accent}14`, color: module.accent }}>{module.tag}</span>
                  </div>
                  <h3 className="font-display text-xl font-medium mb-2 leading-snug" style={{ color: "var(--color-charcoal)" }}>{module.title}</h3>
                  <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: "var(--color-charcoal-soft)", opacity: 0.82 }}>{module.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11.5px] font-medium" style={{ color: module.accent }}>
                      <StatIcon className="w-3 h-3" strokeWidth={2} />{module.stat}
                    </div>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.55)" }}>
                      <ArrowRight className="w-3.5 h-3.5" style={{ color: module.accent }} strokeWidth={2} />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
      <div className="h-16" />
    </div>
  );
}
