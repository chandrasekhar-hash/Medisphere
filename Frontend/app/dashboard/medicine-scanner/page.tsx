"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, Camera, Upload, X, RotateCcw, AlertCircle, CheckCircle, ShieldCheck, ShieldAlert, ShieldX, Image as ImageIcon, Activity } from "lucide-react";
import { searchFood, searchMedicine, getAllItems, FoodItem, MedicineItem } from "@/lib/localScanner";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search } from "lucide-react";

type Safety = "safe" | "warning" | "unsafe";
type NutriLevel = "low" | "moderate" | "high";

interface NutritionValue {
  value: number;
  unit: string;
  level: NutriLevel;
  percentage: number;
}

interface NutritionInfo {
  healthScore: number;
  calories: { value: number; unit: string };
  macros: {
    protein: NutritionValue;
    carbs: NutritionValue;
    fats: NutritionValue;
  };
  micros: {
    sugars: NutritionValue;
    sodium: NutritionValue;
    fiber: NutritionValue;
    satFat: NutritionValue;
  };
  insights: { title: string; text: string; type: "positive" | "warning" | "neutral" }[];
}

interface ScanResult {
  name: string;
  brand: string;
  safety: Safety;
  ingredients: string[];
  allergyAlerts: string[];
  conditionConflicts: string[];
  precautions: string[];
  alternatives: string[];
  nutrition?: NutritionInfo;
}

// Mock results removed

const SAFETY_CONFIG: Record<Safety, { label: string; color: string; bg: string; border: string; icon: typeof ShieldCheck }> = {
  safe:    { label: "Safe",    color: "#5A8C6E", bg: "rgba(122,148,112,0.12)", border: "rgba(122,148,112,0.25)", icon: ShieldCheck },
  warning: { label: "Caution", color: "#A68B30", bg: "rgba(201,168,76,0.12)",  border: "rgba(201,168,76,0.28)",  icon: ShieldAlert },
  unsafe:  { label: "Unsafe",  color: "#B84A4A", bg: "rgba(196,75,75,0.09)",   border: "rgba(196,75,75,0.20)",  icon: ShieldX },
};

type Mode = "idle" | "camera" | "preview" | "scanning" | "result";

