# Student Manager System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [User Guide](#user-guide)
3. [System Architecture](#system-architecture)
4. [Technical Documentation](#technical-documentation)
5. [Installation & Setup](#installation--setup)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## System Overview

### What is Student Manager?

**Student Manager** is a modern web application designed to efficiently manage student records. It provides a user-friendly interface for educational institutions to add, view, edit, and manage student information including identification numbers, names, and academic performance (GPA).

### Key Features

✅ **View Student List** - Display all registered students with their information  
✅ **Add New Students** - Register new students with validation  
✅ **Edit Student Data** - Update existing student records  
✅ **Real-time Validation** - Immediate feedback on data entry  
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices  
✅ **Thai Language Support** - Complete interface in Thai language  
✅ **Data Persistence** - Secure database storage with SQLite  

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Backend** | Next.js API Routes |
| **Database** | SQLite with Prisma ORM |
| **Validation** | Zod |
| **Styling** | Tailwind CSS 4 |
| **Build Tool** | Next.js 16 |

---

## User Guide

### Getting Started

#### 1. **Accessing the System**
   - Open your web browser
   - Navigate to `http://localhost:3000`
   - You'll see the Student Manager home page with Thai interface

#### 2. **Home Page**
   The home page displays:
   - Welcome message: "ระบบจัดการนักศึกษา" (Student Management System)
   - Subtitle: "รองรับการเพิ่มและดูรายชื่อนักศึกษา" (Supports adding and viewing student lists)
   - Two action buttons:
     - **ดูรายชื่อทั้งหมด** (View All Students) - Blue button
     - **เริ่มเพิ่มข้อมูล** (Start Adding Data) - Blue primary button

### Using the Application

#### **View Student List**
1. Click "ดูรายชื่อทั้งหมด" on the home page
2. The system displays all registered students
3. Information shown for each student:
   - Student ID (รหัสนักศึกษา)
   - Full Name (ชื่อ-สกุล)
   - GPA (เกรดเฉลี่ย)
   - Registration Date (วันที่ลงทะเบียน)
4. Click on any student to edit their information

#### **Add a New Student**
1. Click "เริ่มเพิ่มข้อมูล" on the home page or navigate to `/add`
2. Fill in the required fields:
   - **Student ID** (รหัสนักศึกษา): Exactly 10 digits
   - **Name** (ชื่อ-สกุล): Minimum 2 characters
   - **GPA** (เกรดเฉลี่ย): Between 0.00 and 4.00
3. Click the submit button
4. If successful, you'll see a confirmation message
5. The new student appears in the student list

#### **Edit Student Information**
1. Go to the student list page
2. Click on a student record or the edit button
3. Modify the desired information
4. Click update/save button
5. Changes are saved immediately

### Validation Rules

The system enforces these rules to ensure data quality:

| Field | Rules |
|-------|-------|
| **Student ID** | Must be exactly 10 digits, must be unique |
| **Name** | Minimum 2 characters, no special characters |
| **GPA** | Must be between 0.00 and 4.00 |

### Error Messages (Thai)

- **"รหัสนักศึกษาต้องมี 10 หลัก"** - Student ID must be 10 digits
- **"ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"** - Name must have at least 2 characters
- **"เกรดต้องไม่ต่ำกว่า 0.00"** - GPA cannot be below 0.00
- **"เกรดสูงสุดคือ 4.00"** - Maximum GPA is 4.00
- **"รหัสนักศึกษานี้มีในระบบแล้ว"** - This student ID already exists

---

## System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                  Browser/Client                  │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────────────────────────────────────┐  │
│  │       Next.js Frontend (React 19)        │  │
│  │  - Home Page (page.tsx)                 │  │
│  │  - Students List (students/page.tsx)    │  │
│  │  - Add Form (add/page.tsx)              │  │
│  │  - Edit Form (edit/[id]/page.tsx)       │  │
│  └──────────────────────────────────────────┘  │
│                       ↓                          │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────────────────────────────────────┐  │
│  │    Next.js API Routes (Backend)          │  │
│  │  - GET /api/students                    │  │
│  │  - POST /api/students                   │  │
│  │  - GET /api/students/[id]              │  │
│  │  - PUT /api/students/[id]              │  │
│  │  - DELETE /api/students/[id]           │  │
│  └──────────────────────────────────────────┘  │
│                       ↓                          │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────────────────────────────────────┐  │
│  │   Prisma ORM & Validation                │  │
│  │  - Zod Schema Validation                │  │
│  │  - Data Type Checking                   │  │
│  │  - Constraint Validation                │  │
│  └──────────────────────────────────────────┘  │
│                       ↓                          │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────────────────────────────────────┐  │
│  │        SQLite Database                    │  │
│  │  - Student Model                         │  │
│  │  - Persistent Storage                    │  │
│  │  - dev.db (Development)                  │  │
│  └──────────────────────────────────────────┘  │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Data Flow

**Creating a New Student:**
```
User Input → Validation → API POST → Prisma → SQLite → Confirmation
```

**Fetching Students:**
```
Page Load → API GET → Prisma Query → SQLite Read → UI Display
```

### Project Structure

```
student-manager/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # App layout wrapper
│   ├── globals.css              # Global styles
│   ├── api/
│   │   └── students/
│   │       ├── route.ts         # GET/POST endpoints
│   │       └── [id]/
│   │           └── route.ts     # GET/PUT/DELETE endpoints
│   ├── students/
│   │   └── page.tsx             # Students list page
│   ├── add/
│   │   └── page.tsx             # Add student form
│   └── edit/
│       └── [id]/
│           └── page.tsx         # Edit student form
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── dev.db                   # SQLite database
├── public/                      # Static files
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind config
└── eslint.config.mjs            # ESLint config
```

---

## Technical Documentation

### Database Schema

#### Student Model

```prisma
model Student {
  id        Int      @id @default(autoincrement())
  studentId String   @unique
  name      String
  gpa       Float
  createdAt DateTime @default(now())
}
```

**Fields:**
- `id`: Auto-incrementing primary key
- `studentId`: Unique 10-digit identifier
- `name`: Student full name
- `gpa`: Grade Point Average (0.00 - 4.00)
- `createdAt`: Timestamp of record creation

### API Endpoints

#### GET /api/students
Fetches all students, ordered by newest first.

**Response:**
```json
[
  {
    "id": 1,
    "studentId": "6631234567",
    "name": "สมชาย ดีเด่น",
    "gpa": 3.85,
    "createdAt": "2026-04-19T10:30:00Z"
  }
]
```

#### POST /api/students
Creates a new student record.

**Request Body:**
```json
{
  "studentId": "6631234567",
  "name": "สมชาย ดีเด่น",
  "gpa": 3.85
}
```

**Success Response (201):**
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

#### GET /api/students/[id]
Fetches a specific student by ID.

**Response:**
```json
{
  "id": 1,
  "studentId": "6631234567",
  "name": "สมชาย ดีเด่น",
  "gpa": 3.85,
  "createdAt": "2026-04-19T10:30:00Z"
}
```

#### PUT /api/students/[id]
Updates an existing student record.

**Request Body:**
```json
{
  "studentId": "6631234567",
  "name": "สมชาย ดีเด่น",
  "gpa": 3.90
}
```

#### DELETE /api/students/[id]
Deletes a student record.

---

## Installation & Setup

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn** package manager
- **Git**: For version control

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/student-manager.git
cd student-manager
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Configure Environment
Create a `.env.local` file in the root directory:
```
DATABASE_URL="file:./prisma/dev.db"
```

#### 4. Set Up Database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

#### 6. Access the Application
Open browser and go to: `http://localhost:3000`

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## API Reference

### Error Handling

All errors follow this format:

```json
{
  "error": "ชื่อของข้อผิดพลาด"
}
```

### Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request successful | Get students list |
| 201 | Created - Resource created | New student added |
| 400 | Bad Request - Invalid data | Wrong student ID format |
| 404 | Not Found - Resource not found | Student ID doesn't exist |
| 500 | Server Error | Database connection failed |

### Request/Response Examples

#### Example 1: Add Student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "6631234567",
    "name": "นางสมหญิง แจ่มใส",
    "gpa": 3.75
  }'
```

#### Example 2: Get All Students
```bash
curl http://localhost:3000/api/students
```

#### Example 3: Update Student
```bash
curl -X PUT http://localhost:3000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "6631234567",
    "name": "นางสมหญิง แจ่มใส",
    "gpa": 3.90
  }'
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Database Connection Error
**Problem**: "Error: SQLITE_CANTOPEN: unable to open database file"

**Solution**:
1. Check if `prisma/dev.db` exists
2. Ensure DATABASE_URL is set in `.env.local`
3. Run: `npx prisma migrate dev --name init`

#### Issue 2: Port 3000 Already in Use
**Problem**: "Error: listen EADDRINUSE: address already in use :::3000"

**Solution**:
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

#### Issue 3: Module Not Found
**Problem**: "Cannot find module '@prisma/client'"

**Solution**:
```bash
npm install
npx prisma generate
```

#### Issue 4: Validation Error on Add Student
**Problem**: "เกรดต้องไม่ต่ำกว่า 0.00"

**Solution**:
- Ensure GPA is between 0.00 and 4.00
- Check that all fields are filled correctly

#### Issue 5: Duplicate Student ID
**Problem**: "รหัสนักศึกษานี้มีในระบบแล้ว"

**Solution**:
- Use a different, unique Student ID (10 digits)
- Remove the existing student if updating

### Getting More Help

1. Check the GitHub Issues page
2. Review the README.md
3. Enable debug logging:
   ```bash
   DEBUG=* npm run dev
   ```

---

## Development Tips

### Running Tests
```bash
npm run lint
```

### Formatting Code
```bash
npx prettier --write .
```

### Database Management

**View Data:**
```bash
npx prisma studio
```

**Reset Database:**
```bash
npx prisma migrate reset
```

### Performance Optimization

- Use Prisma query optimization
- Cache API responses with Next.js revalidation
- Implement pagination for large datasets

---

## Version Information

- **Application Version**: 0.1.0
- **Next.js**: 16.2.2
- **React**: 19.2.4
- **Prisma**: 5.22.0
- **Node.js**: 18+ required

---

## License

This project is provided as-is for educational purposes.

---

## Support & Contact

For questions or support, please refer to the project documentation or contact the development team.

---

**Last Updated**: April 19, 2026  
**Documentation Version**: 1.0
