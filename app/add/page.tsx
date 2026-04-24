"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentSchema } from "@/lib/studentSchema";

export default function AddStudent() {
  const router = useRouter();
  const [formData, setFormData] = useState({ studentId: "", name: "", gpa: "", image: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = studentSchema.safeParse({
      ...formData,
      gpa: formData.gpa,
      image: formData.image || undefined,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      console.log("API Response:", data);

      if (res.ok) {
        alert("บันทึกข้อมูลสำเร็จ!");
        router.push("/students");
      } else {
        setError(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#f5f0ff] p-8 rounded-3xl shadow-xl border border-[#e9d5ff] mt-10 relative animate-fade-in">
      <h2 className="text-3xl font-extrabold text-[#5b21b6] mb-8 text-center animate-bounce-in">เพิ่มข้อมูลนักศึกษา</h2>
      
      {error && (
        <div className="bg-[#f8d5ff] text-[#6d28d9] p-4 rounded-2xl mb-6 text-sm font-bold text-center border border-[#d8b4fe] animate-shake">
          * {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-slide-up">
        <div>
          <label className="text-sm font-bold text-[#ff6fa5] ml-2">รหัสนักศึกษา</label>
          <input 
            type="text" 
            placeholder="รหัสนักศึกษา"
            maxLength={10}
            className="w-full p-4 bg-white rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-[#ff6fa5] transition-all border border-[#ffd6e7]" 
            value={formData.studentId} 
            onChange={(e) => setFormData({...formData, studentId: e.target.value.replace(/\D/g, "")})} 
          />
        </div>
        
        <div>
          <label className="text-sm font-bold text-[#ff6fa5] ml-2">ชื่อ-นามสกุล</label>
          <input 
            type="text" 
            placeholder="ชื่อ-นามสกุล"
            className="w-full p-4 bg-white rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-[#ff6fa5] transition-all border border-[#ffd6e7]" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#ff6fa5] ml-2">เกรดเฉลี่ย (GPA)</label>
          <input 
            type="number" 
            step="0.01" 
            placeholder="เช่น 3.50"
            className="w-full p-4 bg-white rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-[#ff6fa5] transition-all border border-[#ffd6e7]" 
            value={formData.gpa} 
            onChange={(e) => setFormData({...formData, gpa: e.target.value})} 
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#ff6fa5] ml-2">รูปโปรไฟล์ (ไม่บังคับ)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-4 bg-white rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-[#ff6fa5] transition-all border border-[#ffd6e7]" 
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-full border-2 border-[#ff6fa5]" />
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            type="button" 
            onClick={() => router.push("/")}
            className="flex-1 bg-[#ede9fe] text-[#5b21b6] font-bold py-4 rounded-2xl hover:bg-[#d8b4fe] transition-all border border-[#c4b5fd]"
          >
            ยกเลิก
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`flex-1 text-white font-bold py-4 rounded-2xl shadow-lg transition-all ${
              isLoading ? "bg-[#7c3aed]" : "bg-[#8b5cf6] hover:bg-[#7c3aed] active:scale-[0.98]"
            }`}
          >
            {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
}