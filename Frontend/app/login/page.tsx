"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, Activity } from "lucide-react";
import { BackgroundCanvas } from "@/components/ui/FloatingOrb";
import { useUser } from "@/lib/userContext";

export default function LoginPage() {
  const { setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    const trimmed = name.trim();
    const initials = trimmed.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    setUser({ name: trimmed, email, initials });
    setIsLoading(false);
    setIsSuccess(true);
    await new Promise((r) => setTimeout(r, 1000));
    window.location.href = "/dashboard";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundCanvas />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(232,196,160,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 70%, rgba(168,184,154,0.20) 0%, transparent 60%)" }}
      />

      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex items-center justify-between gap-16">
        {/* Left brand panel */}
        <motion.div className="hidden lg:flex flex-col flex-1 max-w-sm"
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #8B7355, #A68B6A)" }}>
              <Activity className="w-5 h-5 text-white" strokeWidth={1.8} />
            </div>
            <span className="font-display text-2xl font-semibold" style={{ color: "var(--color-charcoal)" }}>Medisphere</span>
          </div>
          <h1 className="font-display text-5xl font-light leading-[1.15] mb-6" style={{ color: "var(--color-charcoal)" }}>
            Your wellness,<br /><span style={{ color: "var(--color-warm-brown)" }}>elevated.</span>
          </h1>
          <p className="text-base leading-relaxed mb-12" style={{ color: "var(--color-warm-gray)" }}>
            A premium AI-powered healthcare companion that understands your body and guides you toward your healthiest self.
          </p>
          <div className="flex flex-col gap-4">
            {["AI medicine scanning & recognition", "Smart pill reminders & tracking", "Secure medical records vault"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <span style={{ color: "var(--color-warm-brown-light)" }}>✦</span>
                <span className="text-sm" style={{ color: "var(--color-charcoal-soft)" }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Login card */}
        <motion.div className="w-full max-w-md mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}>
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow" style={{ background: "linear-gradient(135deg, #8B7355, #A68B6A)" }}>
              <Activity className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <span className="font-display text-xl font-semibold" style={{ color: "var(--color-charcoal)" }}>Medisphere</span>
          </div>

          <div className="rounded-4xl p-8 lg:p-10" style={{
            background: "rgba(255,255,255,0.55)", backdropFilter: "blur(32px) saturate(180%)", WebkitBackdropFilter: "blur(32px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.80)", boxShadow: "0 24px 64px rgba(139,115,85,0.16), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}>
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div key="success" className="flex flex-col items-center justify-center py-12 gap-4"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(168,184,154,0.25)" }}>
                    <CheckCircle className="w-8 h-8" style={{ color: "var(--color-sage-dark)" }} strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-2xl" style={{ color: "var(--color-charcoal)" }}>Welcome, {name.split(" ")[0]}</p>
                  <p className="text-sm text-center" style={{ color: "var(--color-warm-gray)" }}>Redirecting to your dashboard…</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-7">
                    <h2 className="font-display text-3xl font-light mb-2" style={{ color: "var(--color-charcoal)" }}>Welcome back</h2>
                    <p className="text-sm" style={{ color: "var(--color-warm-gray)" }}>Sign in to your Medisphere account</p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Name */}
                    <div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.6} />
                        <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="input-luxury !pl-12"
                          style={errors.name ? { borderColor: "rgba(212,149,106,0.6)" } : {}} />
                      </div>
                      {errors.name && <p className="text-xs mt-1.5 ml-1" style={{ color: "var(--color-deep-peach)" }}>{errors.name}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.6} />
                        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-luxury !pl-12"
                          style={errors.email ? { borderColor: "rgba(212,149,106,0.6)" } : {}} />
                      </div>
                      {errors.email && <p className="text-xs mt-1.5 ml-1" style={{ color: "var(--color-deep-peach)" }}>{errors.email}</p>}
                    </div>
                    {/* Password */}
                    <div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.6} />
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-luxury !pl-12 !pr-12"
                          style={errors.password ? { borderColor: "rgba(212,149,106,0.6)" } : {}} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70" style={{ color: "var(--color-warm-gray-light)" }}>
                          {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.6} /> : <Eye className="w-4 h-4" strokeWidth={1.6} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs mt-1.5 ml-1" style={{ color: "var(--color-deep-peach)" }}>{errors.password}</p>}
                    </div>

                    <div className="flex justify-end">
                      <Link href="/forgot-password" className="text-xs hover:opacity-70 transition-opacity" style={{ color: "var(--color-warm-brown)" }}>Forgot password?</Link>
                    </div>

                    <motion.button type="submit" disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-medium text-white mt-1 transition-all duration-300"
                      style={{ background: isLoading ? "rgba(139,115,85,0.65)" : "linear-gradient(135deg, #8B7355 0%, #A68B6A 100%)", boxShadow: isLoading ? "none" : "0 8px 24px rgba(139,115,85,0.30)" }}
                      whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                      {isLoading ? (
                        <><motion.div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />Signing in…</>
                      ) : (<>Sign in<ArrowRight className="w-4 h-4" strokeWidth={2} /></>)}
                    </motion.button>
                  </form>

                  <p className="text-center text-xs mt-6" style={{ color: "var(--color-warm-gray)" }}>
                    New to Medisphere?{" "}
                    <Link href="/signup" className="font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--color-warm-brown)" }}>Create an account</Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-center text-xs mt-6" style={{ color: "var(--color-warm-gray-light)" }}>
            By signing in you agree to our <span className="underline cursor-pointer">Terms</span> & <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