export default function MedicineScannerPage() {
  const [mode, setMode] = useState<Mode>("idle");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [manualLabel, setManualLabel] = useState("");
  const [showDemoInput, setShowDemoInput] = useState(false);
  const [suggestions, setSuggestions] = useState<(FoodItem | MedicineItem)[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allItems = getAllItems();

  const loadingSteps = [
    "Analyzing image…",
    "Detecting food composition…",
    "Estimating nutrition…",
    "Generating health insights…"
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── File upload ──────────────────────────────────────
  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        setPreviewImage(canvas.toDataURL("image/jpeg", 0.8));
        setMode("preview");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, []);

  // ── Camera ──────────────────────────────────────────
  const openCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setMode("camera");
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      setCameraError("Camera not available. Please upload an image instead.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setPreviewImage(dataUrl);
    setMode("preview");
    stopCamera();
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const cancelCamera = () => {
    stopCamera();
    setMode("idle");
  };

  // ── Scan ─────────────────────────────────────────────
  const startScan = async (overrideLabel?: string) => {
    const labelToSearch = overrideLabel || manualLabel;
    
    setMode("scanning");
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 800);

    // Simulate local processing delay for cinematic feel
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const query = labelToSearch?.trim() || "";
      if (!query) {
        setCameraError("Please provide a name or upload an image.");
        setMode("idle");
        clearInterval(interval);
        return;
      }

      const food = searchFood(query);
      const med = searchMedicine(query);

      if (food) {
        const mappedResult: ScanResult = {
          name: food.name,
          brand: food.category + " Food",
          safety: food.healthy ? "safe" : "warning",
          ingredients: food.benefits,
          allergyAlerts: food.risks,
          conditionConflicts: food.avoidFor,
          precautions: food.bestFor.map(b => `Recommended for ${b}`),
          alternatives: [],
          nutrition: {
            healthScore: Number(food.healthScore),
            calories: { value: Number(food.calories), unit: "kcal" },
            macros: {
              protein: { value: Number(food.protein), unit: "g", level: Number(food.protein) > 10 ? "high" : "moderate", percentage: Math.min(Number(food.protein) * 5, 100) },
              carbs: { value: Number(food.carbohydrates), unit: "g", level: Number(food.carbohydrates) > 40 ? "high" : "moderate", percentage: Math.min(Number(food.carbohydrates) * 1.5, 100) },
              fats: { value: Number(food.fats), unit: "g", level: Number(food.fats) > 15 ? "high" : "moderate", percentage: Math.min(Number(food.fats) * 4, 100) },
            },
            micros: {
              sugars: { value: Number(food.sugar), unit: "g", level: Number(food.sugar) > 10 ? "high" : "low", percentage: Math.min(Number(food.sugar) * 5, 100) },
              sodium: { value: Number(food.sodium), unit: "mg", level: Number(food.sodium) > 500 ? "high" : "low", percentage: Math.min(Number(food.sodium) / 10, 100) },
              fiber: { value: Number(food.fiber), unit: "g", level: Number(food.fiber) > 5 ? "high" : "low", percentage: Math.min(Number(food.fiber) * 10, 100) },
              satFat: { value: 0, unit: "g", level: "low", percentage: 0 },
            },
            insights: food.healthy 
              ? [{ title: "Healthy Choice", text: food.benefits[0] || "Nutritious option", type: "positive" }]
              : [{ title: "Caution", text: food.risks[0] || "Consume in moderation", type: "warning" }]
          }
        };
        setScanResult(mappedResult);
        setMode("result");
      } else if (med) {
        const mappedResult: ScanResult = {
          name: med.name,
          brand: med.category,
          safety: med.prescriptionRequired ? "warning" : "safe",
          ingredients: med.uses,
          allergyAlerts: med.sideEffects,
          conditionConflicts: [],
          precautions: med.safetyPrecautions,
          alternatives: [med.dosage],
        };
        setScanResult(mappedResult);
        setMode("result");
      } else {
        setCameraError("Data not available in Medisphere database");
        setMode("idle");
      }
    } catch {
      setCameraError("An error occurred during scanning. Please try again.");
      setMode("idle");
    } finally {
      clearInterval(interval);
    }
  };

  const handleSuggestionClick = (item: FoodItem | MedicineItem) => {
    setManualLabel(item.name);
    setSuggestions([]);
    setShowSuggestions(false);
    startScan(item.name);
  };

  const reset = () => {
    stopCamera();
    setPreviewImage(null);
    setScanResult(null);
    setMode("idle");
    setCameraError("");
  };

  return (
    <div className="px-8 xl:px-12 py-10 max-w-3xl">
      {/* Header */}
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(232,196,160,0.35)" }}>
            <ScanLine className="w-5 h-5" style={{ color: "#D4956A" }} strokeWidth={1.7} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>Wellness Safety</span>
        </div>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Camera Scanner</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Scan food labels and medicine strips to check if they&apos;re safe for your health conditions.</p>
      </motion.div>

      {/* Main Scanner Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}>
        <GlassCard className="p-6 mb-6" hoverable={false}
          style={{ background: "linear-gradient(135deg, rgba(232,196,160,0.22) 0%, rgba(250,247,242,0.80) 100%)" }}>

          {/* ── IDLE state ── */}
          {(mode === "idle") && (
            <motion.div
              className="rounded-2xl flex flex-col items-center justify-center text-center p-10 cursor-pointer transition-all duration-200"
              style={{ background: isDragging ? "rgba(139,115,85,0.08)" : "rgba(255,255,255,0.45)", border: `1.5px dashed ${isDragging ? "rgba(212,149,106,0.55)" : "rgba(212,149,106,0.30)"}`, minHeight: 240 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <motion.div animate={{ scale: isDragging ? 1.08 : 1 }} transition={{ duration: 0.2 }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(212,149,106,0.12)" }}>
                  <ImageIcon className="w-7 h-7" style={{ color: "#D4956A" }} strokeWidth={1.4} />
                </div>
                <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--color-charcoal)" }}>
                  {isDragging ? "Drop image here" : "Upload or capture a food label or medicine strip"}
                </p>
                <p className="text-xs mb-5" style={{ color: "var(--color-warm-gray)" }}>Supports JPG, PNG, HEIC</p>
              </motion.div>
              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <motion.button onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #8B7355, #D4956A)", boxShadow: "0 6px 20px rgba(139,115,85,0.28)" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Upload className="w-4 h-4" strokeWidth={2} /> Upload Image
                </motion.button>
                <motion.button onClick={openCamera}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.65)", color: "var(--color-warm-brown)", border: "1px solid rgba(212,149,106,0.25)" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Camera className="w-4 h-4" strokeWidth={2} /> Camera
                </motion.button>
              </div>
              {cameraError && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 w-full max-w-sm">
                  <div className="rounded-xl p-3 flex items-start gap-3 text-left" style={{ background: "rgba(196,75,75,0.08)", border: "1px solid rgba(196,75,75,0.15)" }}>
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#C44B4B" }} strokeWidth={2} />
                    <div>
                      <p className="text-[11px] font-semibold mb-0.5" style={{ color: cameraError.includes("database") ? "var(--color-warm-brown)" : "#B84A4A" }}>
                        {cameraError.includes("database") ? "Item Not Found" : "Analysis Failed"}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--color-charcoal-soft)" }}>{cameraError}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── CAMERA state ── */}
          {mode === "camera" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
              <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ maxHeight: 320 }}>
                <video ref={videoRef} autoPlay playsInline className="w-full object-cover" style={{ maxHeight: 320 }} />
                {/* Corner brackets */}
                {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
                  <div key={pos} className={`absolute ${pos} w-6 h-6 pointer-events-none`}
                    style={{ borderTop: pos.includes("top") ? "2px solid rgba(212,149,106,0.8)" : "none", borderBottom: pos.includes("bottom") ? "2px solid rgba(212,149,106,0.8)" : "none", borderLeft: pos.includes("left") ? "2px solid rgba(212,149,106,0.8)" : "none", borderRight: pos.includes("right") ? "2px solid rgba(212,149,106,0.8)" : "none" }} />
                ))}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold text-white" style={{ background: "rgba(0,0,0,0.45)" }}>
                  Point camera at food label or medicine strip
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button onClick={capturePhoto}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #8B7355, #D4956A)", boxShadow: "0 6px 20px rgba(139,115,85,0.28)" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Camera className="w-4 h-4" strokeWidth={2} /> Capture Photo
                </motion.button>
                <motion.button onClick={cancelCamera}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.6)", color: "var(--color-warm-gray)", border: "1px solid rgba(139,115,85,0.15)" }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <X className="w-4 h-4" strokeWidth={2} /> Cancel
                </motion.button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          )}

          {/* ── PREVIEW state ── */}
          {(mode === "preview") && previewImage && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5">
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ maxHeight: 280 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewImage} alt="Medicine preview" className="w-full object-contain" style={{ maxHeight: 280, background: "rgba(255,255,255,0.5)" }} />
                <button onClick={reset} className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
                  <X className="w-4 h-4 text-white" strokeWidth={2} />
                </button>
              </div>
              <div className="flex gap-3 w-full">
                <motion.button onClick={() => startScan()}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #8B7355, #D4956A)", boxShadow: "0 6px 20px rgba(139,115,85,0.28)" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <ScanLine className="w-4 h-4" strokeWidth={2} /> Check Safety
                </motion.button>
                <motion.button onClick={() => { setPreviewImage(null); setMode("idle"); }}
                  className="px-5 py-3.5 rounded-2xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.6)", color: "var(--color-warm-gray)", border: "1px solid rgba(139,115,85,0.15)" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <RotateCcw className="w-4 h-4" strokeWidth={2} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── SCANNING state ── */}
          {mode === "scanning" && previewImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-5">
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ maxHeight: 280 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewImage} alt="Scanning" className="w-full object-contain opacity-70" style={{ maxHeight: 280, background: "rgba(255,255,255,0.5)" }} />
                {/* Animated scan line */}
                <motion.div className="absolute left-0 right-0 h-0.5 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(212,149,106,0.9), transparent)", boxShadow: "0 0 12px rgba(212,149,106,0.6)" }}
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <AnimatePresence mode="wait">
                    <motion.div key={loadingStep} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="px-5 py-3 rounded-xl shadow-lg" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
                      <div className="flex items-center gap-3">
                        <motion.div className="w-2.5 h-2.5 rounded-full" style={{ background: "#D4956A" }} animate={{ opacity: [1, 0.4, 1], scale: [1, 0.8, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                        <span className="text-white text-xs font-semibold tracking-wide">{loadingSteps[loadingStep]}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: "var(--color-warm-gray)" }}>
                <Activity className="w-4 h-4" style={{ color: "#D4956A" }} strokeWidth={1.8} />
                Offline Safety Scan Active
              </div>
            </motion.div>
          )}

          {/* ── RESULT state ── */}
          {mode === "result" && scanResult && (() => {
            const cfg = SAFETY_CONFIG[scanResult?.safety as Safety];
            const SafeIcon = cfg?.icon || ShieldCheck;
            return (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-5 h-5" style={{ color: "#7A9470" }} strokeWidth={1.8} />
                      <span className="text-sm font-semibold" style={{ color: "#7A9470" }}>Analysis Complete</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest" style={{ background: "rgba(212,149,106,0.15)", color: "#D4956A" }}>AI Estimated Values</span>
                  </div>
                  <motion.button onClick={reset} className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--color-warm-gray)" }} whileHover={{ scale: 1.03 }}>
                    <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} /> Scan Again
                  </motion.button>
                </div>

                {/* Safety Badge Card */}
                <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: cfg?.bg || "rgba(201,168,76,0.12)", border: `1px solid ${cfg?.border || "rgba(201,168,76,0.28)"}` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.55)" }}>
                    <SafeIcon className="w-6 h-6" style={{ color: cfg?.color || "#A68B30" }} strokeWidth={1.6} />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-xl font-medium mb-0.5" style={{ color: "var(--color-charcoal)" }}>{scanResult.name}</p>
                    <p className="text-xs mb-2" style={{ color: "var(--color-warm-gray)" }}>{scanResult.brand}</p>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.65)", color: cfg?.color || "#A68B30" }}>
                      {scanResult?.safety === "safe" ? "✓ Safe to consume" : scanResult?.safety === "unsafe" ? "✕ Unsafe — avoid" : "⚠ Review Details"}
                    </span>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.72)" }}>
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--color-warm-gray)" }}>Ingredients Detected</p>
                  <div className="flex flex-wrap gap-2">
                    {(scanResult.ingredients).map((ing: string) => (
                      <span key={ing} className="px-2.5 py-1 rounded-xl text-xs font-medium" style={{ background: "rgba(139,115,85,0.08)", color: "var(--color-charcoal-soft)" }}>{ing}</span>
                    ))}
                  </div>
                </div>

                {/* Allergy Alerts */}
                {(scanResult.allergyAlerts.length > 0) && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(201,168,76,0.09)", border: "1px solid rgba(201,168,76,0.22)" }}>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#A68B30" }}>Alerts & Risks</p>
                    <div className="flex flex-col gap-2">
                      {[...(scanResult.allergyAlerts || [])].map((a: string) => (
                        <div key={a} className="flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#A68B30" }} strokeWidth={2} />
                          <p className="text-[12.5px]" style={{ color: "var(--color-charcoal-soft)" }}>{a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Health Condition Conflicts */}
                {(scanResult.conditionConflicts.length > 0) && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(196,75,75,0.07)", border: "1px solid rgba(196,75,75,0.16)" }}>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#B84A4A" }}>Health Condition Conflicts</p>
                    <div className="flex flex-col gap-2">
                      {(scanResult.conditionConflicts).map((c: string) => (
                        <div key={c} className="flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#B84A4A" }} strokeWidth={2} />
                          <p className="text-[12.5px]" style={{ color: "var(--color-charcoal-soft)" }}>{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precautions */}
                {(scanResult.precautions.length > 0) && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.72)" }}>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--color-warm-gray)" }}>Suggested Precautions</p>
                    <div className="flex flex-col gap-1.5">
                      {(scanResult.precautions).map((p: string) => (
                        <div key={p} className="flex items-start gap-2">
                          <span className="text-[10px] mt-0.5" style={{ color: "var(--color-warm-brown)" }}>✦</span>
                          <p className="text-[12.5px]" style={{ color: "var(--color-charcoal-soft)" }}>{p}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safer Alternatives */}
                {(scanResult.alternatives.length > 0) && (
                  <div className="rounded-2xl p-4" style={{ background: "rgba(168,184,154,0.12)", border: "1px solid rgba(122,148,112,0.20)" }}>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#5A8C6E" }}>Alternatives & Benefits</p>
                    <div className="flex flex-wrap gap-2">
                      {(scanResult.alternatives).map((alt: string) => (
                        <span key={alt} className="px-2.5 py-1.5 rounded-xl text-xs font-medium" style={{ background: "rgba(122,148,112,0.14)", color: "#5A8C6E" }}>{alt}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutritional Breakdown */}
                {scanResult.nutrition && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl p-6 mt-2" style={{ background: "linear-gradient(135deg, rgba(250,247,242,0.95) 0%, rgba(232,196,160,0.18) 100%)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 24px 64px rgba(139,115,85,0.12)" }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #8B7355, #D4956A)" }}>
                        <Activity className="w-5 h-5 text-white" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-medium" style={{ color: "var(--color-charcoal)" }}>Nutritional Breakdown</h3>
                        <p className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{scanResult.nutrition.calories.value} {scanResult.nutrition.calories.unit} per serving</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-7">
                      <div className="relative flex-shrink-0">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(139,115,85,0.12)" strokeWidth="6" />
                          <circle cx="40" cy="40" r="32" fill="none" stroke="url(#healthG)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32 * scanResult.nutrition.healthScore / 100} ${2 * Math.PI * 32 * (1 - scanResult.nutrition.healthScore / 100)}`} />
                          <defs><linearGradient id="healthG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8B7355" /><stop offset="100%" stopColor="#D4956A" /></linearGradient></defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-display text-xl font-semibold" style={{ color: "var(--color-charcoal)" }}>{scanResult.nutrition.healthScore}</span>
                          <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-warm-gray)" }}>Score</span>
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        {scanResult.nutrition.insights.map((ins, i) => (
                          <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.8)" }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: ins.type === "positive" ? "#5A8C6E" : ins.type === "warning" ? "#B84A4A" : "var(--color-warm-brown)" }}>{ins.title}</p>
                            <p className="text-[11px] leading-snug" style={{ color: "var(--color-charcoal-soft)" }}>{ins.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5">
                      {[
                        { title: "Macronutrients", items: [ { label: "Protein", data: scanResult.nutrition.macros.protein }, { label: "Carbs", data: scanResult.nutrition.macros.carbs }, { label: "Fats", data: scanResult.nutrition.macros.fats } ] },
                        { title: "Micronutrients & Others", items: [ { label: "Sugars", data: scanResult.nutrition.micros.sugars }, { label: "Sodium", data: scanResult.nutrition.micros.sodium }, { label: "Fiber", data: scanResult.nutrition.micros.fiber }, { label: "Sat. Fat", data: scanResult.nutrition.micros.satFat } ] }
                      ].map((group) => (
                        <div key={group.title}>
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-warm-gray)" }}>{group.title}</p>
                          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.6)" }}>
                            {group.items.map((item) => {
                              const colors = {
                                low: { bg: "rgba(122,148,112,0.15)", fill: "linear-gradient(90deg, #7A9470, #A8B89A)", text: "#5A8C6E" },
                                moderate: { bg: "rgba(201,168,76,0.15)", fill: "linear-gradient(90deg, #C9A84C, #E2CA7C)", text: "#A68B30" },
                                high: { bg: "rgba(196,75,75,0.12)", fill: "linear-gradient(90deg, #C44B4B, #D97E7E)", text: "#B84A4A" },
                              }[item.data.level];
                              return (
                                <div key={item.label} className="flex items-center justify-between mb-3 last:mb-0">
                                  <div className="w-1/4">
                                    <p className="text-[11.5px] font-semibold" style={{ color: "var(--color-charcoal)" }}>{item.label}</p>
                                    <p className="text-[10px]" style={{ color: "var(--color-warm-gray)" }}>{item.data.value}{item.data.unit}</p>
                                  </div>
                                  <div className="flex-1 h-1.5 rounded-full overflow-hidden mx-4" style={{ background: colors.bg }}>
                                    <motion.div className="h-full rounded-full" style={{ background: colors.fill }} initial={{ width: 0 }} animate={{ width: `${item.data.percentage}%` }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} />
                                  </div>
                                  <div className="w-14 text-right">
                                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: colors.text }}>{item.data.level}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })()}
        </GlassCard>

        {/* Hidden Developer/Demo Override */}
        <div className="mt-8 flex flex-col items-center">
          <button 
            onClick={() => setShowDemoInput(!showDemoInput)}
            className="text-[10px] uppercase tracking-widest font-bold opacity-20 hover:opacity-100 transition-opacity"
            style={{ color: "var(--color-warm-brown)" }}
          >
            {showDemoInput ? "Hide Demo Tools" : "Demo Overrides"}
          </button>
          
          <AnimatePresence>
            {showDemoInput && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mt-4 relative"
              >
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4" style={{ color: "var(--color-warm-gray)" }} />
                  </div>
                  <input 
                    type="text"
                    value={manualLabel}
                    onChange={(e) => {
                      setManualLabel(e.target.value);
                      if (e.target.value.length > 1) {
                        const filtered = allItems.filter(item => 
                          item.name.toLowerCase().includes(e.target.value.toLowerCase())
                        ).slice(0, 5);
                        setSuggestions(filtered);
                        setShowSuggestions(true);
                      } else {
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') startScan();
                    }}
                    placeholder="Search food or medicine (Demo Override)..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(212,149,106,0.2)", color: "var(--color-charcoal)" }}
                  />
                  
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-50 left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-xl"
                      style={{ background: "rgba(250,247,242,0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(212,149,106,0.15)" }}
                    >
                      {suggestions.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/50 transition-colors flex items-center justify-between group"
                        >
                          <span style={{ color: "var(--color-charcoal)" }}>{item.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 group-hover:opacity-100" style={{ color: "var(--color-warm-brown)" }}>
                            {item.category || "Item"}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      <div className="h-16" />
    </div>
  );
}
