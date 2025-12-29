// Drizzle ORM Schema untuk SQL Mission
// Database schema untuk menyimpan progress pengguna

import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Tabel Users - menyimpan profil pengguna
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull().default(''),
    displayName: varchar('display_name', { length: 255 }),
    avatarUrl: text('avatar_url'),
    role: varchar('role', { length: 50 }).default('NETRUNNER_LVL_1'),
    isAdmin: boolean('is_admin').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    lastLoginAt: timestamp('last_login_at').defaultNow(),
});

// Tabel Progress - menyimpan progress pembelajaran
export const progress = pgTable('progress', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    totalPoints: integer('total_points').default(0),
    activeLessonId: integer('active_lesson_id').default(1),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabel CompletedLessons - menyimpan lessons yang sudah diselesaikan
export const completedLessons = pgTable('completed_lessons', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id').notNull(),
    completedAt: timestamp('completed_at').defaultNow(),
    pointsEarned: integer('points_earned').default(0),
});

// Tabel QueryHistory - menyimpan riwayat query (opsional)
export const queryHistory = pgTable('query_history', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id'),
    query: text('query').notNull(),
    isCorrect: boolean('is_correct').default(false),
    executedAt: timestamp('executed_at').defaultNow(),
});
