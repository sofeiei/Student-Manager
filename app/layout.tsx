import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const notoSansThai = Noto_Sans_Thai({ subsets: ["thai"] });

export const metadata: Metadata = { title: "Student Manager" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.className} bg-gray-50 flex flex-col min-h-screen`}>
        {/* Navbar & Header */}
        <header className="bg-blue-600 text-white shadow-md">
          <div className="max-w-5xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">Student Manager</h1>
            <nav className="flex gap-4">
              <Link href="/" className="hover:text-blue-200 transition-colors">หน้าแรก</Link>
              <Link href="/students" className="hover:text-blue-200 transition-colors">รายชื่อนักศึกษา</Link>
              <Link href="/add" className="hover:text-blue-200 transition-colors bg-blue-700 px-4 py-1 rounded-full">เพิ่มข้อมูล</Link>
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 text-center p-4 mt-auto text-sm">
          <p>&copy; 2026 Student Manager Project. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}