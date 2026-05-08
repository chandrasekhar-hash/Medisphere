"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, CheckCircle, Wifi, CalendarCheck, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface QueueBooking {
  token: string;
  doctor: string;
  department: string;
  type: string;
  slot: string;
  wait: string;
  bookedAt: string;
}

const DOCTORS = [
  { name: "Dr. Meera Nair", dept: "General Medicine", slots: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"] },
  { name: "Dr. Rajan Kumar", dept: "Endocrinology", slots: ["11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM"] },
  { name: "Dr. Priya Sharma", dept: "Nutrition & Wellness", slots: ["10:00 AM", "10:30 AM", "4:00 PM", "4:30 PM"] },
  { name: "Dr. Arjun Pillai", dept: "Cardiology", slots: ["9:00 AM", "9:30 AM", "12:00 PM", "3:00 PM", "3:30 PM"] },
];

export default function DoctorQueuePage() {
  const [booking, setBooking] = useState<QueueBooking | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("mds_queue");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(0);
  const [selectedType, setSelectedType] = useState<"In-person" | "Video">("In-person");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [justBooked, setJustBooked] = useState(false);

  useEffect(() => {
    // Only used for potential client-side updates if needed, but the initializer handles mount.
  }, []);

  const book = async () => {
    if (!selectedSlot) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1400));
    const token = String(Math.floor(Math.random() * 15) + 2).padStart(2, "0");
    const waitMins = (parseInt(token) - 1) * 5;
    const doc = DOCTORS[selectedDoctor];
    const b: QueueBooking = {
      token,
      doctor: doc.name,
      department: doc.dept,
      type: selectedType,
      slot: selectedSlot,
      wait: `~${waitMins} min`,
      bookedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    localStorage.setItem("mds_queue", JSON.stringify(b));
    setBooking(b);
    setConfirming(false);
    setShowForm(false);
    setJustBooked(true);
    setTimeout(() => setJustBooked(false), 3000);
  };

  const cancelBooking = () => {
    localStorage.removeItem("mds_queue");
    setBooking(null);
    setSelectedSlot("");
  };

  const doc = DOCTORS[selectedDoctor];

  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      {/* Header */}
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,184,154,0.28)" }}>
            <Users className="w-5 h-5" style={{ color: "#7A9470" }} strokeWidth={1.7} />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#7A9470" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7A9470" }}>Live Queue</span>
          </div>
        </div>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Virtual Doctor Queue</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Book your slot and track your queue position in real time.</p>
      </motion.div>

      {/* ── SECTION 1: My Queue Status ── */}
      <div className="flex items-center gap-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>My Queue Status</p>
        <div className="flex-1 h-px" style={{ background: "rgba(139,115,85,0.10)" }} />
      </div>

      <AnimatePresence mode="wait">
        {booking ? (
          <motion.div key="active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
            {justBooked && (
              <motion.div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-2xl" style={{ background: "rgba(122,148,112,0.14)", border: "1px solid rgba(122,148,112,0.22)" }}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <CheckCircle className="w-4 h-4" style={{ color: "#7A9470" }} strokeWidth={2} />
                <span className="text-sm font-medium" style={{ color: "#7A9470" }}>Queue booked successfully!</span>
              </motion.div>
            )}

            <GlassCard className="p-7 mb-6 flex items-center gap-7" hoverable={false}
              style={{ background: "linear-gradient(135deg, rgba(168,184,154,0.28) 0%, rgba(250,247,242,0.80) 100%)" }}>
              {/* Token circle with pulse */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, #7A9470, #A8B89A)", boxShadow: "0 8px 24px rgba(122,148,112,0.30)" }}>
                  <span className="text-white text-[10px] font-medium opacity-80">Token</span>
                  <span className="text-white text-3xl font-display font-semibold leading-none">#{booking.token}</span>
                </div>
                {[1, 2].map((r) => (
                  <motion.div key={r} className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(122,148,112,0.3)" }}
                    animate={{ scale: [1, 1 + r * 0.2], opacity: [0.5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: r * 0.8, ease: "easeOut" }} />
                ))}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-charcoal)" }}>{booking.doctor} · {booking.department}</p>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5" style={{ color: "#7A9470" }} strokeWidth={1.8} />
                  <span className="text-sm font-medium" style={{ color: "#7A9470" }}>Est. wait: {booking.wait}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Wifi className="w-3.5 h-3.5" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.7} />
                  <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{booking.type} · Slot: {booking.slot}</span>
                </div>
                <button onClick={cancelBooking} className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "#C44B4B" }}>
                  <X className="w-3 h-3" strokeWidth={2} /> Cancel Queue
                </button>
              </div>
            </GlassCard>

            {/* Progress bar */}
            <div className="mb-2 flex justify-between">
              <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>Queue progress</span>
              <span className="text-xs font-medium" style={{ color: "var(--color-charcoal)" }}>Token #01 in consultation</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-8" style={{ background: "rgba(139,115,85,0.10)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7A9470, #A8B89A)" }}
                initial={{ width: 0 }} animate={{ width: "12%" }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-8 mb-8 flex flex-col items-center text-center" hoverable={false}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(168,184,154,0.18)" }}>
                <CalendarCheck className="w-6 h-6" style={{ color: "#7A9470" }} strokeWidth={1.6} />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-charcoal)" }}>No active queue</p>
              <p className="text-xs mb-5" style={{ color: "var(--color-warm-gray)" }}>Book a slot below to get your digital token</p>
              <motion.button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #7A9470, #A8B89A)", boxShadow: "0 6px 20px rgba(122,148,112,0.25)" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Book Queue Slot
              </motion.button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECTION 2: Book Queue ── */}
      <div className="flex items-center gap-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>
          {booking ? "Change Booking" : "Book Your Queue"}
        </p>
        <div className="flex-1 h-px" style={{ background: "rgba(139,115,85,0.10)" }} />
        {!showForm && (
          <motion.button onClick={() => setShowForm(true)}
            className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--color-warm-brown)" }}
            whileHover={{ scale: 1.03 }}>
            {booking ? "Modify ↗" : "Open Form ↗"}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>
            <GlassCard className="p-7" hoverable={false}
              style={{ background: "linear-gradient(135deg, rgba(168,184,154,0.18) 0%, rgba(250,247,242,0.80) 100%)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-medium" style={{ color: "var(--color-charcoal)" }}>Book Your Slot</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-xl hover:bg-black/5 transition-colors">
                  <X className="w-4 h-4" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {/* Doctor Select */}
                <div>
                  <label className="text-[10.5px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--color-warm-gray)" }}>Select Doctor</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DOCTORS.map((d, i) => (
                      <button key={d.name} onClick={() => { setSelectedDoctor(i); setSelectedSlot(""); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200"
                        style={{
                          background: selectedDoctor === i ? "rgba(122,148,112,0.18)" : "rgba(255,255,255,0.50)",
                          border: `1.5px solid ${selectedDoctor === i ? "rgba(122,148,112,0.35)" : "rgba(139,115,85,0.12)"}`,
                        }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                          style={{ background: selectedDoctor === i ? "#7A9470" : "rgba(139,115,85,0.25)" }}>
                          {d.name.split(" ")[1][0]}
                        </div>
                        <div>
                          <p className="text-[12.5px] font-semibold" style={{ color: "var(--color-charcoal)" }}>{d.name}</p>
                          <p className="text-[11px]" style={{ color: "var(--color-warm-gray)" }}>{d.dept}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="text-[10.5px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--color-warm-gray)" }}>Consultation Type</label>
                  <div className="flex gap-3">
                    {(["In-person", "Video"] as const).map((t) => (
                      <button key={t} onClick={() => setSelectedType(t)}
                        className="flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200"
                        style={{
                          background: selectedType === t ? "rgba(122,148,112,0.18)" : "rgba(255,255,255,0.50)",
                          color: selectedType === t ? "#7A9470" : "var(--color-charcoal-soft)",
                          border: `1.5px solid ${selectedType === t ? "rgba(122,148,112,0.35)" : "rgba(139,115,85,0.12)"}`,
                        }}>
                        {t === "In-person" ? "🏥 In-person" : "📹 Video"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-[10.5px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--color-warm-gray)" }}>Available Slots — Today</label>
                  <div className="flex flex-wrap gap-2">
                    {doc.slots.map((slot) => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)}
                        className="px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all duration-200"
                        style={{
                          background: selectedSlot === slot ? "#7A9470" : "rgba(255,255,255,0.55)",
                          color: selectedSlot === slot ? "white" : "var(--color-charcoal-soft)",
                          border: `1.5px solid ${selectedSlot === slot ? "#7A9470" : "rgba(139,115,85,0.15)"}`,
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                  {!selectedSlot && <p className="text-xs mt-2" style={{ color: "var(--color-warm-gray)" }}>Please select a time slot</p>}
                </div>

                {/* Book Button */}
                <motion.button onClick={book} disabled={!selectedSlot || confirming}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-300 mt-1"
                  style={{
                    background: !selectedSlot ? "rgba(122,148,112,0.40)" : "linear-gradient(135deg, #7A9470, #A8B89A)",
                    boxShadow: selectedSlot ? "0 8px 24px rgba(122,148,112,0.28)" : "none",
                    cursor: !selectedSlot ? "not-allowed" : "pointer",
                  }}
                  whileHover={selectedSlot ? { scale: 1.015 } : {}}
                  whileTap={selectedSlot ? { scale: 0.985 } : {}}>
                  {confirming ? (
                    <><motion.div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />Booking your slot…</>
                  ) : (
                    <><CalendarCheck className="w-4 h-4" strokeWidth={2} />
                      {selectedSlot ? `Book Token for ${selectedSlot}` : "Select a slot to book"}</>
                  )}
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-16" />
    </div>
  );
}
