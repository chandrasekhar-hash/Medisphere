"use client";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, MapPin, User } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const appointments = [
  { doctor: "Dr. Meera Nair", specialty: "General Physician", date: "Fri, May 9", time: "10:30 AM", location: "Medisphere Clinic, Anna Nagar", type: "In-person", color: "#D4956A" },
  { doctor: "Dr. Rajan Kumar", specialty: "Endocrinologist", date: "Wed, May 14", time: "3:00 PM", location: "Virtual Consultation", type: "Video", color: "#7A9470" },
  { doctor: "Dr. Priya Sharma", specialty: "Nutritionist", date: "Tue, May 20", time: "11:00 AM", location: "Virtual Consultation", type: "Video", color: "#C9A84C" },
];

export default function AppointmentsPage() {
  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Appointments</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Your upcoming scheduled visits and consultations.</p>
      </motion.div>
      <div className="flex flex-col gap-5">
        {appointments.map((apt, i) => (
          <motion.div key={apt.doctor} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }}>
            <GlassCard className="p-6" style={{ borderLeft: `3px solid ${apt.color}40` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-semibold" style={{ background: apt.color }}>
                    {apt.doctor.split(" ")[1][0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>{apt.doctor}</p>
                    <p className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{apt.specialty}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg" style={{ background: `${apt.color}15`, color: apt.color }}>{apt.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: CalendarCheck, text: apt.date },
                  { icon: Clock, text: apt.time },
                  { icon: apt.type === "Video" ? User : MapPin, text: apt.location },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="w-3 h-3 flex-shrink-0" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
                    <span className="text-xs truncate" style={{ color: "var(--color-charcoal-soft)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
        <motion.button className="w-full py-3.5 rounded-3xl text-sm font-medium transition-all hover:shadow-md" style={{ background: "rgba(139,115,85,0.08)", color: "var(--color-warm-brown)", border: "1px dashed rgba(139,115,85,0.25)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          + Book New Appointment
        </motion.button>
      </div>
      <div className="h-16" />
    </div>
  );
}
