import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const studentSchema = z.object({
  studentId: z.string().length(10, "รหัสนักศึกษาต้องมี 10 หลัก"),
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  gpa: z.number().min(0, "เกรดต้องไม่ต่ำกว่า 0.00").max(4, "เกรดสูงสุดคือ 4.00"),
});
export async function GET() {
  try {
    const students = await prisma.student.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = studentSchema.parse(body);
    const newStudent = await prisma.student.create({
      data: validatedData,
    });
    return NextResponse.json({ message: "Success", data: newStudent });

    } 
    catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors[0].message }, 
        { status: 400 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "รหัสนักศึกษานี้มีในระบบแล้ว" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
  }
}