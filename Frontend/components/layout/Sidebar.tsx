"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ScanLine, Users, PillBottle, BellRing, FolderHeart,
  HeartPulse, Settings, LogOut, Activity, User,
} from "lucide-react";
import { useUser } from "@/lib/userContext";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Activity },
  { href: "/dashboard/medicine-scanner", label: "Camera Scanner", icon: ScanLine },
  { href: "/dashboard/doctor-queue", label: "Doctor Queue", icon: Users },
  { href: "/dashboard/medicine-finder", label: "Generic Finder", icon: PillBottle },
  { href: "/dashboard/pill-reminder", label: "Pill Reminder", icon: BellRing },
  { href: "/dashboard/records-vault", label: "Records Vault", icon: FolderHeart },
  { href: "/dashboard/health-profile", label: "Health Insights", icon: HeartPulse },
];

const bottomItems = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useUser();

  return (
    <motion.aside className="h-full flex flex-col py-8 px-5"
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #8B7355, #A68B6A)" }}>
          <Activity className="w-[18px] h-[18px] text-white" strokeWidth={1.8} />
        </div>
        <span className="font-display text-xl font-semibold tracking-tight" style={{ color: "var(--color-charcoal)" }}>Medisphere</span>
      </Link>

      <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: "var(--color-warm-gray)" }}>Features</p>

      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 relative"
                style={{ background: isActive ? "rgba(139,115,85,0.10)" : "transparent", color: isActive ? "var(--color-warm-brown)" : "var(--color-charcoal-soft)" }}
                whileHover={{ background: "rgba(139,115,85,0.07)", x: 2, transition: { duration: 0.15 } }}>
                {isActive && (
                  <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                    style={{ background: "var(--color-warm-brown)" }} transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2 : 1.6} />
                <span className="text-[13px] truncate" style={{ fontWeight: isActive ? 600 : 450 }}>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-0.5 mt-4 mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: "var(--color-warm-gray)" }}>Account</p>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200"
                style={{ background: isActive ? "rgba(139,115,85,0.10)" : "transparent", color: isActive ? "var(--color-warm-brown)" : "var(--color-charcoal-soft)" }}
                whileHover={{ background: "rgba(139,115,85,0.07)", x: 2, transition: { duration: 0.15 } }}>
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.6} />
                <span className="text-[13px]" style={{ fontWeight: isActive ? 600 : 450 }}>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Dynamic User Card */}
      <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.70)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #8B7355, #D4956A)" }}>
          {user?.initials ?? "??"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold truncate" style={{ color: "var(--color-charcoal)" }}>{user?.name ?? "Guest"}</p>
          <p className="text-[11px] truncate" style={{ color: "var(--color-warm-gray)" }}>{user?.email ?? "Welcome"}</p>
        </div>
        <button onClick={logout} className="p-1.5 rounded-lg transition-colors hover:bg-black/5" style={{ color: "var(--color-warm-gray)" }} title="Sign out">
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.6} />
        </button>
      </div>
    </motion.aside>
  );
}
