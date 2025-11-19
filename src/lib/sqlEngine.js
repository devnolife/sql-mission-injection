// Simple mock SQL engine for demonstration

export const initialData = {
    users: [
        { id: 1, name: "Alice", age: 28, role: "Admin" },
        { id: 2, name: "Bob", age: 34, role: "User" },
        { id: 3, name: "Charlie", age: 22, role: "User" },
        { id: 4, name: "David", age: 45, role: "Manager" },
        { id: 5, name: "Eve", age: 29, role: "User" },
        { id: 6, name: "Frank", age: 31, role: "User" },
        { id: 7, name: "Grace", age: 26, role: "Admin" },
        { id: 8, name: "Hank", age: 38, role: "User" },
    ],
    products: [
        { id: 101, name: "Laptop", price: 1200, stock: 50 },
        { id: 102, name: "Mouse", price: 25, stock: 200 },
        { id: 103, name: "Keyboard", price: 80, stock: 150 },
        { id: 104, name: "Monitor", price: 300, stock: 80 },
        { id: 105, name: "Headphones", price: 150, stock: 60 },
        { id: 106, name: "Webcam", price: 90, stock: 40 },
    ],
    orders: [
        { id: 1001, user_id: 1, product_id: 101, quantity: 1, date: "2023-01-15" },
        { id: 1002, user_id: 2, product_id: 102, quantity: 2, date: "2023-01-16" },
        { id: 1003, user_id: 1, product_id: 105, quantity: 1, date: "2023-01-17" },
        { id: 1004, user_id: 3, product_id: 103, quantity: 1, date: "2023-01-18" },
        { id: 1005, user_id: 2, product_id: 104, quantity: 2, date: "2023-01-19" },
        { id: 1006, user_id: 4, product_id: 101, quantity: 1, date: "2023-01-20" },
    ]
};

