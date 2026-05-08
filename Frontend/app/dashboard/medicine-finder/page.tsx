"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PillBottle, Search, TrendingDown, Store, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const medicines = [
  {
    branded: "Crocin 500mg", brandPrice: "₹32 / 10 tabs", generic: "Paracetamol 500mg", genericPrice: "₹8 / 10 tabs",
    saving: "75%", pharmacy: "Apollo, MedPlus", composition: "Paracetamol 500mg", manufacturer: "GSK",
  },
  {
    branded: "Augmentin 625mg", brandPrice: "₹210 / 10 tabs", generic: "Amoxicillin+Clavulanate", genericPrice: "₹58 / 10 tabs",
    saving: "72%", pharmacy: "NetMeds, 1mg", composition: "Amoxicillin 500mg + Clavulanic Acid 125mg", manufacturer: "Sun Pharma",
  },
  {
    branded: "Pantocid 40mg", brandPrice: "₹140 / 10 tabs", generic: "Pantoprazole 40mg", genericPrice: "₹22 / 10 tabs",
    saving: "84%", pharmacy: "Pharmeasy, Apollo", composition: "Pantoprazole Sodium 40mg", manufacturer: "Cipla",
  },
  {
    branded: "Telma 40mg", brandPrice: "₹190 / 15 tabs", generic: "Telmisartan 40mg", genericPrice: "₹45 / 15 tabs",
    saving: "76%", pharmacy: "1mg, MedPlus", composition: "Telmisartan 40mg", manufacturer: "Mankind",
  },
];

export default function MedicineFinderPage() {
  const [search, setSearch] = useState("");
  const filtered = medicines.filter((m) =>
    m.branded.toLowerCase().includes(search.toLowerCase()) ||
    m.generic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-8 xl:px-12 py-10 max-w-4xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.18)" }}>
            <PillBottle className="w-5 h-5" style={{ color: "#C9A84C" }} strokeWidth={1.7} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>Save More</span>
        </div>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Generic Medicine Finder</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>
          Find affordable generic alternatives to branded medicines. Same composition, dramatically lower cost.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div className="mb-8 relative" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.6} />
        <input
          type="text"
          placeholder="Search by branded or generic name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-luxury pl-11"
        />
      </motion.div>

      {/* Savings Banner */}
      <motion.div className="mb-7 rounded-2xl px-5 py-4 flex items-center gap-4"
        style={{ background: "rgba(201,168,76,0.10)", border: "1px solid rgba(201,168,76,0.18)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <TrendingDown className="w-5 h-5 flex-shrink-0" style={{ color: "#C9A84C" }} strokeWidth={1.8} />
        <p className="text-sm" style={{ color: "var(--color-charcoal-soft)" }}>
          Patients using generic medicines save an average of <strong style={{ color: "#A68B30" }}>₹4,200/year</strong> on prescriptions.
        </p>
      </motion.div>

      {/* Comparison Cards */}
      <div className="flex flex-col gap-5">
        {filtered.map((med, i) => (
          <motion.div key={med.branded} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 + i * 0.09 }}>
            <GlassCard className="p-6 overflow-hidden">
              {/* Saving badge */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-warm-gray)" }}>Composition</p>
                  <p className="text-sm" style={{ color: "var(--color-charcoal-soft)" }}>{med.composition}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(122,148,112,0.14)" }}>
                  <TrendingDown className="w-3.5 h-3.5" style={{ color: "#7A9470" }} strokeWidth={2} />
                  <span className="text-xs font-bold" style={{ color: "#7A9470" }}>Save {med.saving}</span>
                </div>
              </div>

              {/* Comparison grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Branded */}
                <div className="rounded-2xl p-4" style={{ background: "rgba(232,196,196,0.14)", border: "1px solid rgba(232,196,196,0.25)" }}>
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#C47A7A" }}>Branded</p>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-charcoal)" }}>{med.branded}</p>
                  <p className="text-base font-bold font-display" style={{ color: "#C47A7A" }}>{med.brandPrice}</p>
                </div>
                {/* Generic */}
                <div className="rounded-2xl p-4" style={{ background: "rgba(168,184,154,0.18)", border: "1px solid rgba(168,184,154,0.28)" }}>
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#7A9470" }}>Generic</p>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-charcoal)" }}>{med.generic}</p>
                  <p className="text-base font-bold font-display" style={{ color: "#7A9470" }}>{med.genericPrice}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid rgba(139,115,85,0.08)" }}>
                <div className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.7} />
                  <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>Available at: {med.pharmacy}</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--color-warm-brown)" }}>
                  Order <ArrowRight className="w-3 h-3" strokeWidth={2} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <div className="h-16" />
    </div>
  );
}
