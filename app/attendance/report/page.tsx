"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface AttendanceReport {
  studentId: string;
  name: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendanceRate: number;
  gpa: number;
}

export default function AttendanceReportPage() {
  const [report, setReport] = useState<AttendanceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // 30 วันที่แล้ว
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const fetchReport = () => {
    setIsLoading(true);
    fetch(`/api/attendance/report?startDate=${startDate}&endDate=${endDate}`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 90) return "ดีเยี่ยม";
    if (rate >= 75) return "พอใช้";
    return "ต้องปรับปรุง";
  };

  if (isLoading) return <div className="text-center mt-20 text-[#ff6fa5] font-bold animate-pulse">กำลังโหลดข้อมูล...</div>;

  const averageAttendance = report.length > 0 ? report.reduce((sum, r) => sum + r.attendanceRate, 0) / report.length : 0;
  const lowAttendanceStudents = report.filter(r => r.attendanceRate < 75).length;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-end mb-8 border-b border-[#ffd6e7] pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#ff6fa5]">📊 รายงานการเข้าเรียน</h2>
          <p className="text-[#ff4d88] mt-1 font-medium">วิเคราะห์อัตราการเข้าเรียนและการขาดเรียน</p>
        </div>
        <Link href="/attendance">
          <button className="bg-[#ff4d88] text-white font-bold py-2 px-4 rounded-xl hover:bg-[#ff6fa5] transition-all">
            📝 เช็คชื่อ
          </button>
        </Link>
      </div>

      {/* ตัวกรองวันที่ */}
      <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] mb-8">
        <h3 className="text-lg font-bold text-[#ff6fa5] mb-4">เลือกช่วงเวลา</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="text-sm font-bold text-[#ff4d88] ml-2">วันที่เริ่มต้น</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 bg-white border border-[#ffd6e7] rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6fa5] transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-[#ff4d88] ml-2">วันที่สิ้นสุด</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 bg-white border border-[#ffd6e7] rounded-2xl outline-none focus:ring-2 focus:ring-[#ff6fa5] transition-all"
            />
          </div>
        </div>
      </div>

      {/* สถิติสรุป */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{report.length}</p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาทั้งหมด</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{averageAttendance.toFixed(1)}%</p>
          <p className="text-sm text-[#ff4d88]">อัตราการเข้าเรียนเฉลี่ย</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{lowAttendanceStudents}</p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาที่ต้องปรับปรุง (&lt;75%)</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">
            {report.filter(r => r.attendanceRate >= 90).length}
          </p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาดีเยี่ยม (≥90%)</p>
        </div>
      </div>

      {/* ตารางรายงาน */}
      <div className="bg-[#fff0f5] rounded-3xl border border-[#ffd6e7] overflow-hidden">
        <div className="p-6 border-b border-[#ffd6e7]">
          <h3 className="text-xl font-bold text-[#ff6fa5]">รายละเอียดการเข้าเรียน</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#ffd6e7]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#ff6fa5] uppercase tracking-wider">นักศึกษา</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#ff6fa5] uppercase tracking-wider">วันที่เรียน</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#ff6fa5] uppercase tracking-wider">มาเรียน</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#ff6fa5] uppercase tracking-wider">ขาดเรียน</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#ff6fa5] uppercase tracking-wider">อัตราการเข้าเรียน</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#ff6fa5] uppercase tracking-wider">เกรดเฉลี่ย</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#ff6fa5] uppercase tracking-wider">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffd6e7]">
              {report.map((student) => (
                <tr key={student.studentId} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{student.name}</div>
                      <div className="text-xs text-[#ff4d88]">{student.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {student.totalDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                    {student.presentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
                    {student.absentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${getAttendanceColor(student.attendanceRate)}`}>
                      {student.attendanceRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {student.gpa.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                      student.attendanceRate >= 90
                        ? "bg-green-100 text-green-800"
                        : student.attendanceRate >= 75
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {getAttendanceStatus(student.attendanceRate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {report.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#ff4d88] text-lg">ไม่มีข้อมูลการเข้าเรียนในช่วงเวลาที่เลือก</p>
          </div>
        )}
      </div>
    </div>
  );
}