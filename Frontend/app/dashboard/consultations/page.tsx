"use client";
import { motion } from "framer-motion";
import { Video, Star, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const doctors = [
  { name: "Dr. Meera Nair", specialty: "General Physician", rating: 4.9, availability: "Available now", color: "#D4956A", initials: "MN" },
  { name: "Dr. Rajan Kumar", specialty: "Endocrinologist", rating: 4.8, availability: "In 30 mins", color: "#7A9470", initials: "RK" },
  { name: "Dr. Priya Sharma", specialty: "Nutritionist & Wellness", rating: 4.9, availability: "Tomorrow 9 AM", color: "#6A8AB0", initials: "PS" },
  { name: "Dr. Arjun Pillai", specialty: "Cardiologist", rating: 4.7, availability: "May 12, 2PM", color: "#C9A84C", initials: "AP" },
];

export default function ConsultationsPage() {
  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Consultations</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Connect with your specialist team, wherever you are.</p>
      </motion.div>
      <div className="flex flex-col gap-4">
        {doctors.map((doc, i) => (
          <motion.div key={doc.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: i * 0.09 }}>
            <GlassCard className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" style={{ background: `linear-gradient(135deg, ${doc.color}, ${doc.color}CC)` }}>{doc.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-charcoal)" }}>{doc.name}</p>
                <p className="text-xs mb-1.5" style={{ color: "var(--color-warm-gray)" }}>{doc.specialty}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" style={{ color: "#C9A84C" }} fill="#C9A84C" strokeWidth={0} />
                    <span className="text-xs font-medium" style={{ color: "var(--color-charcoal-soft)" }}>{doc.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
                    <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{doc.availability}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-md flex-shrink-0" style={{ background: doc.color }}>
                <Video className="w-3 h-3" strokeWidth={2} /> Consult
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <div className="h-16" />
    </div>
  );
}
