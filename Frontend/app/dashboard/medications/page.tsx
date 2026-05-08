"use client";
import { motion } from "framer-motion";
import { Pill, CheckCircle, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";

const meds = [
  { name: "Amlodipine", dose: "5mg", schedule: "Once daily — 8:00 AM", taken: true, color: "#D4956A", refill: "12 days left" },
  { name: "Vitamin D3", dose: "60,000 IU", schedule: "Once weekly — Sunday", taken: false, color: "#C9A84C", refill: "3 weeks left" },
  { name: "Cetirizine", dose: "10mg", schedule: "As needed — evening", taken: true, color: "#7A9470", refill: "8 days left" },
  { name: "Omega 3", dose: "1000mg", schedule: "Twice daily — meals", taken: false, color: "#6A8AB0", refill: "20 days left" },
];

export default function MedicationsPage() {
  const [takenState, setTakenState] = useState(meds.map((m) => m.taken));
  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Medications</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Your daily prescription tracker. Stay consistent for best results.</p>
      </motion.div>
      <div className="flex flex-col gap-4">
        {meds.map((med, i) => (
          <motion.div key={med.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: i * 0.08 }}>
            <GlassCard className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${med.color}18` }}>
                <Pill className="w-4.5 h-4.5" style={{ color: med.color }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>{med.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: `${med.color}12`, color: med.color }}>{med.dose}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
                    <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{med.schedule}</span>
                  </div>
                  <span className="text-xs" style={{ color: "var(--color-warm-gray-light)" }}>·</span>
                  <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{med.refill}</span>
                </div>
              </div>
              <button onClick={() => setTakenState((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: takenState[i] ? `${med.color}18` : "rgba(139,115,85,0.06)", border: `1.5px solid ${takenState[i] ? med.color + "40" : "rgba(139,115,85,0.15)"}` }}>
                <CheckCircle className="w-4.5 h-4.5" style={{ color: takenState[i] ? med.color : "var(--color-warm-gray-light)" }} strokeWidth={1.8} />
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <div className="h-16" />
    </div>
  );
}
