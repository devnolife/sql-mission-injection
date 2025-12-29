// Express API Server untuk SQL Mission
// Backend untuk menyimpan dan mengambil progress pengguna

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { db, setupDatabase } from './db.js';
import { users, progress, completedLessons, queryHistory } from './schema.js';
import { eq, and } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Allow semua origin untuk development (akses dari IP jaringan lokal)
// Middleware - Allow origin spesifik
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://lab-if.tech',
  'http://lab-if.tech'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      // Opsional: Untuk development, kita bisa allow semua jika perlu
      // return callback(null, true); 
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Setup database on start
setupDatabase();

// ==================== USER ENDPOINTS ====================

// POST - Register user baru (admin membuat akun mahasiswa)
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, password, displayName, isAdmin } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password diperlukan' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password minimal 4 karakter' });
    }

    // Cek apakah username sudah ada
    const existing = await db.select().from(users).where(eq(users.username, username));
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Buat user baru
    const result = await db.insert(users).values({
      username,
      passwordHash,
      displayName: displayName || username,
      isAdmin: isAdmin || false,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }).returning();

    // Buat progress entry untuk user baru
    await db.insert(progress).values({
      userId: result[0].id,
      totalPoints: 0,
      activeLessonId: 1,
      updatedAt: new Date(),
    });

    console.log(`✅ User baru dibuat: ${username}`);

    res.json({
      success: true,
      user: {
        id: result[0].id,
        username: result[0].username,
        displayName: result[0].displayName,
        isAdmin: result[0].isAdmin,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Gagal membuat akun' });
  }
});

// POST - Login dengan password
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password diperlukan' });
    }

    // Cari user
    const userResult = await db.select().from(users).where(eq(users.username, username));

    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Username tidak ditemukan' });
    }

    const user = userResult[0];

    // Verifikasi password
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Password salah' });
    }

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    console.log(`🔐 Login berhasil: ${username}`);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Gagal login' });
  }
});

// GET - List semua users (untuk admin)
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
    }).from(users);

    // Ambil progress untuk setiap user
    const usersWithProgress = await Promise.all(allUsers.map(async (user) => {
      const userProgressResult = await db.select().from(progress).where(eq(progress.userId, user.id));
      const userProgress = userProgressResult[0];
      const completed = await db.select().from(completedLessons).where(eq(completedLessons.userId, user.id));

      return {
        ...user,
        totalPoints: userProgress?.totalPoints || 0,
        completedLessons: completed.length,
        activeLessonId: userProgress?.activeLessonId || 1,
      };
    }));

    res.json({ success: true, users: usersWithProgress });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Gagal mengambil daftar users' });
  }
});

// ==================== PROGRESS ENDPOINTS ====================

// GET - Ambil progress user
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Ambil progress
    const userProgressResult = await db.select().from(progress).where(eq(progress.userId, userId));
    const userProgress = userProgressResult[0];

    // Ambil completed lessons
    const completed = await db.select().from(completedLessons).where(eq(completedLessons.userId, userId));

    if (!userProgress) {
      return res.status(404).json({ error: 'Progress tidak ditemukan' });
    }

    res.json({
      success: true,
      progress: {
        totalPoints: userProgress.totalPoints,
        activeLessonId: userProgress.activeLessonId,
        completedLessons: completed.map(c => c.lessonId),
        updatedAt: userProgress.updatedAt,
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Gagal mengambil progress' });
  }
});

// POST - Simpan/update progress
app.post('/api/progress/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { totalPoints, activeLessonId, completedLessonsList } = req.body;

    // Update progress
    await db.update(progress)
      .set({
        totalPoints,
        activeLessonId,
        updatedAt: new Date(),
      })
      .where(eq(progress.userId, userId));

    // Sync completed lessons jika ada
    if (completedLessonsList && Array.isArray(completedLessonsList)) {
      for (const lessonId of completedLessonsList) {
        // Check if already exists
        const existingResult = await db.select()
          .from(completedLessons)
          .where(and(
            eq(completedLessons.userId, userId),
            eq(completedLessons.lessonId, lessonId)
          ));

        if (existingResult.length === 0) {
          await db.insert(completedLessons).values({
            userId,
            lessonId,
            completedAt: new Date(),
          });
        }
      }
    }

    res.json({ success: true, message: 'Progress tersimpan' });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Gagal menyimpan progress' });
  }
});

// POST - Mark lesson sebagai completed
app.post('/api/progress/:userId/complete/:lessonId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const lessonId = parseInt(req.params.lessonId);
    const { pointsEarned } = req.body;

    // Check if already completed
    const existingResult = await db.select()
      .from(completedLessons)
      .where(and(
        eq(completedLessons.userId, userId),
        eq(completedLessons.lessonId, lessonId)
      ));

    if (existingResult.length === 0) {
      // Insert completed lesson
      await db.insert(completedLessons).values({
        userId,
        lessonId,
        pointsEarned: pointsEarned || 0,
        completedAt: new Date(),
      });

      // Update total points
      const currentProgressResult = await db.select().from(progress).where(eq(progress.userId, userId));
      const currentProgress = currentProgressResult[0];
      if (currentProgress) {
        await db.update(progress)
          .set({
            totalPoints: currentProgress.totalPoints + (pointsEarned || 0),
            activeLessonId: lessonId + 1,
            updatedAt: new Date(),
          })
          .where(eq(progress.userId, userId));
      }
    }

    res.json({ success: true, message: 'Lesson selesai' });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ error: 'Gagal menyelesaikan lesson' });
  }
});

// DELETE - Reset progress user
app.delete('/api/progress/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Delete completed lessons
    await db.delete(completedLessons).where(eq(completedLessons.userId, userId));

    // Reset progress
    await db.update(progress)
      .set({
        totalPoints: 0,
        activeLessonId: 1,
        updatedAt: new Date(),
      })
      .where(eq(progress.userId, userId));

    res.json({ success: true, message: 'Progress direset' });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({ error: 'Gagal reset progress' });
  }
});

// ==================== QUERY HISTORY ENDPOINTS ====================

// POST - Log query
app.post('/api/queries/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { lessonId, query, isCorrect } = req.body;

    await db.insert(queryHistory).values({
      userId,
      lessonId,
      query,
      isCorrect,
      executedAt: new Date(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Log query error:', error);
    res.status(500).json({ error: 'Gagal menyimpan query' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server - listen di semua network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
  console.log(`📡 Akses dari jaringan lokal: http://<IP-ADDRESS>:${PORT}`);
});
