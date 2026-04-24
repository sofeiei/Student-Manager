import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

const notoSansThai = Noto_Sans_Thai({ subsets: ["thai"] });

export const metadata: Metadata = { title: "Student Manager" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.className} bg-[#f5f0ff] flex flex-col min-h-screen`}>
        <ThemeProvider>
          {/* Navbar & Header */}
          <header className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white shadow-xl">
            <div className="max-w-5xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl font-bold tracking-tight">Student Manager</h1>
              <div className="flex items-center gap-4">
                <nav className="flex gap-4 flex-wrap items-center">
                  <Link href="/" className="hover:text-[#d8b4fe] transition-colors">หน้าแรก</Link>
                  <Link href="/dashboard" className="hover:text-[#d8b4fe] transition-colors">📊 แดชบอร์ด</Link>
                  <Link href="/students" className="hover:text-[#d8b4fe] transition-colors">รายชื่อนักศึกษา</Link>
                  <Link href="/add" className="hover:text-white transition-colors bg-white/20 px-4 py-1 rounded-full border border-white/30">เพิ่มข้อมูล</Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-[#7c3aed] text-white text-center p-4 mt-auto text-sm">
            <p>&copy; 2026 Student Manager Project. All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}