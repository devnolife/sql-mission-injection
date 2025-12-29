# Rencana Migrasi: Drizzle + SQLite → Prisma + PostgreSQL

## Tujuan
Memigrasikan backend dari Drizzle ORM dengan SQLite ke Prisma dengan PostgreSQL untuk stabilitas dan kemudahan pengelolaan database yang lebih baik.

---

## Langkah-Langkah Implementasi

### 1. Install Dependencies Prisma
- Menghapus dependencies Drizzle yang tidak diperlukan
- Install `prisma` dan `@prisma/client`

### 2. Buat Prisma Schema (`prisma/schema.prisma`)
- Definisikan model User, Progress, CompletedLesson, dan QueryHistory
- Konfigurasi datasource ke PostgreSQL

### 3. Setup Environment Variables
- Update `.env` dengan `DATABASE_URL` untuk PostgreSQL

### 4. Update Server Code (`server/index.js`)
- Ganti Drizzle queries dengan Prisma Client
- Hapus import Drizzle schema
- Update semua endpoints untuk menggunakan Prisma

### 5. Hapus File Drizzle yang Tidak Diperlukan
- `server/db.js` (akan diganti dengan Prisma client)
- `server/schema.js` (akan diganti dengan Prisma schema)
- File `.db` SQLite

### 6. Generate Prisma Client & Migrate Database
- Jalankan `npx prisma generate`
- Jalankan `npx prisma db push` atau `npx prisma migrate dev`

---

## Struktur Database (Prisma Schema)

```prisma
model User {
  id           Int       @id @default(autoincrement())
  username     String    @unique
  passwordHash String    @map("password_hash")
  displayName  String?   @map("display_name")
  avatarUrl    String?   @map("avatar_url")
  role         String    @default("NETRUNNER_LVL_1")
  isAdmin      Boolean   @default(false) @map("is_admin")
  createdAt    DateTime  @default(now()) @map("created_at")
  lastLoginAt  DateTime? @map("last_login_at")

  progress         Progress?
  completedLessons CompletedLesson[]
  queryHistory     QueryHistory[]

  @@map("users")
}

model Progress {
  id             Int      @id @default(autoincrement())
  userId         Int      @unique @map("user_id")
  totalPoints    Int      @default(0) @map("total_points")
  activeLessonId Int      @default(1) @map("active_lesson_id")
  updatedAt      DateTime @default(now()) @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("progress")
}

model CompletedLesson {
  id           Int      @id @default(autoincrement())
  userId       Int      @map("user_id")
  lessonId     Int      @map("lesson_id")
  completedAt  DateTime @default(now()) @map("completed_at")
  pointsEarned Int      @default(0) @map("points_earned")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("completed_lessons")
}

model QueryHistory {
  id         Int      @id @default(autoincrement())
  userId     Int      @map("user_id")
  lessonId   Int?     @map("lesson_id")
  query      String
  isCorrect  Boolean  @default(false) @map("is_correct")
  executedAt DateTime @default(now()) @map("executed_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("query_history")
}
```

---

## Perkiraan Waktu
- Total: ~15-20 menit

## Risiko
- Perlu PostgreSQL yang sudah running (local atau remote)
- Data di SQLite lama akan hilang (perlu migrasi data jika diperlukan)

---

## Status: PENDING_APPROVAL
Menunggu persetujuan user untuk melanjutkan implementasi.