export const executeQuery = (query, data) => {
    const lowerQuery = query.toLowerCase().trim();

    // Mock parsing logic
    // Supported: SELECT [columns] FROM [table] [JOIN] WHERE [condition] ORDER BY [col] [ASC|DESC] LIMIT [n]

    let tableName = null;
    if (lowerQuery.includes("from users")) tableName = "users";
    else if (lowerQuery.includes("from products")) tableName = "products";
    else if (lowerQuery.includes("from orders")) tableName = "orders";

    if (!tableName) {
        return { error: "Table not found or syntax error. Try 'SELECT * FROM users'" };
    }

    let results = [...data[tableName]];
    let explanation = "";

    // 0. JOIN Logic (Simple INNER JOIN)
    // Syntax: SELECT * FROM orders JOIN users ON orders.user_id = users.id
    if (lowerQuery.includes("join")) {
        const joinPart = lowerQuery.split("join")[1].split("on")[0].trim();

        let joinTable = null;
        if (joinPart.includes("users")) joinTable = "users";
        else if (joinPart.includes("products")) joinTable = "products";
        else if (joinPart.includes("orders")) joinTable = "orders";

        if (joinTable) {
            // Perform Join
            const joinedResults = [];
            results.forEach(mainRow => {
                data[joinTable].forEach(joinRow => {
                    // Very basic ON parsing: table1.col = table2.col
                    // We'll assume standard foreign keys for this demo: user_id -> id, product_id -> id
                    let match = false;
                    if (tableName === "orders" && joinTable === "users") {
                        match = mainRow.user_id === joinRow.id;
                    } else if (tableName === "orders" && joinTable === "products") {
                        match = mainRow.product_id === joinRow.id;
                    }

                    if (match) {
                        // Merge rows, prefixing columns to avoid collision if needed (simplified here)
                        // We'll prefix join table columns with table name to avoid collision
                        const mergedRow = { ...mainRow };
                        Object.keys(joinRow).forEach(key => {
                            if (key !== 'id') { // Don't overwrite ID if possible, or handle it better
                                mergedRow[`${joinTable}.${key}`] = joinRow[key];
                            }
                        });
                        mergedRow._joined = true;
                        joinedResults.push(mergedRow);
                    }
                });
            });
            results = joinedResults;
            explanation = `Joined ${tableName} with ${joinTable}. Result has ${results.length} rows.`;
        }
    }

    // 1. WHERE Clause & Subqueries
    if (lowerQuery.includes("where")) {
        const wherePart = lowerQuery.split("where")[1].split("order by")[0].split("limit")[0].trim();

        // Subquery detection: WHERE col IN (SELECT ...)
        if (wherePart.includes("in (select")) {
            const subQueryMatch = wherePart.match(/in \((select.+)\)/);
            if (subQueryMatch) {
                const subQuery = subQueryMatch[1];
                const colToCheck = wherePart.split("in")[0].trim();

                // Execute subquery recursively
                const subResult = executeQuery(subQuery, data);
                // Assume single column result from subquery
                const subKey = subResult.columns[0];
                const subValues = subResult.data.map(r => r[subKey]);

                results = results.filter(row => subValues.includes(row[colToCheck]));
                explanation = `Filtered by subquery on ${colToCheck}. Found ${results.length} matching rows in ${tableName}.`;
            }
        } else {
            // Standard WHERE
            const gtMatch = wherePart.match(/(\w+)\s*>\s*(\d+)/);
            const ltMatch = wherePart.match(/(\w+)\s*<\s*(\d+)/);
            const eqMatch = wherePart.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/);

            if (gtMatch) {
                const [_, col, val] = gtMatch;
                results = results.filter(row => row[col] > parseInt(val));
            } else if (ltMatch) {
                const [_, col, val] = ltMatch;
                results = results.filter(row => row[col] < parseInt(val));
            } else if (eqMatch) {
                const [_, col, val] = eqMatch;
                results = results.filter(row => {
                    if (typeof row[col] === 'number') return row[col] === parseInt(val);
                    return String(row[col]).toLowerCase() === val.toLowerCase();
                });
            }
        }
    }

    // 2. ORDER BY Clause
    if (lowerQuery.includes("order by")) {
        const orderPart = lowerQuery.split("order by")[1].split("limit")[0].trim();
        const [col, dir] = orderPart.split(/\s+/);
        const isDesc = dir && dir.toLowerCase() === 'desc';

        results.sort((a, b) => {
            if (a[col] < b[col]) return isDesc ? 1 : -1;
            if (a[col] > b[col]) return isDesc ? -1 : 1;
            return 0;
        });
    }

    // 3. LIMIT Clause
    if (lowerQuery.includes("limit")) {
        const limitPart = lowerQuery.split("limit")[1].trim();
        const limit = parseInt(limitPart);
        if (!isNaN(limit)) {
            results = results.slice(0, limit);
        }
    }

    // 4. SELECT Columns & Aggregations
    const selectPart = lowerQuery.split("from")[0].replace("select", "").trim();
    let selectedColumns = [];
    let aggregation = null;

    // Check for aggregations
    const countMatch = selectPart.match(/count\((.+)\)/);
    const sumMatch = selectPart.match(/sum\((.+)\)/);
    const avgMatch = selectPart.match(/avg\((.+)\)/);
    const maxMatch = selectPart.match(/max\((.+)\)/);
    const minMatch = selectPart.match(/min\((.+)\)/);

    if (countMatch) {
        const countVal = results.length;
        results = [{ "COUNT": countVal }];
        selectedColumns = ["COUNT"];
        explanation = `Counted ${countVal} rows in the result set.`;
    } else if (sumMatch) {
        const col = sumMatch[1].trim();
        const sumVal = results.reduce((acc, row) => acc + (parseFloat(row[col]) || 0), 0);
        results = [{ [`SUM(${col})`]: sumVal }];
        selectedColumns = [`SUM(${col})`];
        explanation = `Calculated the sum of '${col}' across ${results.length} rows.`;
    } else if (avgMatch) {
        const col = avgMatch[1].trim();
        const sumVal = results.reduce((acc, row) => acc + (parseFloat(row[col]) || 0), 0);
        const avgVal = results.length ? (sumVal / results.length).toFixed(2) : 0;
        results = [{ [`AVG(${col})`]: avgVal }];
        selectedColumns = [`AVG(${col})`];
        explanation = `Calculated the average of '${col}'. Sum: ${sumVal} / Count: ${results.length}`;
    } else if (maxMatch) {
        const col = maxMatch[1].trim();
        const maxVal = Math.max(...results.map(r => parseFloat(r[col]) || 0));
        results = [{ [`MAX(${col})`]: maxVal }];
        selectedColumns = [`MAX(${col})`];
        explanation = `Found the maximum value in '${col}'.`;
    } else if (minMatch) {
        const col = minMatch[1].trim();
        const minVal = Math.min(...results.map(r => parseFloat(r[col]) || 0));
        results = [{ [`MIN(${col})`]: minVal }];
        selectedColumns = [`MIN(${col})`];
        explanation = `Found the minimum value in '${col}'.`;
    } else {
        // Normal Select
        if (selectPart === "*") {
            // If joined, we might have duplicate keys or many keys. 
            // For this demo, we'll just take keys from the first result row
            if (results.length > 0) {
                selectedColumns = Object.keys(results[0]).filter(k => k !== '_joined');
            } else {
                selectedColumns = Object.keys(data[tableName][0]);
            }
        } else {
            selectedColumns = selectPart.split(",").map(c => c.trim());
        }
        if (!explanation) explanation = `Selected ${results.length} rows from ${tableName}.`;
    }

    const resultIds = new Set(results.map(r => r.id));

    return {
        data: results,
        tableName,
        columns: selectedColumns,
        explanation,
        animationState: data[tableName].map(row => ({
            id: row.id,
            status: resultIds.has(row.id) ? 'keep' : 'filter'
        }))
    };
};
