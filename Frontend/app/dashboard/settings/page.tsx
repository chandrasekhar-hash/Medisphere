"use client";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Palette, Globe } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const settingsSections = [
  { icon: Bell, title: "Notifications", desc: "Medication reminders, appointment alerts, and health insights", color: "#D4956A" },
  { icon: Shield, title: "Privacy & Security", desc: "Manage data sharing, two-factor auth, and access logs", color: "#7A9470" },
  { icon: Palette, title: "Appearance", desc: "Theme, font size, and display preferences", color: "#C9A84C" },
  { icon: Globe, title: "Language & Region", desc: "Language, timezone, and date format settings", color: "#6A8AB0" },
];

export default function SettingsPage() {
  return (
    <div className="px-8 xl:px-12 py-10 max-w-2xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Settings</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Manage your preferences and account settings.</p>
      </motion.div>
      <div className="flex flex-col gap-4">
        {settingsSections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: i * 0.08 }}>
              <GlassCard className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${section.color}15` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: section.color }} strokeWidth={1.7} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-charcoal)" }}>{section.title}</p>
                  <p className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{section.desc}</p>
                </div>
                <Settings className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.6} />
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
      <div className="h-16" />
    </div>
  );
}
