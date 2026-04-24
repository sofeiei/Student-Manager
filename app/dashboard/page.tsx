"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

interface Student {
  id: number;
  studentId: string;
  name: string;
  gpa: number;
  image?: string;
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="text-center mt-20 text-[#ff6fa5] font-bold animate-pulse">กำลังโหลดข้อมูล...</div>;

  // คำนวณสถิติ
  const totalStudents = students.length;
  const averageGPA = totalStudents > 0 ? students.reduce((sum, std) => sum + std.gpa, 0) / totalStudents : 0;
  const highPerformers = students.filter(std => std.gpa >= 3.5).length;
  const lowPerformers = students.filter(std => std.gpa < 2.0).length;
  const excellentStudents = students.filter(std => std.gpa >= 3.75).length;

  // ข้อมูลสำหรับกราฟ GPA Distribution
  const gpaRanges = [
    { range: "0-1.99", count: students.filter(s => s.gpa < 2).length, color: "#ff4d88" },
    { range: "2.0-2.99", count: students.filter(s => s.gpa >= 2 && s.gpa < 3).length, color: "#ff6fa5" },
    { range: "3.0-3.49", count: students.filter(s => s.gpa >= 3 && s.gpa < 3.5).length, color: "#ffd6e7" },
    { range: "3.5-4.0", count: students.filter(s => s.gpa >= 3.5).length, color: "#ff4d88" }
  ];

  // ข้อมูลสำหรับกราฟ Performance Overview
  const performanceData = [
    { name: "นักศึกษาดีเยี่ยม (≥3.75)", value: excellentStudents, color: "#ff4d88" },
    { name: "นักศึกษาดี (3.5-3.74)", value: highPerformers - excellentStudents, color: "#ff6fa5" },
    { name: "นักศึกษาปานกลาง (2.0-3.49)", value: students.filter(s => s.gpa >= 2 && s.gpa < 3.5).length - (highPerformers - excellentStudents), color: "#ffd6e7" },
    { name: "นักศึกษาต้องปรับปรุง (<2.0)", value: lowPerformers, color: "#ff4d88" }
  ];

  // ข้อมูลสำหรับกราฟ GPA Trend (จำลองข้อมูล)
  const gpaTrendData = [
    { month: "ม.ค.", gpa: 3.2 },
    { month: "ก.พ.", gpa: 3.1 },
    { month: "มี.ค.", gpa: 3.3 },
    { month: "เม.ย.", gpa: averageGPA },
    { month: "พ.ค.", gpa: averageGPA + 0.1 },
    { month: "มิ.ย.", gpa: averageGPA + 0.2 }
  ];

  return (
    <div className="mt-4">
      <div className="flex justify-between items-end mb-8 border-b border-[#ffd6e7] pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#ff6fa5]">📊 แดชบอร์ดวิเคราะห์</h2>
          <p className="text-[#ff4d88] mt-1 font-medium">ข้อมูลเชิงลึกและแนวโน้มผลการเรียน</p>
        </div>
      </div>

      {/* สถิติหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{totalStudents}</p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาทั้งหมด</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{averageGPA.toFixed(2)}</p>
          <p className="text-sm text-[#ff4d88]">เกรดเฉลี่ยรวม</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{highPerformers}</p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาดีเยี่ยม (≥3.5)</p>
        </div>
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] text-center">
          <p className="text-3xl font-bold text-[#ff6fa5]">{lowPerformers}</p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาต้องปรับปรุง (&lt;2.0)</p>
        </div>
      </div>

      {/* กราฟหลัก */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* กราฟ GPA Distribution */}
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7]">
          <h3 className="text-xl font-bold text-[#ff6fa5] mb-4">📈 การกระจายเกรด GPA</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gpaRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ff6fa5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* กราฟ Performance Overview */}
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7]">
          <h3 className="text-xl font-bold text-[#ff6fa5] mb-4">🎯 ภาพรวมผลการเรียน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* กราฟแนวโน้ม */}
      <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7] mb-8">
        <h3 className="text-xl font-bold text-[#ff6fa5] mb-4">📊 แนวโน้มเกรดเฉลี่ย</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={gpaTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 4]} />
            <Tooltip />
            <Area type="monotone" dataKey="gpa" stroke="#ff6fa5" fill="#ffd6e7" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ข้อมูลเพิ่มเติม */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7]">
          <h4 className="text-lg font-bold text-[#ff6fa5] mb-2">🏆 นักศึกษาดีเด่น</h4>
          <p className="text-2xl font-bold text-[#ff4d88]">{excellentStudents}</p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาที่มี GPA ≥ 3.75</p>
        </div>

        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7]">
          <h4 className="text-lg font-bold text-[#ff6fa5] mb-2">📈 อัตราการปรับปรุง</h4>
          <p className="text-2xl font-bold text-[#ff4d88]">+12%</p>
          <p className="text-sm text-[#ff4d88]">เทียบกับเดือนที่แล้ว</p>
        </div>

        <div className="bg-[#fff0f5] p-6 rounded-3xl border border-[#ffd6e7]">
          <h4 className="text-lg font-bold text-[#ff6fa5] mb-2">🎯 เป้าหมาย</h4>
          <p className="text-2xl font-bold text-[#ff4d88]">85%</p>
          <p className="text-sm text-[#ff4d88]">นักศึกษาที่มี GPA ≥ 3.0</p>
        </div>
      </div>
    </div>
  );
}