// Seed script untuk SQL Mission
// Membuat akun admin dan beberapa akun mahasiswa untuk testing

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import bcrypt from 'bcryptjs';
import { db, dbClient, setupDatabase } from './db.js';
import { users, progress } from './schema.js';

const DATABASE_TYPE = process.env.DATABASE_TYPE || 'sqlite';

const seedUsers = [
    {
        username: 'admin',
        password: 'admin123',
        displayName: 'Administrator',
        isAdmin: true,
        role: 'SYSTEM_ADMIN'
    },
    {
        username: 'dosen',
        password: 'dosen123',
        displayName: 'Dosen Pembimbing',
        isAdmin: true,
        role: 'INSTRUCTOR'
    },
    {
        username: 'mahasiswa1',
        password: 'mhs123',
        displayName: 'Budi Santoso',
        isAdmin: false,
        role: 'NETRUNNER_LVL_1'
    },
    {
        username: 'mahasiswa2',
        password: 'mhs123',
        displayName: 'Ani Wijaya',
        isAdmin: false,
        role: 'NETRUNNER_LVL_1'
    },
    {
        username: 'mahasiswa3',
        password: 'mhs123',
        displayName: 'Citra Dewi',
        isAdmin: false,
        role: 'NETRUNNER_LVL_1'
    }
];

async function seed() {
    console.log('🌱 Memulai seed database...\n');

    // Setup tables first
    await setupDatabase();

    if (DATABASE_TYPE === 'postgresql') {
        // PostgreSQL seeding
        for (const user of seedUsers) {
            try {
                const passwordHash = await bcrypt.hash(user.password, 10);

                // Check if user exists
                const existing = await dbClient.query(
                    'SELECT id FROM users WHERE username = $1',
                    [user.username]
                );

                if (existing.rows.length > 0) {
                    console.log(`⏭️  User "${user.username}" sudah ada, skip...`);
                    continue;
                }

                // Insert user
                const result = await dbClient.query(
                    `INSERT INTO users (username, password_hash, display_name, is_admin, role, created_at, last_login_at) 
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
           RETURNING id`,
                    [user.username, passwordHash, user.displayName, user.isAdmin, user.role]
                );

                const userId = result.rows[0].id;

                // Create progress entry
                await dbClient.query(
                    `INSERT INTO progress (user_id, total_points, active_lesson_id, updated_at) 
           VALUES ($1, 0, 1, NOW())`,
                    [userId]
                );

                console.log(`✅ User "${user.username}" berhasil dibuat (ID: ${userId})`);
            } catch (error) {
                console.error(`❌ Gagal membuat user "${user.username}":`, error.message);
            }
        }
    } else {
        // SQLite seeding
        for (const user of seedUsers) {
            try {
                const passwordHash = await bcrypt.hash(user.password, 10);

                // Check if user exists
                const existing = db.select().from(users).where(eq(users.username, user.username)).get();

                if (existing) {
                    console.log(`⏭️  User "${user.username}" sudah ada, skip...`);
                    continue;
                }

                // Insert user
                const result = db.insert(users).values({
                    username: user.username,
                    passwordHash,
                    displayName: user.displayName,
                    isAdmin: user.isAdmin,
                    role: user.role,
                    createdAt: new Date(),
                    lastLoginAt: new Date(),
                }).returning().get();

                // Create progress entry
                db.insert(progress).values({
                    userId: result.id,
                    totalPoints: 0,
                    activeLessonId: 1,
                    updatedAt: new Date(),
                }).run();

                console.log(`✅ User "${user.username}" berhasil dibuat (ID: ${result.id})`);
            } catch (error) {
                console.error(`❌ Gagal membuat user "${user.username}":`, error.message);
            }
        }
    }

    console.log('\n🎉 Seed selesai!');
    console.log('\n📋 Akun yang tersedia:');
    console.log('┌─────────────────┬─────────────┬─────────────────┐');
    console.log('│ Username        │ Password    │ Role            │');
    console.log('├─────────────────┼─────────────┼─────────────────┤');
    seedUsers.forEach(u => {
        console.log(`│ ${u.username.padEnd(15)} │ ${u.password.padEnd(11)} │ ${u.role.padEnd(15)} │`);
    });
    console.log('└─────────────────┴─────────────┴─────────────────┘');

    process.exit(0);
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
