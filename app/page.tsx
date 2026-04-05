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
    <div className="flex flex-col items-center justify-center text-center mt-10 md:mt-20 gap-6">
      <h2 className="text-4xl md:text-5xl font-extrabold text-blue-600 leading-tight">ระบบจัดการนักศึกษา</h2>
      <p className="text-slate-500 max-w-lg text-lg">
        รองรับการเพิ่มและดูรายชื่อนักศึกษา
      </p>
      
      <div className="flex gap-4 mt-4">
        <Link href="/students">
          <button className="bg-blue-100 text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-blue-200 transition-all">
            ดูรายชื่อทั้งหมด
          </button>
        </Link>
        <Link href="/add">
          <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 shadow-md active:scale-95 transition-all">
            เริ่มเพิ่มข้อมูล
          </button>
        </Link>
      </div>

      {/* ส่วนแสดงข้อมูลจาก API ภายนอก */}
      {/* <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-blue-100 max-w-md w-full">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">คำแนะนำประจำวัน (External API)</p>
        <p className="text-lg font-medium text-slate-700 italic">"{quote}"</p>
      </div> */}
    </div>
  );
}