// Script untuk reset semua progress user
// Gunakan script ini setelah mengubah struktur lesson IDs

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { db, dbClient } from './db.js';
import { users, progress, completedLessons } from './schema.js';
import { eq } from 'drizzle-orm';

const DATABASE_TYPE = process.env.DATABASE_TYPE || 'sqlite';

async function resetAllProgress() {
  console.log('🔄 Memulai reset progress untuk semua user...\n');

  try {
    if (DATABASE_TYPE === 'postgresql') {
      // PostgreSQL: Hapus semua completed lessons
      const deletedLessons = await db.delete(completedLessons);
      console.log('✅ Semua completed lessons dihapus');

      // Reset semua progress ke default (lesson 1, points 0)
      const allUsers = await db.select().from(users);

      for (const user of allUsers) {
        await db.update(progress)
          .set({
            totalPoints: 0,
            activeLessonId: 1,
            updatedAt: new Date(),
          })
          .where(eq(progress.userId, user.id));

        console.log(`✅ Progress user "${user.username}" direset`);
      }
    } else {
      // SQLite
      db.delete(completedLessons).run();
      console.log('✅ Semua completed lessons dihapus');

      const allUsers = db.select().from(users).all();

      for (const user of allUsers) {
        db.update(progress)
          .set({
            totalPoints: 0,
            activeLessonId: 1,
            updatedAt: new Date(),
          })
          .where(eq(progress.userId, user.id))
          .run();

        console.log(`✅ Progress user "${user.username}" direset`);
      }
    }

    console.log('\n🎉 Reset selesai!');
    console.log('📋 Semua user sekarang kembali ke:');
    console.log('   - Active Lesson: 1 (Matriks Data)');
    console.log('   - Total Points: 0');
    console.log('   - Completed Lessons: []');
    console.log('\n💡 Tip: Minta user untuk:');
    console.log('   1. Logout dari aplikasi');
    console.log('   2. Clear browser cache (Ctrl+Shift+Delete)');
    console.log('   3. Login kembali');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAllProgress();
