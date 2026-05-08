"use client";
import { motion } from "framer-motion";
import { FlaskConical, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const reports = [
  { name: "Complete Blood Count", date: "May 5, 2026", status: "Normal", doctor: "Dr. Meera Nair" },
  { name: "Lipid Profile", date: "May 5, 2026", status: "Normal", doctor: "Dr. Meera Nair" },
  { name: "Thyroid Function Test", date: "Apr 18, 2026", status: "Review", doctor: "Dr. Rajan Kumar" },
  { name: "HbA1c (Blood Sugar)", date: "Apr 18, 2026", status: "Normal", doctor: "Dr. Rajan Kumar" },
  { name: "Vitamin D & B12", date: "Mar 30, 2026", status: "Low", doctor: "Dr. Priya Sharma" },
  { name: "Liver Function Test", date: "Mar 30, 2026", status: "Normal", doctor: "Dr. Priya Sharma" },
];

const statusConfig = {
  Normal: { color: "var(--color-sage-dark)", bg: "rgba(168,184,154,0.18)", icon: CheckCircle },
  Review: { color: "#C9A84C", bg: "rgba(201,168,76,0.15)", icon: Clock },
  Low: { color: "#C47A7A", bg: "rgba(232,196,196,0.20)", icon: AlertTriangle },
};

export default function LabReportsPage() {
  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,184,154,0.25)" }}>
            <FlaskConical className="w-5 h-5" style={{ color: "#7A9470" }} strokeWidth={1.7} />
          </div>
        </div>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Lab Reports</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Your recent laboratory test results, organized and explained.</p>
      </motion.div>
      <div className="flex flex-col gap-4">
        {reports.map((report, i) => {
          const cfg = statusConfig[report.status as keyof typeof statusConfig];
          const StatusIcon = cfg.icon;
          return (
            <motion.div key={report.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.07 }}>
              <GlassCard className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                  <StatusIcon className="w-4.5 h-4.5" style={{ color: cfg.color }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-charcoal)" }}>{report.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{report.doctor} · {report.date}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>{report.status}</span>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
      <div className="h-16" />
    </div>
  );
}
