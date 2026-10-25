import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pune Travel Hunt 🎯 — Real-World 2-Player Spotting Game",
  description: "An exciting real-world spotting challenge for two explorers travelling across Pune, Maharashtra.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-[#F5F6F5] text-slate-900 min-h-screen">
        <GameProvider>
          <AppShell>{children}</AppShell>
        </GameProvider>
      </body>
    </html>
  );
}
