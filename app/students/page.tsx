"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentList() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  // กรองข้อมูลตามคำค้นหา
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.includes(searchTerm)
  );

  // คำนวณสถิติ
  const totalStudents = filteredStudents.length;
  const averageGPA = totalStudents > 0 ? (filteredStudents.reduce((sum, std) => sum + std.gpa, 0) / totalStudents).toFixed(2) : 0;
  const highPerformers = filteredStudents.filter(std => std.gpa >= 3.5).length;

  if (isLoading) return <div className="text-center mt-20 text-[#7c3aed] font-bold animate-pulse">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="mt-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-[#ede9fe] pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#5b21b6]">รายชื่อนักศึกษา</h2>
          <p className="text-[#7c3aed] mt-1 font-medium">พบข้อมูลทั้งหมด {filteredStudents.length} รายการ</p>
        </div>
      </div>

      {/* แถบค้นหา */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ค้นหาชื่อหรือรหัสนักศึกษา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 bg-[#f3e8ff] border border-[#d8b4fe] rounded-2xl outline-none focus:ring-2 focus:ring-[#8b5cf6] transition-all placeholder-[#7c3aed] text-[#5b21b6]"
        />
      </div>

      {/* สถิติ */}
      {totalStudents > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#f3e8ff] p-4 rounded-2xl border border-[#d8b4fe] text-center shadow-sm">
            <p className="text-2xl font-bold text-[#5b21b6]">{totalStudents}</p>
            <p className="text-sm text-[#7c3aed]">นักศึกษาทั้งหมด</p>
          </div>
          <div className="bg-[#f3e8ff] p-4 rounded-2xl border border-[#d8b4fe] text-center shadow-sm">
            <p className="text-2xl font-bold text-[#5b21b6]">{averageGPA}</p>
            <p className="text-sm text-[#7c3aed]">เกรดเฉลี่ยรวม</p>
          </div>
          <div className="bg-[#f3e8ff] p-4 rounded-2xl border border-[#d8b4fe] text-center shadow-sm">
            <p className="text-2xl font-bold text-[#5b21b6]">{highPerformers}</p>
            <p className="text-sm text-[#7c3aed]">เกรดดีเยี่ยม (≥3.5)</p>
          </div>
        </div>
      )}

      {filteredStudents.length === 0 ? (
        <div className="text-center bg-[#f3e8ff] p-10 rounded-3xl border border-[#d8b4fe] shadow-sm mt-10">
          <p className="text-[#5b21b6] mb-4">ยังไม่มีข้อมูลนักศึกษาในระบบ</p>
          <Link href="/add">
            <button className="bg-[#8b5cf6] text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-[#7c3aed] transition-all">
              เริ่มเพิ่มข้อมูล
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((std) => (
            <div key={std.id} className="bg-[#f3e8ff] p-6 rounded-3xl shadow-sm border border-[#d8b4fe] hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden flex flex-col h-full animate-fade-in">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#7c3aed] transition-all duration-300 hover:w-4"></div>
              <div className="absolute top-0 left-0 w-2 h-full bg-[#7c3aed]"></div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  {std.image ? (
                    <img src={std.image} alt={std.name} className="w-12 h-12 object-cover rounded-full border-2 border-[#7c3aed]" />
                  ) : (
                    <div className="w-12 h-12 bg-[#d8b4fe] rounded-full flex items-center justify-center text-[#7c3aed] font-bold">
                      {std.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-[#7c3aed] tracking-wider mb-1 uppercase">รหัสนักศึกษา</p>
                    <p className="text-xl font-black text-[#3b076b]">{std.studentId}</p>
                  </div>
                </div>
                
                <p className="text-xs font-bold text-[#5b21b6] tracking-wider mb-1 uppercase">ชื่อ-นามสกุล</p>
                <p className="text-lg font-bold text-[#3b076b] mb-4 truncate">{std.name}</p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#d8b4fe]">
                  <p className="text-sm font-bold text-[#5b21b6]">เกรดเฉลี่ยสะสม</p>
                  <p className={`text-2xl font-black ${std.gpa >= 3.0 ? 'text-emerald-500' : std.gpa >= 2.0 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {std.gpa.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* ปุ่มแก้ไขและลบ */}
              <div className="mt-6 flex gap-2">
                <Link href={`/edit/${std.id}`} className="flex-1">
                  <button className="w-full bg-[#d8b4fe] hover:bg-[#8b5cf6] hover:text-white text-[#5b21b6] font-bold py-2 rounded-xl transition-all text-sm border border-[#c4b5fd]">
                    Edit
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(std.id)} 
                  className="flex-1 bg-[#f3e8ff] hover:bg-[#7c3aed] hover:text-white text-[#5b21b6] font-bold py-2 rounded-xl transition-all text-sm border border-[#c4b5fd]"
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