import { Sidebar } from "@/components/layout/Sidebar";
import { BackgroundCanvas } from "@/components/ui/FloatingOrb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <BackgroundCanvas />

      {/* Sidebar — desktop */}
      <div
        className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 sticky top-0 h-screen"
        style={{
          background: "rgba(255, 255, 255, 0.40)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.60)",
        }}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
