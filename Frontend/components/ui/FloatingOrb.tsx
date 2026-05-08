"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingOrbProps {
  className?: string;
  color?: string;
  size?: string;
  duration?: number;
  delay?: number;
  blur?: string;
  opacity?: number;
}

export function FloatingOrb({
  className,
  color = "rgba(232, 196, 160, 0.35)",
  size = "600px",
  duration = 20,
  delay = 0,
  blur = "80px",
  opacity = 1,
}: FloatingOrbProps) {
  return (
    <motion.div
      className={cn("absolute rounded-full pointer-events-none", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur})`,
        opacity,
        willChange: "transform",
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-15, 15, -15],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% -10%, rgba(245, 240, 232, 1) 0%, rgba(250, 247, 242, 0.95) 60%, transparent 100%),
            linear-gradient(160deg, #FAF7F2 0%, #F5F0E8 40%, #EDE7DA 100%)
          `,
        }}
      />

      {/* Warm peach orb — top right */}
      <FloatingOrb
        color="rgba(232, 196, 160, 0.40)"
        size="700px"
        duration={25}
        delay={0}
        blur="90px"
        className="top-[-15%] right-[-10%]"
      />

      {/* Sage orb — bottom left */}
      <FloatingOrb
        color="rgba(168, 184, 154, 0.30)"
        size="600px"
        duration={30}
        delay={5}
        blur="80px"
        className="bottom-[-10%] left-[-5%]"
      />

      {/* Soft blush orb — center */}
      <FloatingOrb
        color="rgba(232, 196, 196, 0.22)"
        size="500px"
        duration={20}
        delay={10}
        blur="70px"
        className="top-[40%] left-[30%]"
      />

      {/* Warm gold accent — top left */}
      <FloatingOrb
        color="rgba(201, 168, 76, 0.12)"
        size="400px"
        duration={35}
        delay={8}
        blur="60px"
        className="top-[5%] left-[5%]"
      />

      {/* Horizon line */}
      <div
        className="absolute w-full"
        style={{
          bottom: "30%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(139, 115, 85, 0.08), transparent)",
        }}
      />
    </div>
  );
}
