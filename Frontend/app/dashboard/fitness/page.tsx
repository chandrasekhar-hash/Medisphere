"use client";
import { motion } from "framer-motion";
import { Dumbbell, Footprints, Flame, Moon, Droplets } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const stats = [
  { label: "Steps Today", value: "8,240", target: "10,000", percent: 82, icon: Footprints, color: "#7A9470", bg: "rgba(168,184,154,0.20)" },
  { label: "Calories Burned", value: "412", target: "600 kcal", percent: 69, icon: Flame, color: "#D4956A", bg: "rgba(232,196,160,0.20)" },
  { label: "Sleep", value: "8h 24m", target: "8h goal", percent: 100, icon: Moon, color: "#6A8AB0", bg: "rgba(173,196,232,0.20)" },
  { label: "Hydration", value: "1.8L", target: "2.5L goal", percent: 72, icon: Droplets, color: "#C9A84C", bg: "rgba(201,168,76,0.15)" },
];

export default function FitnessPage() {
  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Fitness & Wellness</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Your daily wellness metrics. Keep moving, stay balanced.</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: i * 0.09 }}>
              <GlassCard className="p-6" hoverable={false}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: stat.bg }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} strokeWidth={1.7} />
                </div>
                <p className="text-xs mb-1" style={{ color: "var(--color-warm-gray)" }}>{stat.label}</p>
                <p className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--color-charcoal)" }}>{stat.value}</p>
                <p className="text-xs mb-3" style={{ color: "var(--color-warm-gray)" }}>of {stat.target}</p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(139,115,85,0.10)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: stat.color }} initial={{ width: 0 }} animate={{ width: `${stat.percent}%` }} transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }} />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
      <motion.div className="mt-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}>
        <GlassCard className="p-6 flex items-center gap-5" hoverable={false}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,184,154,0.25)" }}>
            <Dumbbell className="w-6 h-6" style={{ color: "#7A9470" }} strokeWidth={1.7} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-charcoal)" }}>Weekly Activity Goal</p>
            <p className="text-[13px]" style={{ color: "var(--color-warm-gray)" }}>You&apos;ve completed <strong style={{ color: "var(--color-warm-brown)" }}>5 of 7</strong> active days this week. Just 2 more to hit your goal!</p>
          </div>
        </GlassCard>
      </motion.div>
      <div className="h-16" />
    </div>
  );
}
