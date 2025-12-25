// Progress Store - Mengelola penyimpanan progress pengguna
// Menggunakan localStorage untuk persistensi data di browser

const STORAGE_KEYS = {
    USER_PROFILE: 'sql_master_user_profile',
    COMPLETED_LESSONS: 'sql_master_completed_lessons',
    USER_POINTS: 'sql_master_user_points',
    ACTIVE_LESSON: 'sql_master_active_lesson',
    LAST_PLAYED: 'sql_master_last_played',
    TOTAL_PLAY_TIME: 'sql_master_total_play_time',
};

// ========== User Profile ==========
export const saveUserProfile = (profile) => {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
        return true;
    } catch (error) {
        console.error('Gagal menyimpan profil:', error);
        return false;
    }
};

export const loadUserProfile = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Gagal memuat profil:', error);
        return null;
    }
};

// ========== Completed Lessons ==========
export const saveCompletedLessons = (lessonsSet) => {
    try {
        // Convert Set to Array for JSON serialization
        const lessonsArray = Array.from(lessonsSet);
        localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(lessonsArray));
        return true;
    } catch (error) {
        console.error('Gagal menyimpan progress lessons:', error);
        return false;
    }
};

export const loadCompletedLessons = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
        if (data) {
            const lessonsArray = JSON.parse(data);
            return new Set(lessonsArray);
        }
        return new Set();
    } catch (error) {
        console.error('Gagal memuat progress lessons:', error);
        return new Set();
    }
};

// ========== User Points ==========
export const saveUserPoints = (points) => {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_POINTS, JSON.stringify(points));
        return true;
    } catch (error) {
        console.error('Gagal menyimpan poin:', error);
        return false;
    }
};

export const loadUserPoints = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.USER_POINTS);
        return data ? JSON.parse(data) : 0;
    } catch (error) {
        console.error('Gagal memuat poin:', error);
        return 0;
    }
};

// ========== Active Lesson ==========
export const saveActiveLesson = (lessonId) => {
    try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_LESSON, JSON.stringify(lessonId));
        return true;
    } catch (error) {
        console.error('Gagal menyimpan active lesson:', error);
        return false;
    }
};

export const loadActiveLesson = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_LESSON);
        return data ? JSON.parse(data) : 1;
    } catch (error) {
        console.error('Gagal memuat active lesson:', error);
        return 1;
    }
};

// ========== Last Played Timestamp ==========
export const saveLastPlayed = () => {
    try {
        localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, JSON.stringify(Date.now()));
        return true;
    } catch (error) {
        console.error('Gagal menyimpan timestamp:', error);
        return false;
    }
};

export const loadLastPlayed = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Gagal memuat timestamp:', error);
        return null;
    }
};

// ========== All Progress (Combined) ==========
export const saveAllProgress = (progress) => {
    const { completedLessons, userPoints, activeLessonId, userProfile } = progress;

    saveCompletedLessons(completedLessons);
    saveUserPoints(userPoints);
    saveActiveLesson(activeLessonId);
    saveLastPlayed();

    if (userProfile) {
        saveUserProfile(userProfile);
    }

    console.log('✅ Progress tersimpan!');
    return true;
};

export const loadAllProgress = () => {
    return {
        completedLessons: loadCompletedLessons(),
        userPoints: loadUserPoints(),
        activeLessonId: loadActiveLesson(),
        userProfile: loadUserProfile(),
        lastPlayed: loadLastPlayed(),
    };
};

// ========== Reset Progress ==========
export const resetAllProgress = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('🗑️ Progress direset!');
        return true;
    } catch (error) {
        console.error('Gagal reset progress:', error);
        return false;
    }
};

// ========== Check if Progress Exists ==========
export const hasExistingProgress = () => {
    return localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS) !== null;
};

// ========== Get Progress Summary (for display) ==========
export const getProgressSummary = () => {
    const completed = loadCompletedLessons();
    const points = loadUserPoints();
    const lastPlayed = loadLastPlayed();

    let lastPlayedText = 'Belum pernah bermain';
    if (lastPlayed) {
        const date = new Date(lastPlayed);
        lastPlayedText = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return {
        completedCount: completed.size,
        totalPoints: points,
        lastPlayedText,
        hasProgress: completed.size > 0
    };
};

export default {
    saveUserProfile,
    loadUserProfile,
    saveCompletedLessons,
    loadCompletedLessons,
    saveUserPoints,
    loadUserPoints,
    saveActiveLesson,
    loadActiveLesson,
    saveLastPlayed,
    loadLastPlayed,
    saveAllProgress,
    loadAllProgress,
    resetAllProgress,
    hasExistingProgress,
    getProgressSummary,
};
