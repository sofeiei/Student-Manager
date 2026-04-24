"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [quote, setQuote] = useState("กำลังโหลดคำแนะนำ...");

  // ดึงข้อมูลจาก External API (ตามคำสั่งอาจารย์ข้อ 1)
  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then((res) => res.json())
      .then((data) => setQuote(data.slip.advice))
      .catch(() => setQuote("Welcome to the Student Manager!"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 md:mt-20 gap-6 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#5b21b6] leading-tight animate-bounce-in">ระบบจัดการนักศึกษา</h2>
      <p className="text-[#7c3aed] max-w-lg text-lg animate-slide-up">
        รองรับการเพิ่มและดูรายชื่อนักศึกษาในสไตล์สีม่วงอ่อน
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-slide-up-delayed">
        <Link href="/dashboard">
          <button className="bg-[#ede9fe] text-[#5b21b6] font-bold py-3 px-6 rounded-2xl hover:bg-[#8b5cf6] hover:text-white transition-all border border-[#c4b5fd] hover:scale-105 transform shadow-sm">
            📊 ดูแดชบอร์ด
          </button>
        </Link>
        <Link href="/students">
          <button className="bg-[#ede9fe] text-[#5b21b6] font-bold py-3 px-6 rounded-2xl hover:bg-[#8b5cf6] hover:text-white transition-all border border-[#c4b5fd] hover:scale-105 transform shadow-sm">
            ดูรายชื่อทั้งหมด
          </button>
        </Link>
        <Link href="/add">
          <button className="bg-[#8b5cf6] text-white font-bold py-3 px-6 rounded-2xl hover:bg-[#7c3aed] shadow-lg active:scale-95 transition-all hover:scale-105 transform">
            เริ่มเพิ่มข้อมูล
          </button>
        </Link>
      </div>

      {/* ส่วนแสดงข้อมูลจาก API ภายนอก */}
      {/* <div className="mt-12 bg-[#fff0f5] p-6 rounded-2xl shadow-sm border border-[#ffd6e7] max-w-md w-full">
        <p className="text-xs font-bold text-[#ff6fa5] uppercase tracking-widest mb-3">คำแนะนำประจำวัน (External API)</p>
        <p className="text-lg font-medium text-slate-700 italic">"{quote}"</p>
      </div> */}
    </div>
  );
}