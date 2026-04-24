"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Student {
  id: number;
  studentId: string;
  name: string;
  gpa: number;
  image?: string;
}

interface AttendanceRecord {
  id: number;
  studentId: string;
  date: string;
  status: string;
  student: Student;
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchStudents();
    fetchAttendances();
  }, [selectedDate]);

  const fetchStudents = () => {
    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const fetchAttendances = () => {
    fetch(`/api/attendance?date=${selectedDate}`)
      .then(res => res.json())
      .then(data => setAttendances(data))
      .catch(() => setAttendances([]));
  };

  const markAttendance = async (studentId: string, status: string) => {
    setSavingStatus(prev => ({ ...prev, [studentId]: "กำลังบันทึก..." }));

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          date: selectedDate,
          status,
        }),
      });

      if (response.ok) {
        setSavingStatus(prev => ({ ...prev, [studentId]: "บันทึกแล้ว ✓" }));
        fetchAttendances(); // โหลดข้อมูลใหม่
        setTimeout(() => {
          setSavingStatus(prev => ({ ...prev, [studentId]: "" }));
        }, 2000);
      } else {
        const error = await response.json();
        setSavingStatus(prev => ({ ...prev, [studentId]: `❌ ${error.error}` }));
      }
    } catch (error) {
      setSavingStatus(prev => ({ ...prev, [studentId]: "❌ เกิดข้อผิดพลาด" }));
    }
  };

  const getAttendanceStatus = (studentId: string) => {
    const record = attendances.find(att => att.studentId === studentId);
    return record ? record.status : null;
  };

  if (isLoading) return <div className="text-center mt-20 text-[#ff6fa5] font-bold animate-pulse">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-end mb-8 border-b border-[#ffd6e7] pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#ff6fa5]">📝 เช็คชื่อนักศึกษา</h2>
          <p className="text-[#ff4d88] mt-1 font-medium">ระบบเช็คชื่อและติดตามการเข้าเรียน</p>
        </div>
        <Link href="/attendance/report">
          <button className="bg-[#ff4d88] text-white font-bold py-2 px-4 rounded-xl hover:bg-[#ff6fa5] transition-all">
            📊 ดูรายงาน
          </button>
        </Link>
      </div>

      {/* เลือกวันที่ */}
      <div className="mb-6">
        <label className="text-sm font-bold text-[#ff6fa5] ml-2">เลือกวันที่เช็คชื่อ</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full max-w-xs p-3 bg-[#fff0f5] border border-[#ffd6e7] rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6fa5] transition-all ml-4"
        />
      </div>

      {/* สถิติประจำวัน */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{students.length}</p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาทั้งหมด</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{attendances.filter(att => att.status === "Present").length}</p>
          <p className="text-sm text-[#ff4d88]">มาเรียน</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{attendances.filter(att => att.status === "Absent").length}</p>
          <p className="text-sm text-[#ff4d88]">ขาดเรียน</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">
            {students.length > 0 ? Math.round((attendances.filter(att => att.status === "Present").length / students.length) * 100) : 0}%
          </p>
          <p className="text-sm text-[#ff4d88]">อัตราการเข้าเรียน</p>
        </div>
      </div>

      {/* รายชื่อนักศึกษา */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => {
          const status = getAttendanceStatus(student.studentId);
          const statusColor = status === "Present" ? "text-green-600" : status === "Absent" ? "text-red-600" : "text-gray-500";

          return (
            <div key={student.id} className="bg-[#fff0f5] p-6 rounded-3xl shadow-sm border border-[#ffd6e7] hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                {student.image ? (
                  <img src={student.image} alt={student.name} className="w-12 h-12 object-cover rounded-full border-2 border-[#ff6fa5]" />
                ) : (
                  <div className="w-12 h-12 bg-[#ffd6e7] rounded-full flex items-center justify-center text-[#ff6fa5] font-bold">
                    {student.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#ff6fa5] tracking-wider mb-1 uppercase">รหัสนักศึกษา</p>
                  <p className="text-lg font-black text-slate-700">{student.studentId}</p>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-800 mb-3 truncate">{student.name}</p>

              <div className="mb-4">
                <p className="text-xs font-bold text-[#ff4d88] tracking-wider mb-1 uppercase">สถานะการเข้าเรียน</p>
                <p className={`text-lg font-bold ${statusColor}`}>
                  {status === "Present" ? "✅ มาเรียน" : status === "Absent" ? "❌ ขาดเรียน" : "⏳ ยังไม่เช็คชื่อ"}
                </p>
              </div>

              {savingStatus[student.studentId] && (
                <p className="text-sm text-center mb-2 text-[#ff6fa5]">{savingStatus[student.studentId]}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => markAttendance(student.studentId, "Present")}
                  className={`flex-1 py-2 rounded-xl transition-all text-sm font-bold ${
                    status === "Present"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  ✅ มาเรียน
                </button>
                <button
                  onClick={() => markAttendance(student.studentId, "Absent")}
                  className={`flex-1 py-2 rounded-xl transition-all text-sm font-bold ${
                    status === "Absent"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  ❌ ขาดเรียน
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}