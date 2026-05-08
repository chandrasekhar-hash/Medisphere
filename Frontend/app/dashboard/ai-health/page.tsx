"use client";
import { motion } from "framer-motion";
import { BrainCircuit, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const insights = [
  { title: "Sleep Optimization", score: 87, desc: "Your circadian rhythm has improved by 18% this week. Consider a consistent bedtime of 10:30 PM.", tag: "Sleep" },
  { title: "Cardiovascular Health", score: 92, desc: "Heart rate variability is within optimal range. Your resting HR trend shows excellent recovery.", tag: "Heart" },
  { title: "Nutrition Pattern", score: 74, desc: "Protein intake is slightly below target. Consider adding legumes or lean protein to your afternoon meals.", tag: "Nutrition" },
  { title: "Stress Indicators", score: 68, desc: "Cortisol patterns suggest mild afternoon stress. Short breathing exercises at 3–4 PM could help significantly.", tag: "Mental" },
];

export default function AIHealthPage() {
  return (
    <div className="px-8 xl:px-12 py-10 max-w-4xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(232,196,160,0.35)" }}>
            <BrainCircuit className="w-5 h-5" style={{ color: "#D4956A" }} strokeWidth={1.7} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>AI Analysis</p>
        </div>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>AI Health Analysis</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Personalized insights generated from your health data, updated daily.</p>
      </motion.div>

      {/* Overall Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        <GlassCard className="p-7 mb-8 flex items-center gap-7" hoverable={false} style={{ background: "linear-gradient(135deg, rgba(232,196,160,0.25) 0%, rgba(250,247,242,0.7) 100%)" }}>
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(139,115,85,0.12)" strokeWidth="8"/>
                <circle cx="48" cy="48" r="40" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40 * 0.82} ${2 * Math.PI * 40 * 0.18}`}/>
                <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B7355"/><stop offset="100%" stopColor="#D4956A"/>
                </linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-semibold" style={{ color: "var(--color-charcoal)" }}>82</span>
                <span className="text-[10px]" style={{ color: "var(--color-warm-gray)" }}>/ 100</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" style={{ color: "var(--color-warm-brown)" }} strokeWidth={1.7} />
              <span className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>Overall Wellness Score</span>
            </div>
            <p className="text-sm mb-3" style={{ color: "var(--color-warm-gray)" }}>Your wellness is in <strong style={{ color: "var(--color-warm-brown)" }}>good standing</strong>. Focus on stress management and nutrition for significant gains.</p>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--color-sage-dark)" }}>
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />↑ 4 points from last month
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {insights.map((insight, i) => (
          <motion.div key={insight.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 + i * 0.09 }}>
            <GlassCard className="p-6 h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg" style={{ background: "rgba(139,115,85,0.08)", color: "var(--color-warm-brown)" }}>{insight.tag}</span>
                <span className="font-display text-2xl font-semibold" style={{ color: "var(--color-charcoal)" }}>{insight.score}<span className="text-xs font-normal" style={{ color: "var(--color-warm-gray)" }}>/100</span></span>
              </div>
              <h3 className="font-display text-lg font-medium mb-2" style={{ color: "var(--color-charcoal)" }}>{insight.title}</h3>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--color-charcoal-soft)", opacity: 0.8 }}>{insight.desc}</p>
              <button className="mt-4 flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--color-warm-brown)" }}>
                View details <ArrowRight className="w-3 h-3" strokeWidth={2} />
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <div className="h-16" />
    </div>
  );
}
