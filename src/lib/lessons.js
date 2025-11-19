export const lessons = [
    // SECTION 1: BASIC RECONNAISSANCE (SELECT)
    {
        id: 1,
        title: "Identify Targets",
        section: "Reconnaissance",
        description: "Retrieve the full list of users from the database.",
        briefing: "AGENT, WE HAVE BREACHED THE PERIMETER. YOUR FIRST TASK IS TO IDENTIFY ALL POTENTIAL TARGETS WITHIN THE SYSTEM. EXTRACT THE FULL USER REGISTRY.",
        query: "SELECT * FROM users",
        points: 10
    },
    {
        id: 2,
        title: "Filter by Age",
        section: "Reconnaissance",
        description: "Find all users who are 25 years old or older.",
        briefing: "GOOD WORK. NOW WE NEED TO NARROW DOWN THE LIST. FOCUS ON MATURE TARGETS. FILTER THE REGISTRY FOR INDIVIDUALS AGED 25 OR OLDER.",
        query: "SELECT * FROM users WHERE age >= 25",
        points: 15
    },
    {
        id: 3,
        title: "Locate Engineers",
        section: "Reconnaissance",
        description: "Find all users with the job title 'Engineer'.",
        briefing: "WE NEED TECHNICAL ACCESS. LOCATE THE SYSTEM ENGINEERS. THEY HOLD THE KEYS TO THE DEEPER LEVELS.",
        query: "SELECT * FROM users WHERE job = 'Engineer'",
        points: 20
    },
    {
        id: 4,
        title: "Specific Columns",
        section: "Reconnaissance",
        description: "Select only the name and job of all users.",
        briefing: "BANDWIDTH IS LIMITED. STOP DOWNLOADING JUNK DATA. EXTRACT ONLY THE NAMES AND JOB TITLES. WE DON'T NEED THE REST.",
        query: "SELECT name, job FROM users",
        points: 25
    },

    // SECTION 2: DATA MANIPULATION (ORDER & LIMIT)
    {
        id: 5,
        title: "Sort by Age",
        section: "Data Manipulation",
        description: "List all users sorted by age in ascending order.",
        briefing: "THE DATA IS A MESS. ORGANIZE IT. SORT THE TARGETS BY AGE, YOUNGEST TO OLDEST.",
        query: "SELECT * FROM users ORDER BY age ASC",
        points: 30
    },
    {
        id: 6,
        title: "Top Earners",
        section: "Data Manipulation",
        description: "Find the top 3 users with the highest id (simulating latest signups).",
        briefing: "WE NEED THE NEWEST RECRUITS. RETRIEVE THE LAST 3 ENTRIES ADDED TO THE SYSTEM.",
        query: "SELECT * FROM users ORDER BY id DESC LIMIT 3",
        points: 35
    },

    // SECTION 3: AGGREGATION (COUNT, SUM, AVG)
    {
        id: 7,
        title: "Count Targets",
        section: "Aggregation",
        description: "Count the total number of users.",
        briefing: "SITREP REPORT REQUESTED. HOW MANY TOTAL TARGETS ARE WE DEALING WITH? GIVE ME A HEADCOUNT.",
        query: "SELECT COUNT(*) FROM users",
        points: 40
    },
    {
        id: 8,
        title: "Average Age",
        section: "Aggregation",
        description: "Calculate the average age of all users.",
        briefing: "PROFILING IN PROGRESS. DETERMINE THE AVERAGE AGE OF THE USERBASE TO ADJUST OUR SOCIAL ENGINEERING PROTOCOLS.",
        query: "SELECT AVG(age) FROM users",
        points: 45
    },

    // SECTION 4: COMPLEX QUERIES (JOIN & SUBQUERY)
    {
        id: 9,
        title: "Order History",
        section: "Deep Dive",
        description: "Find all orders placed by 'Alice'. (Use JOIN)",
        briefing: "TARGET 'ALICE' IS A PERSON OF INTEREST. CROSS-REFERENCE THE USER REGISTRY WITH THE ORDER LOGS. FIND EVERYTHING SHE BOUGHT.",
        query: "SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.name = 'Alice'",
        points: 60
    },
    {
        id: 10,
        title: "High Value Targets",
        section: "Deep Dive",
        description: "Find users who have placed an order for a 'Laptop'. (Use Subquery)",
        briefing: "WE ARE LOOKING FOR TECH BUYERS. IDENTIFY ANY USER WHO HAS PURCHASED A 'LAPTOP'. USE A SUBQUERY TO FILTER THE IDS.",
        query: "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE product = 'Laptop')",
        points: 75
    }
];
