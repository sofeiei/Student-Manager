import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/attendance - ดูรายการ attendance ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const studentId = searchParams.get("studentId");

    let where: any = {};

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (studentId) {
      where.studentId = studentId;
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        student: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json({ error: "Failed to fetch attendances" }, { status: 500 });
  }
}

// POST /api/attendance - บันทึก attendance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, date, status } = body;

    if (!studentId || !date || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["Present", "Absent"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be 'Present' or 'Absent'" }, { status: 400 });
    }

    // ตรวจสอบว่ามีนักเรียนคนนี้หรือไม่
    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const attendanceDate = new Date(date);

    // สร้างหรืออัปเดต attendance
    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date: attendanceDate,
        },
      },
      update: {
        status,
      },
      create: {
        studentId,
        date: attendanceDate,
        status,
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error creating attendance:", error);
    return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 });
  }
}