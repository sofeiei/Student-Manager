# Building a Modern Student Management System with Next.js and Prisma

## Introduction

Managing student records can be a challenging task for educational institutions. In this article, I'll walk you through **Student Manager**, a full-stack web application built with modern technologies that streamlines student data management.

This system was built to demonstrate best practices in full-stack development, including TypeScript, API design, database management, and responsive UI implementation.

## What is Student Manager?

**Student Manager** is a web-based system that enables educational institutions to:

- ✅ Register and manage student records
- ✅ Track student academic performance (GPA)
- ✅ Maintain accurate student identification
- ✅ Provide a user-friendly Thai language interface
- ✅ Ensure data validation and integrity

## Tech Stack Overview

### Frontend Layer
- **Next.js 16**: React framework for production
- **React 19**: Latest UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling

### Backend Layer
- **Next.js API Routes**: Serverless backend
- **Prisma ORM**: Database abstraction layer
- **Zod**: Runtime schema validation

### Database Layer
- **SQLite**: Lightweight, file-based database
- Perfect for development and small-scale deployments

## System Architecture

### How It Works

```
User Interface (React) 
    ↓ HTTP Requests
API Routes (Next.js)
    ↓ ORM Queries
Prisma + Zod Validation
    ↓ SQL
SQLite Database
```

### Key Components

#### 1. **Frontend Pages**
- **Home Page**: Welcome screen with navigation
- **Student List**: Display all registered students
- **Add Form**: Create new student records
- **Edit Form**: Modify existing records

#### 2. **Backend API**
```
GET    /api/students        → Fetch all students
POST   /api/students        → Create new student
GET    /api/students/[id]   → Fetch specific student
PUT    /api/students/[id]   → Update student
DELETE /api/students/[id]   → Delete student
```

#### 3. **Database Schema**
```sql
Student {
  id        → Auto-incremented primary key
  studentId → Unique 10-digit identifier
  name      → Student full name
  gpa       → Grade point average (0.00-4.00)
  createdAt → Timestamp
}
```

## Data Validation Strategy

The system implements **multi-layer validation** using Zod:

```typescript
const studentSchema = z.object({
  studentId: z.string().length(10, "รหัสนักศึกษาต้องมี 10 หลัก"),
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  gpa: z.number().min(0).max(4, "เกรดสูงสุดคือ 4.00"),
});
```

### Validation Rules
- **Student ID**: Exactly 10 digits, must be unique
- **Name**: Minimum 2 characters
- **GPA**: Between 0.00 and 4.00

### Error Handling
The API provides detailed error messages:
- Invalid data format → 400 Bad Request
- Duplicate student ID → 400 Conflict
- Server errors → 500 Internal Server Error

## Getting Started: Installation Guide

### Prerequisites
```
Node.js 18+
npm or yarn
```

### Setup Instructions

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/student-manager.git
cd student-manager
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**
Create `.env.local`:
```
DATABASE_URL="file:./prisma/dev.db"
```

**4. Initialize database**
```bash
npx prisma migrate dev --name init
```

**5. Run development server**
```bash
npm run dev
```

**6. Open browser**
Navigate to `http://localhost:3000`

## Key Features Explained

### Feature 1: Real-time Validation

The form validates input as users type, providing immediate feedback:

```typescript
// Client-side validation
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  validateField(name, value);
};
```

### Feature 2: Responsive Design

Built with Tailwind CSS for seamless experience across devices:

```typescript
<div className="flex flex-col md:flex-row">
  {/* Mobile: stacked, Desktop: side-by-side */}
</div>
```

### Feature 3: Thai Language Support

Complete interface in Thai language with proper error messages:

```
ระบบจัดการนักศึกษา (Student Management System)
รหัสนักศึกษา (Student ID)
เกรดเฉลี่ย (GPA)
```

### Feature 4: Efficient Data Fetching

Students list is sorted by creation date (newest first):

```typescript
const students = await prisma.student.findMany({ 
  orderBy: { createdAt: 'desc' } 
});
```

## API Usage Examples

### Example 1: Add a New Student

**Request:**
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "6631234567",
    "name": "สมชาย ดีเด่น",
    "gpa": 3.85
  }'
```

**Response:**
```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "studentId": "6631234567",
    "name": "สมชาย ดีเด่น",
    "gpa": 3.85,
    "createdAt": "2026-04-19T10:30:00Z"
  }
}
```

### Example 2: Fetch All Students

**Request:**
```bash
curl http://localhost:3000/api/students
```

**Response:**
```json
[
  {
    "id": 1,
    "studentId": "6631234567",
    "name": "สมชาย ดีเด่น",
    "gpa": 3.85,
    "createdAt": "2026-04-19T10:30:00Z"
  },
  {
    "id": 2,
    "studentId": "6631234568",
    "name": "นางสมหญิง แจ่มใส",
    "gpa": 3.75,
    "createdAt": "2026-04-19T11:00:00Z"
  }
]
```

## Best Practices Implemented

### 1. **Type Safety**
- Full TypeScript implementation
- Zod runtime validation
- No `any` types

### 2. **Error Handling**
- Try-catch blocks on all API routes
- Specific error messages
- Proper HTTP status codes

### 3. **Database Design**
- Unique constraints on student ID
- Timestamp tracking
- Optimized queries

### 4. **Code Organization**
- Separation of concerns
- Reusable components
- Clear file structure

### 5. **User Experience**
- Responsive design
- Thai language support
- Clear navigation
- Real-time feedback

## Deployment Considerations

### For Small Scale (Local/Testing)
- SQLite is perfect
- Easy setup
- No external dependencies

### For Production
Consider these upgrades:
```typescript
// Switch to PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Production Checklist
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Error logging enabled
- [ ] Rate limiting implemented
- [ ] CORS configured
- [ ] SSL/HTTPS enabled

## Troubleshooting Common Issues

### Issue: Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: Database Connection Error
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Issue: Module Not Found
```bash
npm install
npm run dev
```

## What's Next?

### Potential Enhancements

1. **Authentication**: Add user login with NextAuth
2. **File Export**: Export student records to CSV/PDF
3. **Search & Filter**: Advanced student search
4. **Pagination**: Handle large datasets
5. **Analytics**: Student statistics dashboard
6. **Bulk Operations**: Import multiple students
7. **Notifications**: Email notifications for admins

## Conclusion

**Student Manager** demonstrates how modern web technologies can solve real-world problems efficiently. The combination of Next.js, Prisma, and TypeScript provides a robust foundation for building scalable applications.

### Key Takeaways
- ✅ Next.js enables full-stack development in one framework
- ✅ Prisma simplifies database management with type safety
- ✅ TypeScript prevents runtime errors during development
- ✅ Zod provides runtime validation for data integrity
- ✅ Tailwind CSS enables rapid, responsive UI development

### Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Validation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## About the Author

This Student Manager system was built as a demonstration project to showcase modern full-stack development practices using Next.js, Prisma, and TypeScript.

### GitHub Repository
[student-manager](https://github.com/yourusername/student-manager)

---

**Questions or suggestions?** Feel free to open an issue on GitHub or reach out on social media.

Happy coding! 🚀
