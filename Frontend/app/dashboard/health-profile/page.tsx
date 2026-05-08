"use client";

import { motion } from "framer-motion";
import { HeartPulse, TrendingUp, Sparkles, AlertTriangle, Leaf, Droplets, Moon, Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const insights = [
  { title: "Sleep Optimization", score: 87, tag: "Sleep", color: "#6A8AB0", bg: "rgba(173,196,232,0.20)", icon: Moon, desc: "Circadian rhythm improved 18% this week. A consistent 10:30 PM bedtime will further improve deep sleep stages." },
  { title: "Cardiovascular Health", score: 92, tag: "Heart", color: "#C47A7A", bg: "rgba(232,196,196,0.20)", icon: Activity, desc: "Heart rate variability is in optimal range. Resting HR trend shows excellent recovery capacity." },
  { title: "Hydration & Nutrition", score: 74, tag: "Nutrition", color: "#C9A84C", bg: "rgba(201,168,76,0.16)", icon: Droplets, desc: "Protein intake is slightly below target. Add legumes or lean protein to your afternoon meals for better recovery." },
  { title: "Lifestyle Balance", score: 68, tag: "Lifestyle", color: "#7A9470", bg: "rgba(168,184,154,0.20)", icon: Leaf, desc: "Cortisol patterns suggest mild afternoon stress peaks. A 5-min breathing practice at 3 PM may significantly help." },
];

const conditions = [
  { name: "Mild Hypertension", status: "Managed", color: "#7A9470", bg: "rgba(168,184,154,0.18)" },
  { name: "Vitamin D Deficiency", status: "Resolved", color: "#C9A84C", bg: "rgba(201,168,76,0.14)" },
  { name: "Seasonal Rhinitis", status: "Ongoing", color: "#C47A7A", bg: "rgba(232,196,196,0.20)" },
];

export default function HealthProfilePage() {
  const overallScore = Math.round(insights.reduce((sum, i) => sum + i.score, 0) / insights.length);

  return (
    <div className="px-8 xl:px-12 py-10 max-w-4xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(173,196,232,0.22)" }}>
            <HeartPulse className="w-5 h-5" style={{ color: "#6A8AB0" }} strokeWidth={1.7} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>AI Insights</span>
        </div>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Health Profile & Insights</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>
          Your personal wellness identity. AI-generated insights, conditions, and lifestyle recommendations — updated daily.
        </p>
      </motion.div>

      {/* Overall Wellness Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-7 mb-8 flex items-center gap-8" hoverable={false}
          style={{ background: "linear-gradient(135deg, rgba(173,196,232,0.20) 0%, rgba(250,247,242,0.75) 100%)" }}>
          {/* Score ring */}
          <div className="relative flex-shrink-0 w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="46" fill="none" stroke="rgba(106,138,176,0.12)" strokeWidth="9" />
              <circle cx="56" cy="56" r="46" fill="none" stroke="url(#healthGrad)" strokeWidth="9" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46 * overallScore / 100} ${2 * Math.PI * 46 * (1 - overallScore / 100)}`} />
              <defs>
                <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6A8AB0" /><stop offset="100%" stopColor="#A8B89A" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-semibold" style={{ color: "var(--color-charcoal)" }}>{overallScore}</span>
              <span className="text-[10px]" style={{ color: "var(--color-warm-gray)" }}>/ 100</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" style={{ color: "#6A8AB0" }} strokeWidth={1.7} />
              <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>Overall Wellness Score</p>
            </div>
            <p className="text-[13px] mb-3" style={{ color: "var(--color-charcoal-soft)" }}>
              Your wellness is in <strong style={{ color: "#6A8AB0" }}>good standing</strong>. Small daily improvements in sleep quality and afternoon stress management could push your score above 85.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#7A9470" }}>
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
              ↑ 4 points from last month
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insight Cards */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>AI Insights</p>
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <motion.div key={insight.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 + i * 0.09 }}>
                <GlassCard className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: insight.bg }}>
                      <Icon className="w-4 h-4" style={{ color: insight.color }} strokeWidth={1.7} />
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-semibold" style={{ color: "var(--color-charcoal)" }}>{insight.score}</span>
                      <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>/100</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--color-charcoal)" }}>{insight.title}</p>
                  <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: "rgba(139,115,85,0.10)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: insight.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${insight.score}%` }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                    />
                  </div>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--color-charcoal-soft)", opacity: 0.82 }}>{insight.desc}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>Health Conditions</p>
          {conditions.map((cond, i) => (
            <motion.div key={cond.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 + i * 0.09 }}>
              <GlassCard className="p-5 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cond.color }} />
                <p className="flex-1 text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>{cond.name}</p>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg" style={{ background: cond.bg, color: cond.color }}>{cond.status}</span>
              </GlassCard>
            </motion.div>
          ))}

          {/* Allergies */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-warm-gray)" }}>Allergies</p>
            <GlassCard className="p-5" hoverable={false}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4" style={{ color: "#C9A84C" }} strokeWidth={1.8} />
                <p className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>Known Allergies</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Penicillin", "Aspirin", "Latex", "Dust Mites", "Pollen"].map((a) => (
                  <span key={a} className="px-2.5 py-1 rounded-xl text-[11.5px] font-medium"
                    style={{ background: "rgba(201,168,76,0.12)", color: "#A68B30", border: "1px solid rgba(201,168,76,0.18)" }}>{a}</span>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Lifestyle tip */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassCard className="p-5" hoverable={false}
              style={{ background: "linear-gradient(135deg, rgba(168,184,154,0.22) 0%, rgba(250,247,242,0.70) 100%)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4" style={{ color: "#7A9470" }} strokeWidth={1.7} />
                <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>Today&apos;s Recommendation</p>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-charcoal-soft)" }}>
                A 20-minute evening walk at dusk will improve melatonin onset and help regulate your blood pressure naturally.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
