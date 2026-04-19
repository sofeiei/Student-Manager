"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentList() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = () => {
    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?")) {
      await fetch(`/api/students/${id}`, { method: "DELETE" });
      fetchStudents(); // โหลดข้อมูลใหม่หลังจากลบเสร็จ
    }
  };

  if (isLoading) return <div className="text-center mt-20 text-slate-500 font-bold animate-pulse">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">รายชื่อนักศึกษา</h2>
          <p className="text-slate-500 mt-1 font-medium">พบข้อมูลทั้งหมด {students.length} รายการ</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-3xl border border-slate-200 shadow-sm mt-10">
          <p className="text-slate-500 mb-4">ยังไม่มีข้อมูลนักศึกษาในระบบ</p>
          <Link href="/add">
            <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-blue-700 transition-all">
              เริ่มเพิ่มข้อมูล
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((std) => (
            <div key={std.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
              
              <div className="flex-grow">
                <p className="text-xs font-bold text-blue-500 tracking-wider mb-1 uppercase">รหัสนักศึกษา</p>
                <p className="text-xl font-black text-slate-700 mb-4">{std.studentId}</p>
                
                <p className="text-xs font-bold text-slate-400 tracking-wider mb-1 uppercase">ชื่อ-นามสกุล</p>
                <p className="text-lg font-bold text-slate-800 mb-4 truncate">{std.name}</p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-500">เกรดเฉลี่ยสะสม</p>
                  <p className={`text-2xl font-black ${std.gpa >= 3.0 ? 'text-emerald-500' : std.gpa >= 2.0 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {std.gpa.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* ปุ่มแก้ไขและลบ */}
              <div className="mt-6 flex gap-2">
                <Link href={`/edit/${std.id}`} className="flex-1">
                  <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold py-2 rounded-xl transition-all text-sm">
                    Edit
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(std.id)} 
                  className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-2 rounded-xl transition-all text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}