"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "strong" | "subtle";
  hoverable?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = "default",
  hoverable = true,
  ...props
}: GlassCardProps) {
  const variantClass = {
    default: "glass-card",
    strong: "glass-card-strong",
    subtle: "bg-white/25 backdrop-blur-md border border-white/40",
  }[variant];

  return (
    <motion.div
      className={cn(
        variantClass,
        "rounded-3xl",
        hoverable && "cursor-pointer",
        className
      )}
      whileHover={
        hoverable
          ? {
              scale: 1.015,
              y: -4,
              boxShadow: "0 20px 60px 0 rgba(139, 115, 85, 0.22)",
              transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
