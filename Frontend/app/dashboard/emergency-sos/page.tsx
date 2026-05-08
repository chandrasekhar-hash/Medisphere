"use client";

import { motion } from "framer-motion";
import { AlertOctagon, Phone, MapPin, Heart, ChevronRight, User, Siren } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const emergencyContacts = [
  { name: "Priya Chandra", relation: "Spouse", phone: "+91 98401 55678", initials: "PC", color: "#C47A7A" },
  { name: "Ramesh Chandra", relation: "Father", phone: "+91 94450 33210", initials: "RC", color: "#D4956A" },
  { name: "Dr. Meera Nair", relation: "Primary Physician", phone: "+91 98400 88900", initials: "MN", color: "#7A9470" },
];

const nearbyHospitals = [
  { name: "Apollo Hospitals", distance: "1.2 km", type: "Multi-specialty", emergency: true },
  { name: "Fortis Malar Hospital", distance: "2.8 km", type: "Cardiac Centre", emergency: true },
  { name: "MIOT International", distance: "4.1 km", type: "Super-specialty", emergency: false },
];

export default function EmergencySOSPage() {
  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(196,75,75,0.10)" }}>
            <AlertOctagon className="w-5 h-5" style={{ color: "#C44B4B" }} strokeWidth={1.7} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#C44B4B" }}>Emergency</span>
        </div>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Emergency SOS</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>
          Quick access to emergency contacts, critical health info, and nearby hospitals.
        </p>
      </motion.div>

      {/* SOS Button */}
      <motion.div className="flex justify-center mb-10" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          {/* Pulse rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div key={ring} className="absolute inset-0 rounded-full"
              style={{ border: "2px solid rgba(196,75,75,0.25)" }}
              animate={{ scale: [1, 1 + ring * 0.25], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: ring * 0.6, ease: "easeOut" }}
            />
          ))}
          <motion.button
            className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center text-white gap-2"
            style={{ background: "linear-gradient(135deg, #C44B4B, #E06060)", boxShadow: "0 12px 40px rgba(196,75,75,0.40)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Siren className="w-8 h-8" strokeWidth={1.5} />
            <span className="text-sm font-bold tracking-wide">CALL SOS</span>
            <span className="text-[10px] opacity-75">Hold 3 seconds</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Critical Medical Info */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-6 mb-8" hoverable={false}
          style={{ background: "linear-gradient(135deg, rgba(196,75,75,0.06) 0%, rgba(250,247,242,0.80) 100%)", border: "1px solid rgba(196,75,75,0.10)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4" style={{ color: "#C44B4B" }} strokeWidth={1.8} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>Critical Medical Information</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Blood Group", value: "O+" },
              { label: "Known Allergies", value: "Penicillin, Aspirin" },
              { label: "Primary Condition", value: "Mild Hypertension" },
              { label: "Emergency Med", value: "Amlodipine 5mg" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.50)" }}>
                <p className="text-[10.5px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--color-warm-gray)" }}>{item.label}</p>
                <p className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Emergency Contacts */}
      <div className="flex items-center gap-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>Emergency Contacts</p>
        <div className="flex-1 h-px" style={{ background: "rgba(139,115,85,0.10)" }} />
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {emergencyContacts.map((contact, i) => (
          <motion.div key={contact.name} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}>
            <GlassCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                style={{ background: contact.color }}>
                {contact.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-charcoal)" }}>{contact.name}</p>
                <p className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{contact.relation} · {contact.phone}</p>
              </div>
              <motion.button
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #7A9470, #A8B89A)" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Phone className="w-3 h-3" strokeWidth={2} /> Call
              </motion.button>
            </GlassCard>
          </motion.div>
        ))}

        <button className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-colors"
          style={{ background: "rgba(255,255,255,0.35)", border: "1px dashed rgba(139,115,85,0.25)", color: "var(--color-warm-gray)" }}>
          <User className="w-4 h-4" strokeWidth={1.6} /> Add Emergency Contact
        </button>
      </div>

      {/* Nearby Hospitals */}
      <div className="flex items-center gap-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>Nearby Hospitals</p>
        <div className="flex-1 h-px" style={{ background: "rgba(139,115,85,0.10)" }} />
      </div>

      <div className="flex flex-col gap-3">
        {nearbyHospitals.map((hospital, i) => (
          <motion.div key={hospital.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.45 + i * 0.08 }}>
            <GlassCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: hospital.emergency ? "rgba(196,75,75,0.10)" : "rgba(139,115,85,0.08)" }}>
                <MapPin className="w-4 h-4" style={{ color: hospital.emergency ? "#C44B4B" : "var(--color-warm-gray)" }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>{hospital.name}</p>
                  {hospital.emergency && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(196,75,75,0.12)", color: "#C44B4B" }}>24/7 ER</span>
                  )}
                </div>
                <p className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{hospital.type} · {hospital.distance}</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.6} />
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="h-16" />
    </div>
  );
}
