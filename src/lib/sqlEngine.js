// SQL Engine dengan dukungan GROUP BY, HAVING, INSERT, UPDATE, DELETE
// Untuk pembelajaran SQL interaktif dalam Bahasa Indonesia

export const initialData = {
    users: [
        { id: 1, name: "Alice", age: 28, job: "Engineer", department: "IT", salary: 7500000 },
        { id: 2, name: "Bob", age: 34, job: "Designer", department: "Creative", salary: 6000000 },
        { id: 3, name: "Charlie", age: 22, job: "Engineer", department: "IT", salary: 5500000 },
        { id: 4, name: "David", age: 45, job: "Manager", department: "IT", salary: 12000000 },
        { id: 5, name: "Eve", age: 29, job: "Engineer", department: "IT", salary: 8000000 },
        { id: 6, name: "Frank", age: 31, job: "Designer", department: "Creative", salary: 6500000 },
        { id: 7, name: "Grace", age: 26, job: "Analyst", department: "Finance", salary: 7000000 },
        { id: 8, name: "Hank", age: 38, job: "Manager", department: "Finance", salary: 11000000 },
    ],
    products: [
        { id: 101, name: "Laptop", price: 15000000, stock: 50, category: "Electronics" },
        { id: 102, name: "Mouse", price: 250000, stock: 200, category: "Electronics" },
        { id: 103, name: "Keyboard", price: 800000, stock: 150, category: "Electronics" },
        { id: 104, name: "Monitor", price: 3500000, stock: 80, category: "Electronics" },
        { id: 105, name: "Headphones", price: 1500000, stock: 60, category: "Electronics" },
        { id: 106, name: "Webcam", price: 900000, stock: 40, category: "Electronics" },
        { id: 107, name: "Meja Kerja", price: 2000000, stock: 30, category: "Furniture" },
        { id: 108, name: "Kursi Gaming", price: 3000000, stock: 25, category: "Furniture" },
    ],
    orders: [
        { id: 1001, user_id: 1, product_id: 101, quantity: 1, date: "2023-01-15", status: "completed" },
        { id: 1002, user_id: 2, product_id: 102, quantity: 2, date: "2023-01-16", status: "completed" },
        { id: 1003, user_id: 1, product_id: 105, quantity: 1, date: "2023-01-17", status: "pending" },
        { id: 1004, user_id: 3, product_id: 103, quantity: 1, date: "2023-01-18", status: "completed" },
        { id: 1005, user_id: 2, product_id: 104, quantity: 2, date: "2023-01-19", status: "completed" },
        { id: 1006, user_id: 4, product_id: 101, quantity: 1, date: "2023-01-20", status: "pending" },
        { id: 1007, user_id: 5, product_id: 107, quantity: 1, date: "2023-01-21", status: "completed" },
        { id: 1008, user_id: 1, product_id: 108, quantity: 1, date: "2023-01-22", status: "completed" },
    ]
};

// Menyimpan state untuk INSERT/UPDATE/DELETE (simulasi)
let tempData = JSON.parse(JSON.stringify(initialData));

export const resetData = () => {
    tempData = JSON.parse(JSON.stringify(initialData));
};

export const getData = () => tempData;

