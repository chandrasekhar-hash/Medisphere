"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Droplets,
  ShieldCheck,
  Edit3,
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUser, MedisphereUser } from "@/lib/userContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

import Image from "next/image";

interface InfoFieldProps {
  label: string;
  value: string;
  icon: React.ElementType;
  editable?: boolean;
  onSave?: (newValue: string) => void;
  type?: string;
}

function InfoField({ label, value, icon: Icon, editable = false, onSave, type = "text" }: InfoFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);

  // Mirror prop to state if not editing (React 19 pattern)
  if (!isEditing && fieldValue !== value) {
    setFieldValue(value);
  }

  const handleSave = () => {
    if (onSave) onSave(fieldValue);
    setIsEditing(false);
  };

  return (
    <div
      className="flex items-start gap-3 py-4 border-b last:border-b-0"
      style={{ borderColor: "rgba(139, 115, 85, 0.08)" }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(139, 115, 85, 0.08)" }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: "var(--color-warm-brown)" }} strokeWidth={1.7} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--color-warm-gray)" }}>
          {label}
        </p>
        {isEditing ? (
          <input
            type={type}
            className="input-luxury py-2 text-sm w-full"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <p className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>
            {fieldValue || "Not set"}
          </p>
        )}
      </div>
      {editable && (
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="p-1.5 rounded-lg transition-all hover:bg-black/5 flex-shrink-0"
          style={{ color: isEditing ? "var(--color-sage-dark)" : "var(--color-warm-gray-light)" }}
        >
          {isEditing ? (
            <CheckCircle className="w-4 h-4" strokeWidth={1.8} />
          ) : (
            <Edit3 className="w-4 h-4" strokeWidth={1.8} />
          )}
        </button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = (key: keyof MedisphereUser, val: string) => {
    if (!user) return;
    const newUser = { ...user, [key]: val };
    
    // Auto-update initials if name changes
    if (key === "name") {
      newUser.initials = val.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    
    setUser(newUser);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    const url = prompt("Enter Image URL for profile photo:");
    if (url) updateField("avatarUrl", url);
  };

  if (!user) return null;

  return (
    <div className="px-8 xl:px-12 py-10 max-w-4xl relative">
      
      {/* Success Toast */}
      <motion.div 
        className="fixed top-8 right-8 z-50 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: showSuccess ? 1 : 0, x: showSuccess ? 0 : 20 }}
      >
        <div className="bg-white/90 backdrop-blur-md border border-sage-light px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-sage flex items-center justify-center">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-charcoal">Profile updated successfully</span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-warm-gray)" }}>
          Your Account
        </p>
        <h1 className="font-display text-4xl xl:text-5xl font-light" style={{ color: "var(--color-charcoal)" }}>
          Patient Profile
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column — Avatar Card */}
        <div className="flex flex-col gap-5">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <GlassCard className="p-7 flex flex-col items-center text-center" hoverable={false}>
              {/* Avatar */}
              <div className="relative mb-5 group">
                {user.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl} 
                    alt={user.name}
                    width={96}
                    height={96}
                    unoptimized
                    className="w-24 h-24 rounded-3xl object-cover shadow-lg border-2 border-white/50"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-3xl font-display font-medium shadow-lg"
                    style={{ background: "linear-gradient(135deg, #8B7355 0%, #D4956A 100%)" }}
                  >
                    {user.initials}
                  </div>
                )}
                <div
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: "var(--color-cream)", border: "2px solid rgba(255,255,255,0.8)" }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--color-sage-dark)" }} strokeWidth={2} />
                </div>
              </div>
              <h2 className="font-display text-2xl font-medium mb-1 truncate w-full" style={{ color: "var(--color-charcoal)" }}>
                {user.name}
              </h2>
              <p className="text-sm mb-1" style={{ color: "var(--color-warm-gray)" }}>
                Patient ID: MS-{user.name.length}04821
              </p>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-2"
                style={{ background: "rgba(168,184,154,0.25)", color: "var(--color-sage-dark)" }}
              >
                <CheckCircle className="w-3 h-3" strokeWidth={2.5} />
                Verified Account
              </div>
              <button
                onClick={handleAvatarChange}
                className="w-full mt-6 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 hover:shadow-md hover:bg-black/5"
                style={{
                  background: "rgba(139,115,85,0.09)",
                  color: "var(--color-warm-brown)",
                  border: "1px solid rgba(139,115,85,0.15)",
                }}
              >
                Change Photo
              </button>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column — Info Cards */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Personal Information */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <GlassCard className="p-6" hoverable={false}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-xl font-medium" style={{ color: "var(--color-charcoal)" }}>
                  Personal Information
                </h3>
                <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>Fully Dynamic</span>
              </div>
              <p className="text-xs mb-5" style={{ color: "var(--color-warm-gray)" }}>
                Update your details to keep your medical records accurate
              </p>
              <InfoField label="Full Name" value={user.name} icon={User} editable onSave={(v) => updateField("name", v)} />
              <InfoField label="Email Address" value={user.email} icon={Mail} editable onSave={(v) => updateField("email", v)} type="email" />
              <InfoField label="Phone Number" value={user.phone || "+91 00000 00000"} icon={Phone} editable onSave={(v) => updateField("phone", v)} />
              <InfoField label="Location" value={user.location || "City, State, Country"} icon={MapPin} editable onSave={(v) => updateField("location", v)} />
              <InfoField label="Date of Birth" value={user.dob || "Select Date"} icon={CalendarDays} editable onSave={(v) => updateField("dob", v)} />
              <InfoField label="Blood Group" value={user.bloodGroup || "A+"} icon={Droplets} editable onSave={(v) => updateField("bloodGroup", v)} />
            </GlassCard>
          </motion.div>

          {/* Medical History */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <GlassCard className="p-6" hoverable={false}>
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-4 h-4" style={{ color: "var(--color-warm-brown)" }} strokeWidth={1.8} />
                <h3 className="font-display text-xl font-medium" style={{ color: "var(--color-charcoal)" }}>
                  Medical Records Summary
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { condition: "General Health", since: "2024", status: "Healthy", statusColor: "var(--color-sage-dark)" },
                  { condition: "Immunity Status", since: "2024", status: "Optimal", statusColor: "var(--color-warm-brown-light)" },
                ].map((item) => (
                  <div
                    key={item.condition}
                    className="rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.65)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-[13px] font-medium leading-snug" style={{ color: "var(--color-charcoal)" }}>
                        {item.condition}
                      </p>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${item.statusColor}18`, color: item.statusColor }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: "var(--color-warm-gray)" }}>
                      <Clock className="w-3 h-3" strokeWidth={1.8} />
                      <span className="text-[11px]">Since {item.since}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Allergies & Alerts */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
            <GlassCard className="p-6" hoverable={false}>
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-4 h-4" style={{ color: "#C9A84C" }} strokeWidth={1.8} />
                <h3 className="font-display text-xl font-medium" style={{ color: "var(--color-charcoal)" }}>
                  Allergies & Alerts
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["No known allergies recorded"].map((allergy) => (
                  <div
                    key={allergy}
                    className="px-3 py-1.5 rounded-xl text-[12px] font-medium"
                    style={{
                      background: "rgba(201,168,76,0.12)",
                      color: "#A68B30",
                      border: "1px solid rgba(201,168,76,0.20)",
                    }}
                  >
                    {allergy}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
