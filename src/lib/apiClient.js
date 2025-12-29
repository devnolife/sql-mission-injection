// API Client untuk berkomunikasi dengan backend
// Menggabungkan localStorage fallback dengan API sync

// Gunakan relative path agar bisa di-proxy oleh Vite (dev) atau Nginx (prod)
const API_BASE_URL = '/api';

// Storage keys untuk localStorage fallback
const STORAGE_KEYS = {
  USER_ID: 'sql_master_user_id',
  USER_DATA: 'sql_master_user_data',
  COMPLETED_LESSONS: 'sql_master_completed_lessons',
  USER_POINTS: 'sql_master_user_points',
  ACTIVE_LESSON: 'sql_master_active_lesson',
};

// ========== Helper Functions ==========
const isServerAvailable = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

// ========== User API ==========
export const loginUser = async (username, password) => {
  try {
    const serverUp = await isServerAvailable();

    if (serverUp) {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Cache user data locally
        localStorage.setItem(STORAGE_KEYS.USER_ID, data.user.id);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
        return { success: true, user: data.user, online: true };
      } else {
        // Return error from server
        return { success: false, error: data.error || 'Login gagal', online: true };
      }
    }

    // Server tidak tersedia
    return { success: false, error: 'Server tidak tersedia. Hubungi admin.', online: false };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Terjadi kesalahan saat login' };
  }
};

// Register user baru (untuk admin)
export const registerUser = async (username, password, displayName, isAdmin = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, displayName, isAdmin }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || 'Registrasi gagal' };
    }
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Terjadi kesalahan saat registrasi' };
  }
};

// Get list of all users (untuk admin)
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const data = await response.json();

    if (response.ok) {
      return { success: true, users: data.users };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Get users error:', error);
    return { success: false, error: 'Gagal mengambil daftar users' };
  }
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const getUserId = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
};

// ========== Progress API ==========
export const loadProgress = async () => {
  const userId = getUserId();

  try {
    const serverUp = await isServerAvailable();

    if (serverUp && userId && !userId.startsWith('local_')) {
      const response = await fetch(`${API_BASE_URL}/progress/${userId}`);

      if (response.ok) {
        const data = await response.json();
        // Cache locally
        localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(data.progress.completedLessons));
        localStorage.setItem(STORAGE_KEYS.USER_POINTS, data.progress.totalPoints);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_LESSON, data.progress.activeLessonId);

        return {
          completedLessons: new Set(data.progress.completedLessons),
          userPoints: data.progress.totalPoints,
          activeLessonId: data.progress.activeLessonId,
          online: true,
        };
      }
    }

    // Fallback ke localStorage
    return loadProgressFromLocal();
  } catch (error) {
    console.error('Load progress error:', error);
    return loadProgressFromLocal();
  }
};

const loadProgressFromLocal = () => {
  const completedData = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
  const pointsData = localStorage.getItem(STORAGE_KEYS.USER_POINTS);
  const activeLessonData = localStorage.getItem(STORAGE_KEYS.ACTIVE_LESSON);

  return {
    completedLessons: completedData ? new Set(JSON.parse(completedData)) : new Set(),
    userPoints: pointsData ? parseInt(pointsData) : 0,
    activeLessonId: activeLessonData ? parseInt(activeLessonData) : 1,
    online: false,
  };
};

export const saveProgress = async (completedLessons, userPoints, activeLessonId) => {
  const userId = getUserId();

  // Always save locally first
  localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(Array.from(completedLessons)));
  localStorage.setItem(STORAGE_KEYS.USER_POINTS, userPoints);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_LESSON, activeLessonId);

  try {
    const serverUp = await isServerAvailable();

    if (serverUp && userId && !userId.startsWith('local_')) {
      await fetch(`${API_BASE_URL}/progress/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPoints: userPoints,
          activeLessonId,
          completedLessonsList: Array.from(completedLessons),
        }),
      });

      return { success: true, online: true };
    }

    return { success: true, online: false };
  } catch (error) {
    console.error('Save progress error:', error);
    return { success: true, online: false }; // Still saved locally
  }
};

export const completeLesson = async (lessonId, pointsEarned) => {
  const userId = getUserId();

  try {
    const serverUp = await isServerAvailable();

    if (serverUp && userId && !userId.startsWith('local_')) {
      await fetch(`${API_BASE_URL}/progress/${userId}/complete/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointsEarned }),
      });

      return { success: true, online: true };
    }

    return { success: true, online: false };
  } catch (error) {
    console.error('Complete lesson error:', error);
    return { success: true, online: false };
  }
};

export const resetProgress = async () => {
  const userId = getUserId();

  // Clear local storage
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
  localStorage.removeItem(STORAGE_KEYS.USER_POINTS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_LESSON);

  try {
    const serverUp = await isServerAvailable();

    if (serverUp && userId && !userId.startsWith('local_')) {
      await fetch(`${API_BASE_URL}/progress/${userId}`, {
        method: 'DELETE',
      });

      return { success: true, online: true };
    }

    return { success: true, online: false };
  } catch (error) {
    console.error('Reset progress error:', error);
    return { success: true, online: false };
  }
};

// ========== Query History API ==========
export const logQuery = async (lessonId, query, isCorrect) => {
  const userId = getUserId();

  try {
    const serverUp = await isServerAvailable();

    if (serverUp && userId && !userId.startsWith('local_')) {
      await fetch(`${API_BASE_URL}/queries/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, query, isCorrect }),
      });
    }
  } catch (error) {
    // Silently fail query logging
    console.debug('Query log error:', error);
  }
};

// ========== Admin Functions ==========
// Reset user progress (untuk admin)
export const resetUserProgress = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Gagal reset progress' };
    }
  } catch (error) {
    console.error('Reset user progress error:', error);
    return { success: false, error: 'Terjadi kesalahan saat reset progress' };
  }
};

// Reset user password (untuk admin)
export const resetUserPassword = async (userId, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, newPassword: data.newPassword };
    } else {
      return { success: false, error: data.error || 'Gagal reset password' };
    }
  } catch (error) {
    console.error('Reset user password error:', error);
    return { success: false, error: 'Terjadi kesalahan saat reset password' };
  }
};

// ========== Connection Status ==========
export const checkConnection = async () => {
  return await isServerAvailable();
};

export default {
  loginUser,
  getCurrentUser,
  getUserId,
  loadProgress,
  saveProgress,
  completeLesson,
  resetProgress,
  logQuery,
  checkConnection,
  getAllUsers,
  registerUser,
  resetUserProgress,
  resetUserPassword,
};
