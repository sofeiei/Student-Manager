import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/attendance/report - รายงานสรุปการเข้าเรียน
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateFilter: any = {};

    if (startDate && endDate) {
      dateFilter.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // ดึงข้อมูลนักเรียนทั้งหมด
    const students = await prisma.student.findMany({
      include: {
        attendances: {
          where: dateFilter,
        },
      },
    });

    // คำนวณรายงานสำหรับนักเรียนแต่ละคน
    const report = students.map((student) => {
      const totalDays = student.attendances.length;
      const presentDays = student.attendances.filter((att) => att.status === "Present").length;
      const absentDays = totalDays - presentDays;
      const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        studentId: student.studentId,
        name: student.name,
        totalDays,
        presentDays,
        absentDays,
        attendanceRate: Math.round(attendanceRate * 100) / 100, // round to 2 decimal places
        gpa: student.gpa,
      };
    });

    // เรียงตามอัตราการเข้าเรียน (น้อยไปมาก)
    report.sort((a, b) => a.attendanceRate - b.attendanceRate);

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating attendance report:", error);
    return NextResponse.json({ error: "Failed to generate attendance report" }, { status: 500 });
  }
}