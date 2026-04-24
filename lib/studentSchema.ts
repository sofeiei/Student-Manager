import { z } from "zod";

export const studentSchema = z.object({
  studentId: z.string().length(10, "รหัสนักศึกษาต้องมี 10 หลัก"),
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  gpa: z.preprocess((value) => {
    if (typeof value === "string") {
      return parseFloat(value);
    }
    return value;
  }, z.number().min(0, "เกรดต้องไม่ต่ำกว่า 0.00").max(4, "เกรดสูงสุดคือ 4.00")),
  image: z.string().optional(),
});

export type StudentForm = z.infer<typeof studentSchema>;