export const executeQuery = (query, data) => {
    const lowerQuery = query.toLowerCase().trim();
    const originalQuery = query.trim();

    // Gunakan tempData untuk simulasi perubahan data
    const workingData = tempData;

    // ========== INSERT INTO ==========
    if (lowerQuery.startsWith("insert into")) {
        const insertMatch = lowerQuery.match(/insert\s+into\s+(\w+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
        if (insertMatch) {
            const tableName = insertMatch[1];
            const columns = insertMatch[2].split(",").map(c => c.trim());
            const valuesRaw = insertMatch[3];

            // Parse values dengan mempertahankan string
            const values = valuesRaw.split(",").map(v => {
                v = v.trim();
                if (v.startsWith("'") && v.endsWith("'")) {
                    return v.slice(1, -1);
                }
                return isNaN(v) ? v : parseFloat(v);
            });

            if (workingData[tableName]) {
                const newRow = { id: Math.max(...workingData[tableName].map(r => r.id)) + 1 };
                columns.forEach((col, i) => {
                    newRow[col] = values[i];
                });
                workingData[tableName].push(newRow);

                return {
                    data: [newRow],
                    tableName,
                    columns: Object.keys(newRow),
                    explanation: `Berhasil menambahkan 1 baris ke tabel ${tableName}. ID baru: ${newRow.id}`,
                    animationState: [{ id: newRow.id, status: 'new' }],
                    isModification: true
                };
            }
        }
        return { error: "Sintaks INSERT tidak valid. Contoh: INSERT INTO users (name, age) VALUES ('John', 25)" };
    }

    // ========== UPDATE ==========
    if (lowerQuery.startsWith("update")) {
        const updateMatch = lowerQuery.match(/update\s+(\w+)\s+set\s+(.+?)\s+where\s+(.+)/i);
        if (updateMatch) {
            const tableName = updateMatch[1];
            const setClause = updateMatch[2];
            const whereClause = updateMatch[3];

            if (workingData[tableName]) {
                // Parse SET clause
                const setPairs = setClause.split(",").map(pair => {
                    const [col, val] = pair.split("=").map(s => s.trim());
                    let parsedVal = val;
                    if (val.startsWith("'") && val.endsWith("'")) {
                        parsedVal = val.slice(1, -1);
                    } else if (!isNaN(val)) {
                        parsedVal = parseFloat(val);
                    }
                    return { col, val: parsedVal };
                });

                // Parse WHERE clause (simple: column = value)
                const whereMatch = whereClause.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/);
                if (whereMatch) {
                    const whereCol = whereMatch[1];
                    let whereVal = whereMatch[2];
                    if (!isNaN(whereVal)) whereVal = parseFloat(whereVal);

                    let updatedCount = 0;
                    const updatedRows = [];

                    workingData[tableName].forEach(row => {
                        const rowVal = typeof row[whereCol] === 'number' ? row[whereCol] : String(row[whereCol]).toLowerCase();
                        const compareVal = typeof whereVal === 'number' ? whereVal : String(whereVal).toLowerCase();

                        if (rowVal === compareVal) {
                            setPairs.forEach(({ col, val }) => {
                                row[col] = val;
                            });
                            updatedCount++;
                            updatedRows.push(row);
                        }
                    });

                    return {
                        data: updatedRows,
                        tableName,
                        columns: updatedRows.length > 0 ? Object.keys(updatedRows[0]) : [],
                        explanation: `Berhasil mengubah ${updatedCount} baris di tabel ${tableName}.`,
                        animationState: updatedRows.map(r => ({ id: r.id, status: 'updated' })),
                        isModification: true
                    };
                }
            }
        }
        return { error: "Sintaks UPDATE tidak valid. Contoh: UPDATE users SET age = 30 WHERE name = 'Alice'" };
    }

    // ========== DELETE ==========
    if (lowerQuery.startsWith("delete")) {
        const deleteMatch = lowerQuery.match(/delete\s+from\s+(\w+)\s+where\s+(.+)/i);
        if (deleteMatch) {
            const tableName = deleteMatch[1];
            const whereClause = deleteMatch[2];

            if (workingData[tableName]) {
                const whereMatch = whereClause.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/);
                if (whereMatch) {
                    const whereCol = whereMatch[1];
                    let whereVal = whereMatch[2];
                    if (!isNaN(whereVal)) whereVal = parseFloat(whereVal);

                    const originalLength = workingData[tableName].length;
                    const deletedRows = workingData[tableName].filter(row => {
                        const rowVal = typeof row[whereCol] === 'number' ? row[whereCol] : String(row[whereCol]).toLowerCase();
                        const compareVal = typeof whereVal === 'number' ? whereVal : String(whereVal).toLowerCase();
                        return rowVal === compareVal;
                    });

                    workingData[tableName] = workingData[tableName].filter(row => {
                        const rowVal = typeof row[whereCol] === 'number' ? row[whereCol] : String(row[whereCol]).toLowerCase();
                        const compareVal = typeof whereVal === 'number' ? whereVal : String(whereVal).toLowerCase();
                        return rowVal !== compareVal;
                    });

                    const deletedCount = originalLength - workingData[tableName].length;

                    return {
                        data: deletedRows,
                        tableName,
                        columns: deletedRows.length > 0 ? Object.keys(deletedRows[0]) : [],
                        explanation: `Berhasil menghapus ${deletedCount} baris dari tabel ${tableName}.`,
                        animationState: deletedRows.map(r => ({ id: r.id, status: 'deleted' })),
                        isModification: true
                    };
                }
            }
        }
        return { error: "Sintaks DELETE tidak valid. Contoh: DELETE FROM users WHERE id = 1" };
    }

    // ========== SELECT QUERY ==========
    let tableName = null;
    if (lowerQuery.includes("from users")) tableName = "users";
    else if (lowerQuery.includes("from products")) tableName = "products";
    else if (lowerQuery.includes("from orders")) tableName = "orders";

    if (!tableName) {
        return { error: "Tabel tidak ditemukan. Coba: SELECT * FROM users" };
    }

    let results = [...workingData[tableName]];
    let explanation = "";

    // ========== JOIN Logic ==========
    if (lowerQuery.includes("join")) {
        const joinPart = lowerQuery.split("join")[1].split("on")[0].trim();

        let joinTable = null;
        if (joinPart.includes("users")) joinTable = "users";
        else if (joinPart.includes("products")) joinTable = "products";
        else if (joinPart.includes("orders")) joinTable = "orders";

        if (joinTable) {
            const joinedResults = [];
            results.forEach(mainRow => {
                workingData[joinTable].forEach(joinRow => {
                    let match = false;
                    if (tableName === "orders" && joinTable === "users") {
                        match = mainRow.user_id === joinRow.id;
                    } else if (tableName === "orders" && joinTable === "products") {
                        match = mainRow.product_id === joinRow.id;
                    } else if (tableName === "users" && joinTable === "orders") {
                        match = mainRow.id === joinRow.user_id;
                    }

                    if (match) {
                        const mergedRow = { ...mainRow };
                        Object.keys(joinRow).forEach(key => {
                            if (key !== 'id') {
                                mergedRow[`${joinTable}.${key}`] = joinRow[key];
                            }
                        });
                        mergedRow._joined = true;
                        joinedResults.push(mergedRow);
                    }
                });
            });
            results = joinedResults;
            explanation = `Menggabungkan ${tableName} dengan ${joinTable}. Hasil: ${results.length} baris.`;
        }
    }

    // ========== WHERE Clause ==========
    if (lowerQuery.includes("where") && !lowerQuery.includes("group by")) {
        let wherePart = lowerQuery.split("where")[1];
        wherePart = wherePart.split("group by")[0].split("order by")[0].split("limit")[0].trim();

        // Subquery: WHERE col IN (SELECT ...)
        if (wherePart.includes("in (select")) {
            const subQueryMatch = wherePart.match(/in \((select.+)\)/);
            if (subQueryMatch) {
                const subQuery = subQueryMatch[1];
                const colToCheck = wherePart.split("in")[0].trim();
                const subResult = executeQuery(subQuery, data);
                const subKey = subResult.columns[0];
                const subValues = subResult.data.map(r => r[subKey]);
                results = results.filter(row => subValues.includes(row[colToCheck]));
                explanation = `Filter dengan subquery pada ${colToCheck}. Ditemukan ${results.length} baris.`;
            }
        } else {
            // Support >= dan <=
            const gteMatch = wherePart.match(/(\w+)\s*>=\s*(\d+)/);
            const lteMatch = wherePart.match(/(\w+)\s*<=\s*(\d+)/);
            const gtMatch = wherePart.match(/(\w+)\s*>\s*(\d+)/);
            const ltMatch = wherePart.match(/(\w+)\s*<\s*(\d+)/);
            const eqMatch = wherePart.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/);

            if (gteMatch) {
                const [_, col, val] = gteMatch;
                results = results.filter(row => row[col] >= parseInt(val));
                explanation = `Filter: ${col} >= ${val}. Ditemukan ${results.length} baris.`;
            } else if (lteMatch) {
                const [_, col, val] = lteMatch;
                results = results.filter(row => row[col] <= parseInt(val));
                explanation = `Filter: ${col} <= ${val}. Ditemukan ${results.length} baris.`;
            } else if (gtMatch) {
                const [_, col, val] = gtMatch;
                results = results.filter(row => row[col] > parseInt(val));
                explanation = `Filter: ${col} > ${val}. Ditemukan ${results.length} baris.`;
            } else if (ltMatch) {
                const [_, col, val] = ltMatch;
                results = results.filter(row => row[col] < parseInt(val));
                explanation = `Filter: ${col} < ${val}. Ditemukan ${results.length} baris.`;
            } else if (eqMatch) {
                const [_, col, val] = eqMatch;
                results = results.filter(row => {
                    if (typeof row[col] === 'number') return row[col] === parseInt(val);
                    return String(row[col]).toLowerCase() === val.toLowerCase();
                });
                explanation = `Filter: ${col} = '${val}'. Ditemukan ${results.length} baris.`;
            }
        }
    }

    // ========== GROUP BY with HAVING ==========
    const selectPart = lowerQuery.split("from")[0].replace("select", "").trim();

    if (lowerQuery.includes("group by")) {
        let groupByPart = lowerQuery.split("group by")[1];
        groupByPart = groupByPart.split("having")[0].split("order by")[0].split("limit")[0].trim();
        const groupByCol = groupByPart.trim();

        // Group the results
        const groups = {};
        results.forEach(row => {
            const key = row[groupByCol];
            if (!groups[key]) groups[key] = [];
            groups[key].push(row);
        });

        // Parse aggregations from SELECT
        const countMatch = selectPart.match(/count\s*\(\s*\*?\s*\)/i);
        const sumMatch = selectPart.match(/sum\s*\(\s*(\w+)\s*\)/i);
        const avgMatch = selectPart.match(/avg\s*\(\s*(\w+)\s*\)/i);
        const maxMatch = selectPart.match(/max\s*\(\s*(\w+)\s*\)/i);
        const minMatch = selectPart.match(/min\s*\(\s*(\w+)\s*\)/i);

        let groupedResults = Object.entries(groups).map(([key, rows]) => {
            const result = { [groupByCol]: key };

            if (countMatch) {
                result['COUNT(*)'] = rows.length;
            }
            if (sumMatch) {
                const col = sumMatch[1];
                result[`SUM(${col})`] = rows.reduce((acc, r) => acc + (parseFloat(r[col]) || 0), 0);
            }
            if (avgMatch) {
                const col = avgMatch[1];
                const sum = rows.reduce((acc, r) => acc + (parseFloat(r[col]) || 0), 0);
                result[`AVG(${col})`] = (sum / rows.length).toFixed(2);
            }
            if (maxMatch) {
                const col = maxMatch[1];
                result[`MAX(${col})`] = Math.max(...rows.map(r => parseFloat(r[col]) || 0));
            }
            if (minMatch) {
                const col = minMatch[1];
                result[`MIN(${col})`] = Math.min(...rows.map(r => parseFloat(r[col]) || 0));
            }

            return result;
        });

        // ========== HAVING Clause ==========
        if (lowerQuery.includes("having")) {
            let havingPart = lowerQuery.split("having")[1];
            havingPart = havingPart.split("order by")[0].split("limit")[0].trim();

            const havingGtMatch = havingPart.match(/count\s*\(\s*\*?\s*\)\s*>\s*(\d+)/i);
            const havingGteMatch = havingPart.match(/count\s*\(\s*\*?\s*\)\s*>=\s*(\d+)/i);
            const havingLtMatch = havingPart.match(/count\s*\(\s*\*?\s*\)\s*<\s*(\d+)/i);
            const havingLteMatch = havingPart.match(/count\s*\(\s*\*?\s*\)\s*<=\s*(\d+)/i);
            const havingSumGtMatch = havingPart.match(/sum\s*\(\s*(\w+)\s*\)\s*>\s*(\d+)/i);

            if (havingGteMatch) {
                const val = parseInt(havingGteMatch[1]);
                groupedResults = groupedResults.filter(r => r['COUNT(*)'] >= val);
            } else if (havingGtMatch) {
                const val = parseInt(havingGtMatch[1]);
                groupedResults = groupedResults.filter(r => r['COUNT(*)'] > val);
            } else if (havingLteMatch) {
                const val = parseInt(havingLteMatch[1]);
                groupedResults = groupedResults.filter(r => r['COUNT(*)'] <= val);
            } else if (havingLtMatch) {
                const val = parseInt(havingLtMatch[1]);
                groupedResults = groupedResults.filter(r => r['COUNT(*)'] < val);
            } else if (havingSumGtMatch) {
                const col = havingSumGtMatch[1];
                const val = parseInt(havingSumGtMatch[2]);
                groupedResults = groupedResults.filter(r => r[`SUM(${col})`] > val);
            }
        }

        results = groupedResults;
        const selectedColumns = results.length > 0 ? Object.keys(results[0]) : [groupByCol];
        explanation = `Data dikelompokkan berdasarkan ${groupByCol}. Hasil: ${results.length} grup.`;

        return {
            data: results,
            tableName,
            columns: selectedColumns,
            explanation,
            animationState: workingData[tableName].map(row => ({
                id: row.id,
                status: 'keep'
            }))
        };
    }

    // ========== ORDER BY Clause ==========
    if (lowerQuery.includes("order by")) {
        let orderPart = lowerQuery.split("order by")[1].split("limit")[0].trim();
        const [col, dir] = orderPart.split(/\s+/);
        const isDesc = dir && dir.toLowerCase() === 'desc';

        results.sort((a, b) => {
            if (a[col] < b[col]) return isDesc ? 1 : -1;
            if (a[col] > b[col]) return isDesc ? -1 : 1;
            return 0;
        });
        explanation = `Data diurutkan berdasarkan ${col} ${isDesc ? 'menurun' : 'menaik'}.`;
    }

    // ========== LIMIT Clause ==========
    if (lowerQuery.includes("limit")) {
        const limitPart = lowerQuery.split("limit")[1].trim();
        const limit = parseInt(limitPart);
        if (!isNaN(limit)) {
            results = results.slice(0, limit);
            explanation += ` Dibatasi ke ${limit} baris.`;
        }
    }

    // ========== SELECT Columns & Aggregations ==========
    let selectedColumns = [];

    // Check for aggregations (without GROUP BY)
    const countMatch = selectPart.match(/count\s*\(\s*\*?\s*\)/i);
    const sumMatch = selectPart.match(/sum\s*\(\s*(\w+)\s*\)/i);
    const avgMatch = selectPart.match(/avg\s*\(\s*(\w+)\s*\)/i);
    const maxMatch = selectPart.match(/max\s*\(\s*(\w+)\s*\)/i);
    const minMatch = selectPart.match(/min\s*\(\s*(\w+)\s*\)/i);

    if (countMatch && !lowerQuery.includes("group by")) {
        const countVal = results.length;
        results = [{ "COUNT(*)": countVal }];
        selectedColumns = ["COUNT(*)"];
        explanation = `Menghitung total baris: ${countVal}.`;
    } else if (sumMatch && !lowerQuery.includes("group by")) {
        const col = sumMatch[1].trim();
        const sumVal = results.reduce((acc, row) => acc + (parseFloat(row[col]) || 0), 0);
        results = [{ [`SUM(${col})`]: sumVal }];
        selectedColumns = [`SUM(${col})`];
        explanation = `Menghitung total ${col}: ${sumVal}.`;
    } else if (avgMatch && !lowerQuery.includes("group by")) {
        const col = avgMatch[1].trim();
        const sumVal = results.reduce((acc, row) => acc + (parseFloat(row[col]) || 0), 0);
        const avgVal = results.length ? (sumVal / results.length).toFixed(2) : 0;
        results = [{ [`AVG(${col})`]: avgVal }];
        selectedColumns = [`AVG(${col})`];
        explanation = `Menghitung rata-rata ${col}: ${avgVal}.`;
    } else if (maxMatch && !lowerQuery.includes("group by")) {
        const col = maxMatch[1].trim();
        const maxVal = Math.max(...results.map(r => parseFloat(r[col]) || 0));
        const maxRow = results.find(r => parseFloat(r[col]) === maxVal);
        results = [{ [`MAX(${col})`]: maxVal }];
        selectedColumns = [`MAX(${col})`];
        explanation = `Menemukan nilai maksimum ${col}: ${maxVal}.`;
    } else if (minMatch && !lowerQuery.includes("group by")) {
        const col = minMatch[1].trim();
        const minVal = Math.min(...results.map(r => parseFloat(r[col]) || 0));
        results = [{ [`MIN(${col})`]: minVal }];
        selectedColumns = [`MIN(${col})`];
        explanation = `Menemukan nilai minimum ${col}: ${minVal}.`;
    } else {
        // Normal Select
        if (selectPart === "*") {
            if (results.length > 0) {
                selectedColumns = Object.keys(results[0]).filter(k => k !== '_joined');
            } else {
                selectedColumns = Object.keys(workingData[tableName][0]);
            }
        } else {
            selectedColumns = selectPart.split(",").map(c => c.trim());
        }
        if (!explanation) explanation = `Menampilkan ${results.length} baris dari tabel ${tableName}.`;
    }

    const resultIds = new Set(results.map(r => r.id));

    return {
        data: results,
        tableName,
        columns: selectedColumns,
        explanation,
        animationState: workingData[tableName].map(row => ({
            id: row.id,
            status: resultIds.has(row.id) ? 'keep' : 'filter'
        }))
    };
};
