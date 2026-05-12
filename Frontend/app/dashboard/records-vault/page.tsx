"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderHeart, Upload, X, Search, FileText, Image as ImageIcon, Shield, Lock, Calendar, Trash2, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

type Category = "prescription" | "lab-report" | "scan" | "bill" | "other";
interface DocMeta {
  id: string;
  name: string;
  ext: string;
  category: Category;
  sizeLabel: string;
  dateAdded: string;
  previewUrl?: string; // data URL for images
  isImage: boolean;
}

const CATEGORY_LABELS: Record<Category, string> = {
  "prescription": "Prescription",
  "lab-report": "Lab Report",
  "scan": "Scan / X-Ray",
  "bill": "Medical Bill",
  "other": "Other",
};

const CATEGORY_STYLE: Record<Category, { color: string; bg: string }> = {
  "prescription": { color: "#D4956A", bg: "rgba(232,196,160,0.22)" },
  "lab-report": { color: "#7A9470", bg: "rgba(168,184,154,0.20)" },
  "scan": { color: "#6A8AB0", bg: "rgba(173,196,232,0.20)" },
  "bill": { color: "#C9A84C", bg: "rgba(201,168,76,0.18)" },
  "other": { color: "#8B7355", bg: "rgba(139,115,85,0.12)" },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ALL_CATEGORIES: Category[] = ["prescription", "lab-report", "scan", "bill", "other"];

export default function RecordsVaultPage() {
  const [docs, setDocs] = useState<DocMeta[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("mds_records");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "all">("all");
  const [previewDoc, setPreviewDoc] = useState<DocMeta | null>(null);
  const [pendingCat, setPendingCat] = useState<Category>("prescription");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  const persist = (updated: DocMeta[]) => {
    setDocs(updated);
    try {
      // Store only metadata + small previews (guard against quota)
      const toStore = updated.map((d) => ({ ...d, previewUrl: d.isImage && d.previewUrl && d.previewUrl.length < 200000 ? d.previewUrl : undefined }));
      localStorage.setItem("mds_records", JSON.stringify(toStore));
    } catch {}
  };

  // Process files after category selection
  const processFiles = useCallback(async (files: File[], category: Category) => {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 900));
    const newDocs: DocMeta[] = await Promise.all(files.map(async (file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const isImage = file.type.startsWith("image/");
      let previewUrl: string | undefined;
      if (isImage) {
        previewUrl = await new Promise<string>((res) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        ext, category,
        sizeLabel: formatBytes(file.size),
        dateAdded: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        previewUrl,
        isImage,
      };
    }));
    persist([...docs, ...newDocs]);
    setUploading(false);
  }, [docs]);

  const onFilesSelected = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    setPendingFiles(arr);
    setPendingCat("prescription");
    setShowCatModal(true);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesSelected(e.dataTransfer.files);
  }, [onFilesSelected]);

  const confirmUpload = () => {
    setShowCatModal(false);
    processFiles(pendingFiles, pendingCat);
  };

  const deleteDoc = (id: string) => persist(docs.filter((d) => d.id !== id));

  const filtered = docs.filter((d) => {
    const matchCat = filterCat === "all" || d.category === filterCat;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || CATEGORY_LABELS[d.category].toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });


  return (
    <div className="px-6 sm:px-8 xl:px-12 py-10 max-w-3xl">
      {/* Header */}
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,184,154,0.22)" }}>
            <FolderHeart className="w-5 h-5" style={{ color: "#7A9470" }} strokeWidth={1.7} />
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-warm-gray)" }}>Encrypted</span>
          </div>
        </div>
        <h1 className="font-display text-5xl font-light mb-3" style={{ color: "var(--color-charcoal)" }}>Medical Records Vault</h1>
        <p className="text-base" style={{ color: "var(--color-warm-gray)" }}>Upload and organize your prescriptions, lab reports, and health documents.</p>
      </motion.div>

      {/* Stats Strip */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {[
          { label: "Documents", value: docs.length, icon: FileText, color: "#D4956A", bg: "rgba(232,196,160,0.18)" },
          { label: "Encrypted", value: "AES-256", icon: Shield, color: "#7A9470", bg: "rgba(168,184,154,0.18)" },
          { label: "Last Added", value: docs.length > 0 ? docs[docs.length - 1].dateAdded : "—", icon: Calendar, color: "#6A8AB0", bg: "rgba(173,196,232,0.18)" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.48)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.70)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <Icon className="w-3.5 h-3.5" style={{ color: s.color }} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[10.5px]" style={{ color: "var(--color-warm-gray)" }}>{s.label}</p>
                <p className="text-sm font-semibold whitespace-nowrap" style={{ color: "var(--color-charcoal)" }}>{s.value}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Upload Zone */}
      <motion.div className="mb-7" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div
          className="rounded-3xl p-7 flex flex-col items-center text-center cursor-pointer transition-all duration-200"
          style={{
            background: isDragging ? "rgba(139,115,85,0.08)" : "rgba(255,255,255,0.38)",
            border: `1.5px dashed ${isDragging ? "rgba(139,115,85,0.42)" : "rgba(139,115,85,0.22)"}`,
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <motion.div className="w-10 h-10 rounded-full border-2 border-t-transparent" style={{ borderColor: "rgba(139,115,85,0.25)", borderTopColor: "var(--color-warm-brown)" }}
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <p className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>Uploading {pendingFiles.length} file{pendingFiles.length > 1 ? "s" : ""}…</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(139,115,85,0.09)" }}>
                <Upload className="w-5 h-5" style={{ color: "var(--color-warm-brown)" }} strokeWidth={1.7} />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-charcoal)" }}>{isDragging ? "Drop files here" : "Drag & drop or click to upload"}</p>
              <p className="text-xs mb-4" style={{ color: "var(--color-warm-gray)" }}>PDF, JPG, PNG, HEIC — any health document</p>
              <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="px-5 py-2 rounded-xl text-xs font-semibold transition-all hover:shadow-md"
                style={{ background: "rgba(139,115,85,0.10)", color: "var(--color-warm-brown)", border: "1px solid rgba(139,115,85,0.18)" }}>
                Choose Files
              </button>
              <p className="text-[10.5px] mt-2.5" style={{ color: "var(--color-warm-gray-light)" }}>Stored locally on your device</p>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf,.pdf,.doc,.docx" className="hidden" onChange={(e) => onFilesSelected(e.target.files)} />
      </motion.div>

      {/* Search + Filter */}
      {docs.length > 0 && (
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.6} />
            <input type="text" placeholder="Search records…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-luxury pl-11" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", ...ALL_CATEGORIES] as const).map((cat) => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className="px-3 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all duration-200"
                style={{
                  background: filterCat === cat ? (cat === "all" ? "var(--color-warm-brown)" : CATEGORY_STYLE[cat as Category].bg) : "rgba(255,255,255,0.45)",
                  color: filterCat === cat ? (cat === "all" ? "white" : CATEGORY_STYLE[cat as Category].color) : "var(--color-warm-gray)",
                  border: `1.5px solid ${filterCat === cat ? "transparent" : "rgba(139,115,85,0.12)"}`,
                }}>
                {cat === "all" ? "All Documents" : CATEGORY_LABELS[cat as Category]}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Documents List */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 && docs.length === 0 && !uploading && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-10 flex flex-col items-center text-center" hoverable={false}>
              <FolderHeart className="w-10 h-10 mb-4" style={{ color: "var(--color-warm-gray-light)" }} strokeWidth={1.2} />
              <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--color-charcoal)" }}>Your vault is empty</p>
              <p className="text-xs" style={{ color: "var(--color-warm-gray)" }}>Upload your first document to get started</p>
            </GlassCard>
          </motion.div>
        )}
        {filtered.map((doc, i) => {
          const style = CATEGORY_STYLE[doc.category];
          return (
            <motion.div key={doc.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="mb-3">
              <GlassCard className="p-4 flex items-center gap-4">
                {/* Thumbnail / icon */}
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: style.bg }}>
                  {doc.isImage && doc.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={doc.previewUrl} alt={doc.name} className="w-full h-full object-cover" />
                  ) : doc.isImage ? (
                    <ImageIcon className="w-5 h-5" style={{ color: style.color }} strokeWidth={1.7} />
                  ) : (
                    <FileText className="w-5 h-5" style={{ color: style.color }} strokeWidth={1.7} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate mb-0.5" style={{ color: "var(--color-charcoal)" }}>{doc.name}.{doc.ext}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium" style={{ background: style.bg, color: style.color }}>{CATEGORY_LABELS[doc.category]}</span>
                    <span className="text-xs" style={{ color: "var(--color-warm-gray)" }}>{doc.dateAdded} · {doc.sizeLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {doc.isImage && doc.previewUrl && (
                    <motion.button onClick={() => setPreviewDoc(doc)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.55)", border: "1.5px solid rgba(139,115,85,0.15)" }}>
                      <Eye className="w-3.5 h-3.5" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
                    </motion.button>
                  )}
                  <motion.button onClick={() => deleteDoc(doc.id)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.55)", border: "1.5px solid rgba(139,115,85,0.15)" }}>
                    <Trash2 className="w-3.5 h-3.5" style={{ color: "#C44B4B" }} strokeWidth={1.8} />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Category Selection Modal */}
      <AnimatePresence>
        {showCatModal && (
          <motion.div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4"
            style={{ background: "rgba(44,36,22,0.35)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-sm rounded-4xl p-7"
              style={{ background: "rgba(250,247,242,0.97)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "0 32px 80px rgba(139,115,85,0.25)" }}
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl font-medium" style={{ color: "var(--color-charcoal)" }}>Categorize Document</h3>
                <button onClick={() => setShowCatModal(false)} className="p-1.5 rounded-xl hover:bg-black/5">
                  <X className="w-4 h-4" style={{ color: "var(--color-warm-gray)" }} strokeWidth={1.8} />
                </button>
              </div>
              <p className="text-sm mb-5" style={{ color: "var(--color-warm-gray)" }}>
                {pendingFiles.length} file{pendingFiles.length > 1 ? "s" : ""} selected. Choose a category:
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {ALL_CATEGORIES.map((cat) => {
                  const s = CATEGORY_STYLE[cat];
                  return (
                    <button key={cat} onClick={() => setPendingCat(cat)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200"
                      style={{ background: pendingCat === cat ? s.bg : "rgba(255,255,255,0.55)", border: `1.5px solid ${pendingCat === cat ? `${s.color}40` : "rgba(139,115,85,0.10)"}` }}>
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-sm font-medium" style={{ color: pendingCat === cat ? "var(--color-charcoal)" : "var(--color-charcoal-soft)" }}>{CATEGORY_LABELS[cat]}</span>
                    </button>
                  );
                })}
              </div>
              <motion.button onClick={confirmUpload}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #8B7355, #D4956A)", boxShadow: "0 8px 24px rgba(139,115,85,0.25)" }}
                whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Upload className="w-4 h-4" strokeWidth={2} /> Upload as {CATEGORY_LABELS[pendingCat]}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewDoc && previewDoc.previewUrl && (
          <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(44,36,22,0.55)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreviewDoc(null)}>
            <motion.div className="relative max-w-2xl w-full" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }} onClick={(e) => e.stopPropagation()}>
              <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewDoc.previewUrl} alt={previewDoc.name} className="w-full object-contain" style={{ maxHeight: "70vh" }} />
              </div>
              <button onClick={() => setPreviewDoc(null)}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "rgba(44,36,22,0.75)" }}>
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
              <p className="text-center text-sm font-medium mt-4 text-white opacity-75">{previewDoc.name}.{previewDoc.ext}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-16" />
    </div>
  );
}
