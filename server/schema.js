// Drizzle ORM Schema untuk SQL Mission
// Database schema untuk menyimpan progress pengguna

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tabel Users - menyimpan profil pengguna
export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    role: text('role').default('NETRUNNER_LVL_1'),
    isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
});

// Tabel Progress - menyimpan progress pembelajaran
export const progress = sqliteTable('progress', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id),
    totalPoints: integer('total_points').default(0),
    activeLessonId: integer('active_lesson_id').default(1),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Tabel CompletedLessons - menyimpan lessons yang sudah diselesaikan
export const completedLessons = sqliteTable('completed_lessons', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id),
    lessonId: integer('lesson_id').notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    pointsEarned: integer('points_earned').default(0),
});

// Tabel QueryHistory - menyimpan riwayat query (opsional)
export const queryHistory = sqliteTable('query_history', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id),
    lessonId: integer('lesson_id'),
    query: text('query').notNull(),
    isCorrect: integer('is_correct', { mode: 'boolean' }).default(false),
    executedAt: integer('executed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
