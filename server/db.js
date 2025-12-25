// Database connection setup dengan Drizzle ORM
// Supports both SQLite and PostgreSQL

import 'dotenv/config';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import Database from 'better-sqlite3';
import pg from 'pg';
import * as schema from './schema.js';

const { Pool } = pg;

// Database configuration
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'sqlite';

let db;
let dbClient;

if (DATABASE_TYPE === 'postgresql') {
  // PostgreSQL configuration
  const connectionConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      database: process.env.DATABASE_NAME || 'sql_mission',
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
    };

  dbClient = new Pool(connectionConfig);
  db = drizzlePg(dbClient, { schema });

  console.log(`📦 Database: PostgreSQL (${connectionConfig.host || 'via URL'}:${connectionConfig.port || ''}/${connectionConfig.database || ''})`);
} else {
  // SQLite configuration (default)
  const DATABASE_PATH = process.env.DATABASE_PATH || 'sql_mission.db';
  dbClient = new Database(DATABASE_PATH);
  dbClient.pragma('foreign_keys = ON');
  db = drizzleSqlite(dbClient, { schema });

  console.log(`📦 Database: SQLite (${DATABASE_PATH})`);
}

export { db, dbClient };

// Function untuk setup/migrate database
export const setupDatabase = async () => {
  if (DATABASE_TYPE === 'postgresql') {
    // PostgreSQL table creation
    await dbClient.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                display_name VARCHAR(255),
                avatar_url TEXT,
                role VARCHAR(50) DEFAULT 'NETRUNNER_LVL_1',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                total_points INTEGER DEFAULT 0,
                active_lesson_id INTEGER DEFAULT 1,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS completed_lessons (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                lesson_id INTEGER NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                points_earned INTEGER DEFAULT 0,
                UNIQUE(user_id, lesson_id)
            );

            CREATE TABLE IF NOT EXISTS query_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                lesson_id INTEGER,
                query TEXT NOT NULL,
                is_correct BOOLEAN DEFAULT FALSE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
            CREATE INDEX IF NOT EXISTS idx_completed_lessons_user ON completed_lessons(user_id);
            CREATE INDEX IF NOT EXISTS idx_query_history_user ON query_history(user_id);
        `);
  } else {
    // SQLite table creation
    dbClient.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                display_name TEXT,
                avatar_url TEXT,
                role TEXT DEFAULT 'NETRUNNER_LVL_1',
                is_admin INTEGER DEFAULT 0,
                created_at INTEGER,
                last_login_at INTEGER
            );

            CREATE TABLE IF NOT EXISTS progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                total_points INTEGER DEFAULT 0,
                active_lesson_id INTEGER DEFAULT 1,
                updated_at INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS completed_lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lesson_id INTEGER NOT NULL,
                completed_at INTEGER,
                points_earned INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, lesson_id)
            );

            CREATE TABLE IF NOT EXISTS query_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lesson_id INTEGER,
                query TEXT NOT NULL,
                is_correct INTEGER DEFAULT 0,
                executed_at INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
            CREATE INDEX IF NOT EXISTS idx_completed_lessons_user ON completed_lessons(user_id);
            CREATE INDEX IF NOT EXISTS idx_query_history_user ON query_history(user_id);
        `);
  }

  console.log('✅ Database setup selesai!');
};

export default db;
