-- Reset semua progress user ke default
-- Jalankan script ini setelah mengubah struktur lesson IDs

-- Hapus semua completed lessons
DELETE FROM completed_lessons;

-- Reset semua progress ke lesson 1 dengan 0 points
UPDATE progress
SET
  total_points = 0,
  active_lesson_id = 1,
  updated_at = NOW();

-- Tampilkan hasil
SELECT
  u.username,
  p.total_points,
  p.active_lesson_id,
  (SELECT COUNT(*) FROM completed_lessons WHERE user_id = u.id) as completed_count
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
ORDER BY u.username;
