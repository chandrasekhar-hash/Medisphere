"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, Plus, X, CheckCircle, Clock, Edit3, Trash2, Bell, Volume2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface Reminder {
  id: string;
  medicine: string;
  dose: string;
  times?: string[];
  frequency: "daily" | "twice" | "thrice" | "four" | "weekly";
  notes: string;
  active: boolean;
  takenToday: boolean;
}

const FREQ_LABELS: Record<string, string> = { 
  daily: "Once daily", 
  twice: "Twice daily", 
  thrice: "Three times daily", 
  four: "Four times daily", 
  weekly: "Once weekly" 
};

function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.28;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t); osc.stop(t + 0.6);
    });
  } catch {}
}

async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function triggerReminder(reminder: Reminder) {
  playChime();
  if (Notification.permission === "granted") {
    new Notification("💊 Pill Reminder — Medisphere", {
      body: `Time to take ${reminder.medicine} ${reminder.dose}\n${reminder.notes || ""}`,
      icon: "/favicon.ico",
      tag: reminder.id,
    });
  }
}

function calcMsUntil(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

export default function PillReminderPage() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("mds_reminders");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "default";
    return Notification.permission;
  });
  const [activeAlert, setActiveAlert] = useState<Reminder | null>(null);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Form state
  const [form, setForm] = useState({ 
    medicine: "", 
    dose: "", 
    times: ["08:00"], 
    frequency: "daily" as Reminder["frequency"], 
    notes: "" 
  });

  const getSuggestedTimes = (freq: Reminder["frequency"]): string[] => {
    switch (freq) {
      case "daily": return ["08:00"];
      case "twice": return ["08:00", "20:00"];
      case "thrice": return ["08:00", "14:00", "20:00"];
      case "four": return ["08:00", "12:00", "16:00", "20:00"];
      case "weekly": return ["08:00"];
      default: return ["08:00"];
    }
  };

  const save = (updated: Reminder[]) => {
    setReminders(updated);
    try { localStorage.setItem("mds_reminders", JSON.stringify(updated)); } catch {}
  };

  // ── Schedule timers ─────────────────────────────────
  const scheduleAll = useCallback((list: Reminder[]) => {
    // Clear old timers
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
    
    list.filter((r) => r.active).forEach((r) => {
      (r.times || []).forEach((timeStr, idx) => {
        const ms = calcMsUntil(timeStr);
        const timerId = `${r.id}-${idx}`;
        const t = setTimeout(() => {
          triggerReminder(r);
          setActiveAlert(r);
          setTimeout(() => setActiveAlert(null), 8000);
        }, ms);
        timersRef.current.set(timerId, t);
      });
    });
  }, []);

  useEffect(() => {
    scheduleAll(reminders);
    const currentTimers = timersRef.current;
    return () => { currentTimers.forEach((t) => clearTimeout(t)); };
  }, [reminders, scheduleAll]);

  // ── CRUD ────────────────────────────────────────────
  const openAdd = () => { 
    setForm({ medicine: "", dose: "", times: ["08:00"], frequency: "daily", notes: "" }); 
    setEditingId(null); 
    setShowModal(true); 
  };
  
  const openEdit = (r: Reminder) => { 
    setForm({ 
      medicine: r.medicine, 
      dose: r.dose, 
      times: r.times || [(r as any).time || "08:00"], 
      frequency: r.frequency, 
      notes: r.notes 
    }); 
    setEditingId(r.id); 
    setShowModal(true); 
  };

  const saveReminder = async () => {
    if (!form.medicine.trim()) return;
    const granted = await requestNotificationPermission();
    if (granted) setNotifPermission("granted");
    
    const updated = editingId
      ? reminders.map((r) => r.id === editingId ? { ...r, ...form } : r)
      : [...reminders, { ...form, id: Date.now().toString(), active: true, takenToday: false }];
    
    save(updated);
    setShowModal(false);
  };

  const deleteReminder = (id: string) => save(reminders.filter((r) => r.id !== id));
  const toggleActive = (id: string) => save(reminders.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  const markTaken = (id: string) => save(reminders.map((r) => r.id === id ? { ...r, takenToday: !r.takenToday } : r));

  const totalDoses = reminders.filter((r) => r.active).length;
  const takenCount = reminders.filter((r) => r.takenToday).length;
  const adherence = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 0;

  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      {/* Active Alert Banner */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div className="fixed top-5 right-5 z-50 max-w-sm rounded-2xl p-5 shadow-xl"
            style={{ background: "rgba(250,247,242,0.97)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(212,149,106,0.35)", boxShadow: "0 16px 48px rgba(139,115,85,0.25)" }}
            initial={{ opacity: 0, x: 60, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,149,106,0.15)" }}>
                <BellRing className="w-5 h-5" style={{ color: "#D4956A" }} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-charcoal)" }}>💊 Pill Reminder</p>
                <p className="text-[13px]" style={{ color: "var(--color-charcoal-soft)" }}>
                  Time to take <strong>{activeAlert.medicine}</strong> {activeAlert.dose}
                </p>
              </div>
              <button onClick={() => setActiveAlert(null)} className="p-1 rounded-lg hover:bg-black/5">
                <X className="w-3.5 h-3.5" style={{ color: "var(--color-warm-gray)" }} strokeWidth={2} />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { markTaken(activeAlert.id); setActiveAlert(null); }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: "#7A9470" }}>
                Mark as Taken
              </button>
              <button onClick={() => setActiveAlert(null)} className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ background: "rgba(139,115,85,0.10)", color: "var(--color-warm-gray)" }}>
                Snooze 10m
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(232,196,196,0.25)" }}>
                <BellRing className="w-5 h-5" style={{ color: "#C47A7A" }} strokeWidth={1.7} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>Daily Schedule</span>
            </div>
            <h1 className="font-display text-5xl font-light mb-2" style={{ color: "var(--color-charcoal)" }}>Pill Reminder</h1>
            <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Smart alerts that keep your wellness on track.</p>
          </div>
          <motion.button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white flex-shrink-0 mt-2"
            style={{ background: "linear-gradient(135deg, #C47A7A, #D4956A)", boxShadow: "0 6px 20px rgba(196,122,122,0.25)" }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Plus className="w-4 h-4" strokeWidth={2} /> Add Reminder
          </motion.button>
        </div>
      </motion.div>

      {/* Notification Permission Notice */}
      {notifPermission !== "granted" && (
        <motion.div className="mb-6 px-5 py-4 rounded-2xl flex items-center gap-3"
          style={{ background: "rgba(232,196,160,0.18)", border: "1px solid rgba(212,149,106,0.20)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Bell className="w-4 h-4 flex-shrink-0" style={{ color: "#D4956A" }} strokeWidth={1.8} />
          <p className="text-sm flex-1" style={{ color: "var(--color-charcoal-soft)" }}>
            Enable browser notifications to receive pill alerts even when you&apos;re on another tab.
          </p>
          <button onClick={() => requestNotificationPermission().then((g) => g && setNotifPermission("granted"))}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl flex-shrink-0"
            style={{ background: "#D4956A", color: "white" }}>Enable</button>
        </motion.div>
      )}

      {/* Adherence Card */}
      {reminders.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 mb-8 flex items-center gap-6" hoverable={false}
            style={{ background: "linear-gradient(135deg, rgba(232,196,196,0.22) 0%, rgba(250,247,242,0.80) 100%)" }}>
            <div className="relative flex-shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(196,122,122,0.12)" strokeWidth="7" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="url(#pillG)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32 * adherence / 100} ${2 * Math.PI * 32 * (1 - adherence / 100)}`} />
                <defs><linearGradient id="pillG" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C47A7A" /><stop offset="100%" stopColor="#D4956A" />
                </linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-xl font-semibold" style={{ color: "var(--color-charcoal)" }}>{adherence}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-charcoal)" }}>Today&apos;s Adherence</p>
              <p className="text-[13px] mb-3" style={{ color: "var(--color-warm-gray)" }}>{takenCount} of {totalDoses} doses taken</p>
              <div className="h-1.5 w-40 rounded-full overflow-hidden" style={{ background: "rgba(139,115,85,0.10)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #C47A7A, #D4956A)" }}
                  initial={{ width: 0 }} animate={{ width: `${adherence}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }} />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GlassCard className="p-10 flex flex-col items-center text-center" hoverable={false}>
            <BellRing className="w-10 h-10 mb-4" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.2} />
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-charcoal)" }}>No reminders yet</p>
            <p className="text-xs mb-5" style={{ color: "var(--color-warm-gray)" }}>Add your first medication reminder to get started</p>
            <motion.button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #C47A7A, #D4956A)", boxShadow: "0 6px 20px rgba(196,122,122,0.22)" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Plus className="w-4 h-4" strokeWidth={2} /> Add First Reminder
            </motion.button>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {reminders.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: i * 0.07 }}>
              <GlassCard className="p-5 flex items-center gap-4" style={{ opacity: r.active ? 1 : 0.55 }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: r.takenToday ? "rgba(122,148,112,0.18)" : "rgba(232,196,196,0.22)" }}>
                  <BellRing className="w-4 h-4" style={{ color: r.takenToday ? "#7A9470" : "#C47A7A" }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-charcoal)", textDecoration: r.takenToday ? "line-through" : "none", opacity: r.takenToday ? 0.6 : 1 }}>{r.medicine}</p>
                    {r.dose && <span className="text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0" style={{ background: "rgba(232,196,196,0.22)", color: "#C47A7A" }}>{r.dose}</span>}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Clock className="w-3 h-3" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
                      {(r.times || []).map((t, idx) => (
                        <span key={idx} className="text-[11px] px-1.5 py-0.5 rounded-md" style={{ background: "rgba(139,115,85,0.06)", color: "var(--color-warm-gray)" }}>{t}</span>
                      ))}
                    </div>
                    <span className="text-xs" style={{ color: "var(--color-warm-gray-light)" }}>·</span>
                    <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{FREQ_LABELS[r.frequency]}</span>
                    {r.active && <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#7A9470" }} /><span className="text-[10px] font-semibold" style={{ color: "#7A9470" }}>Active</span></div>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Mark taken */}
                  <motion.button onClick={() => markTaken(r.id)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{ background: r.takenToday ? "rgba(122,148,112,0.18)" : "rgba(255,255,255,0.55)", border: `1.5px solid ${r.takenToday ? "rgba(122,148,112,0.35)" : "rgba(139,115,85,0.15)"}` }}>
                    <CheckCircle className="w-4 h-4" style={{ color: r.takenToday ? "#7A9470" : "var(--color-warm-gray-light)" }} strokeWidth={1.8} />
                  </motion.button>
                  {/* Toggle */}
                  <motion.button onClick={() => toggleActive(r.id)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(139,115,85,0.15)" }}>
                    <Volume2 className="w-3.5 h-3.5" style={{ color: r.active ? "var(--color-warm-brown)" : "var(--color-warm-gray-light)" }} strokeWidth={1.8} />
                  </motion.button>
                  {/* Edit */}
                  <motion.button onClick={() => openEdit(r)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(139,115,85,0.15)" }}>
                    <Edit3 className="w-3.5 h-3.5" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
                  </motion.button>
                  {/* Delete */}
                  <motion.button onClick={() => deleteReminder(r.id)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(139,115,85,0.15)" }}>
                    <Trash2 className="w-3.5 h-3.5" style={{ color: "#C44B4B" }} strokeWidth={1.8} />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4"
            style={{ background: "rgba(44,36,22,0.35)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}>
            <motion.div className="w-full max-w-md rounded-4xl p-7 max-h-[90vh] overflow-y-auto"
              style={{ background: "rgba(250,247,242,0.97)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "0 32px 80px rgba(139,115,85,0.25)" }}
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl font-medium" style={{ color: "var(--color-charcoal)" }}>{editingId ? "Edit Reminder" : "Add Reminder"}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl hover:bg-black/5"><X className="w-4 h-4" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} /></button>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-warm-gray)" }}>Medicine Name</label>
                  <input type="text" value={form.medicine}
                    onChange={(e) => setForm((prev) => ({ ...prev, medicine: e.target.value }))}
                    placeholder="e.g. Amlodipine" className="input-luxury" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-warm-gray)" }}>Dose</label>
                    <input type="text" value={form.dose}
                      onChange={(e) => setForm((prev) => ({ ...prev, dose: e.target.value }))}
                      placeholder="e.g. 5mg" className="input-luxury" />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-warm-gray)" }}>Frequency</label>
                    <select 
                      value={form.frequency}
                      onChange={(e) => {
                        const freq = e.target.value as Reminder["frequency"];
                        setForm((prev) => ({ ...prev, frequency: freq, times: getSuggestedTimes(freq) }));
                      }}
                      className="input-luxury appearance-none"
                    >
                      {Object.entries(FREQ_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10.5px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--color-warm-gray)" }}>Reminder Timings</label>
                  <div className="grid grid-cols-2 gap-3">
                    <AnimatePresence mode="popLayout">
                      {form.times.map((t, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--color-warm-gray-light)" }} />
                            <input type="time" value={t}
                              onChange={(e) => {
                                const newTimes = [...form.times];
                                newTimes[i] = e.target.value;
                                setForm((prev) => ({ ...prev, times: newTimes }));
                              }}
                              className="input-luxury pl-9 py-2 text-sm" />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--color-warm-gray)" }}>Notes (optional)</label>
                  <input type="text" value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g. Take with food" className="input-luxury" />
                </div>

                <motion.button onClick={saveReminder} disabled={!form.medicine.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white mt-2"
                  style={{ background: form.medicine.trim() ? "linear-gradient(135deg, #C47A7A, #D4956A)" : "rgba(196,122,122,0.40)", boxShadow: form.medicine.trim() ? "0 8px 24px rgba(196,122,122,0.25)" : "none" }}
                  whileHover={form.medicine.trim() ? { scale: 1.015 } : {}} whileTap={form.medicine.trim() ? { scale: 0.985 } : {}}>
                  <BellRing className="w-4 h-4" strokeWidth={2} />
                  {editingId ? "Save Changes" : "Set Reminder"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-16" />
    </div>
  );
}
