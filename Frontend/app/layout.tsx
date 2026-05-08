import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/lib/userContext";

export const metadata: Metadata = {
  title: "Medisphere — Premium Healthcare Dashboard",
  description: "Your personal luxury healthcare companion. AI-powered wellness, lab reports, appointments, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
