// SQL Feedback Analyzer
// Menganalisis query pengguna dan membandingkan dengan query yang diharapkan
// Memberikan feedback detail tentang bagian yang benar dan yang perlu diperbaiki

/**
 * Tokenize SQL query menjadi komponen-komponen
 * @param {string} query - SQL query string
 * @returns {object} - Parsed components
 */
const tokenizeQuery = (query) => {
    const normalized = query.trim().replace(/\s+/g, ' ').toLowerCase();

    const result = {
        select: null,
        from: null,
        where: null,
        join: null,
        groupBy: null,
        having: null,
        orderBy: null,
        limit: null,
        original: query.trim()
    };

    // Extract SELECT clause
    const selectMatch = normalized.match(/select\s+(.+?)\s+from/i);
    if (selectMatch) {
        result.select = selectMatch[1].trim();
    }

    // Extract FROM clause
    const fromMatch = normalized.match(/from\s+(\w+)/i);
    if (fromMatch) {
        result.from = fromMatch[1].trim();
    }

    // Extract JOIN clause
    const joinMatch = normalized.match(/join\s+(\w+)\s+on\s+(.+?)(?=where|group|order|limit|having|$)/i);
    if (joinMatch) {
        result.join = {
            table: joinMatch[1].trim(),
            condition: joinMatch[2].trim()
        };
    }

    // Extract WHERE clause
    const whereMatch = normalized.match(/where\s+(.+?)(?=group|order|limit|having|$)/i);
    if (whereMatch) {
        result.where = whereMatch[1].trim();
    }

    // Extract GROUP BY clause
    const groupMatch = normalized.match(/group\s+by\s+(\w+)/i);
    if (groupMatch) {
        result.groupBy = groupMatch[1].trim();
    }

    // Extract HAVING clause
    const havingMatch = normalized.match(/having\s+(.+?)(?=order|limit|$)/i);
    if (havingMatch) {
        result.having = havingMatch[1].trim();
    }

    // Extract ORDER BY clause
    const orderMatch = normalized.match(/order\s+by\s+(\w+)\s*(asc|desc)?/i);
    if (orderMatch) {
        result.orderBy = {
            column: orderMatch[1].trim(),
            direction: orderMatch[2] ? orderMatch[2].trim() : 'asc'
        };
    }

    // Extract LIMIT clause
    const limitMatch = normalized.match(/limit\s+(\d+)/i);
    if (limitMatch) {
        result.limit = parseInt(limitMatch[1]);
    }

    return result;
};

/**
 * Bandingkan dua normalized strings
 */
const normalizeForComparison = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/\s+/g, '').replace(/['"]/g, '');
};

/**
 * Generate hint berdasarkan jenis kesalahan
 */
const generateHint = (part, expected, actual) => {
    const hints = {
        select: () => {
            if (!actual) return 'Tambahkan klausa SELECT dengan kolom yang diperlukan';
            if (expected === '*') return 'Gunakan * untuk mengambil semua kolom';
            return `Pilih kolom yang tepat: ${expected}`;
        },
        from: () => {
            if (!actual) return 'Tambahkan klausa FROM dengan nama tabel';
            return `Gunakan tabel '${expected}'`;
        },
        where: () => {
            if (!actual) return 'Tambahkan klausa WHERE untuk memfilter data';
            // Check for operator differences
            if (expected.includes('>=') && actual.includes('>') && !actual.includes('>=')) {
                return 'Gunakan >= (lebih besar atau sama dengan) bukan hanya >';
            }
            if (expected.includes('<=') && actual.includes('<') && !actual.includes('<=')) {
                return 'Gunakan <= (lebih kecil atau sama dengan) bukan hanya <';
            }
            return `Kondisi yang benar: WHERE ${expected}`;
        },
        orderBy: () => {
            if (!actual) return 'Tambahkan ORDER BY untuk mengurutkan hasil';
            return `Urutkan berdasarkan ${expected.column} ${expected.direction.toUpperCase()}`;
        },
        groupBy: () => {
            if (!actual) return 'Tambahkan GROUP BY untuk mengelompokkan data';
            return `Kelompokkan berdasarkan ${expected}`;
        },
        limit: () => {
            if (!actual) return 'Tambahkan LIMIT untuk membatasi jumlah hasil';
            return `Batasi hasil ke ${expected} baris`;
        },
        join: () => {
            if (!actual) return 'Tambahkan JOIN untuk menggabungkan tabel';
            return `JOIN dengan tabel ${expected.table} ON ${expected.condition}`;
        }
    };

    return hints[part] ? hints[part]() : 'Periksa kembali bagian ini';
};

/**
 * Analyze user query and compare with expected query
 * @param {string} userQuery - Query yang dimasukkan pengguna
 * @param {string} expectedQuery - Query yang diharapkan (dari lesson)
 * @returns {object} - Feedback object with correct/incorrect parts
 */
export const analyzeQuery = (userQuery, expectedQuery) => {
    if (!userQuery || !expectedQuery) {
        return {
            isCorrect: false,
            correctParts: [],
            incorrectParts: [],
            suggestions: ['Masukkan perintah SQL Anda']
        };
    }

    const userTokens = tokenizeQuery(userQuery);
    const expectedTokens = tokenizeQuery(expectedQuery);

    const correctParts = [];
    const incorrectParts = [];
    const suggestions = [];

    // Compare SELECT
    if (expectedTokens.select) {
        const userSelect = normalizeForComparison(userTokens.select);
        const expectedSelect = normalizeForComparison(expectedTokens.select);

        if (userSelect === expectedSelect) {
            correctParts.push({
                part: 'SELECT',
                value: userTokens.select || expectedTokens.select,
                message: '✓ Pemilihan kolom sudah benar'
            });
        } else if (!userTokens.select) {
            incorrectParts.push({
                part: 'SELECT',
                expected: expectedTokens.select,
                actual: null,
                message: '✗ Klausa SELECT tidak ditemukan',
                hint: generateHint('select', expectedTokens.select, null)
            });
        } else {
            incorrectParts.push({
                part: 'SELECT',
                expected: expectedTokens.select,
                actual: userTokens.select,
                message: '✗ Kolom yang dipilih salah',
                hint: generateHint('select', expectedTokens.select, userTokens.select)
            });
        }
    }

    // Compare FROM
    if (expectedTokens.from) {
        const userFrom = normalizeForComparison(userTokens.from);
        const expectedFrom = normalizeForComparison(expectedTokens.from);

        if (userFrom === expectedFrom) {
            correctParts.push({
                part: 'FROM',
                value: userTokens.from,
                message: '✓ Tabel sudah benar'
            });
        } else if (!userTokens.from) {
            incorrectParts.push({
                part: 'FROM',
                expected: expectedTokens.from,
                actual: null,
                message: '✗ Klausa FROM tidak ditemukan',
                hint: generateHint('from', expectedTokens.from, null)
            });
        } else {
            incorrectParts.push({
                part: 'FROM',
                expected: expectedTokens.from,
                actual: userTokens.from,
                message: '✗ Tabel yang digunakan salah',
                hint: generateHint('from', expectedTokens.from, userTokens.from)
            });
        }
    }

    // Compare WHERE
    if (expectedTokens.where) {
        const userWhere = normalizeForComparison(userTokens.where);
        const expectedWhere = normalizeForComparison(expectedTokens.where);

        if (userWhere === expectedWhere) {
            correctParts.push({
                part: 'WHERE',
                value: userTokens.where,
                message: '✓ Kondisi filter sudah benar'
            });
        } else if (!userTokens.where) {
            incorrectParts.push({
                part: 'WHERE',
                expected: expectedTokens.where,
                actual: null,
                message: '✗ Klausa WHERE tidak ditemukan',
                hint: generateHint('where', expectedTokens.where, null)
            });
        } else {
            incorrectParts.push({
                part: 'WHERE',
                expected: expectedTokens.where,
                actual: userTokens.where,
                message: '✗ Kondisi WHERE salah',
                hint: generateHint('where', expectedTokens.where, userTokens.where)
            });
        }
    } else if (userTokens.where) {
        // User added WHERE but it's not expected
        incorrectParts.push({
            part: 'WHERE',
            expected: null,
            actual: userTokens.where,
            message: '✗ WHERE tidak diperlukan untuk misi ini',
            hint: 'Hapus klausa WHERE dari query Anda'
        });
    }

    // Compare ORDER BY
    if (expectedTokens.orderBy) {
        const userOrder = userTokens.orderBy;
        const expectedOrder = expectedTokens.orderBy;

        if (userOrder &&
            normalizeForComparison(userOrder.column) === normalizeForComparison(expectedOrder.column) &&
            normalizeForComparison(userOrder.direction) === normalizeForComparison(expectedOrder.direction)) {
            correctParts.push({
                part: 'ORDER BY',
                value: `${userOrder.column} ${userOrder.direction.toUpperCase()}`,
                message: '✓ Pengurutan sudah benar'
            });
        } else if (!userOrder) {
            incorrectParts.push({
                part: 'ORDER BY',
                expected: `${expectedOrder.column} ${expectedOrder.direction}`,
                actual: null,
                message: '✗ ORDER BY tidak ditemukan',
                hint: generateHint('orderBy', expectedOrder, null)
            });
        } else {
            incorrectParts.push({
                part: 'ORDER BY',
                expected: `${expectedOrder.column} ${expectedOrder.direction}`,
                actual: `${userOrder.column} ${userOrder.direction}`,
                message: '✗ ORDER BY salah',
                hint: generateHint('orderBy', expectedOrder, userOrder)
            });
        }
    }

    // Compare GROUP BY
    if (expectedTokens.groupBy) {
        const userGroup = normalizeForComparison(userTokens.groupBy);
        const expectedGroup = normalizeForComparison(expectedTokens.groupBy);

        if (userGroup === expectedGroup) {
            correctParts.push({
                part: 'GROUP BY',
                value: userTokens.groupBy,
                message: '✓ Pengelompokan sudah benar'
            });
        } else if (!userTokens.groupBy) {
            incorrectParts.push({
                part: 'GROUP BY',
                expected: expectedTokens.groupBy,
                actual: null,
                message: '✗ GROUP BY tidak ditemukan',
                hint: generateHint('groupBy', expectedTokens.groupBy, null)
            });
        } else {
            incorrectParts.push({
                part: 'GROUP BY',
                expected: expectedTokens.groupBy,
                actual: userTokens.groupBy,
                message: '✗ GROUP BY salah',
                hint: generateHint('groupBy', expectedTokens.groupBy, userTokens.groupBy)
            });
        }
    }

    // Compare LIMIT
    if (expectedTokens.limit) {
        if (userTokens.limit === expectedTokens.limit) {
            correctParts.push({
                part: 'LIMIT',
                value: userTokens.limit,
                message: '✓ Batasan hasil sudah benar'
            });
        } else if (!userTokens.limit) {
            incorrectParts.push({
                part: 'LIMIT',
                expected: expectedTokens.limit,
                actual: null,
                message: '✗ LIMIT tidak ditemukan',
                hint: generateHint('limit', expectedTokens.limit, null)
            });
        } else {
            incorrectParts.push({
                part: 'LIMIT',
                expected: expectedTokens.limit,
                actual: userTokens.limit,
                message: '✗ Nilai LIMIT salah',
                hint: generateHint('limit', expectedTokens.limit, userTokens.limit)
            });
        }
    }

    // Generate overall suggestions
    if (incorrectParts.length > 0) {
        if (incorrectParts.length === 1) {
            suggestions.push(`Perbaiki bagian ${incorrectParts[0].part} pada query Anda`);
        } else {
            const parts = incorrectParts.map(p => p.part).join(', ');
            suggestions.push(`Perbaiki bagian: ${parts}`);
        }
    }

    const isCorrect = incorrectParts.length === 0 && correctParts.length > 0;

    return {
        isCorrect,
        correctParts,
        incorrectParts,
        suggestions,
        userQuery,
        expectedQuery
    };
};

export default { analyzeQuery };
