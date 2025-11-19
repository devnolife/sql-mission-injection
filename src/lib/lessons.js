export const lessons = [
  // SECTION 0: FUNDAMENTALS (CONCEPT & QUIZ)
  {
    id: 1,
    type: 'concept',
    title: "The Data Matrix",
    section: "Fundamentals",
    description: "Understanding what a Database is.",
    content: "In the digital realm, information is power. But raw data is chaos. To control it, we use DATABASES.\n\nThink of a database like a massive, secure warehouse. Inside, data isn't just thrown in a pile; it's organized into TABLES. A table is like a spreadsheet: rows are individual records (like a specific user), and columns are the attributes (like name, age, job).\n\nSQL (Structured Query Language) is the key to this warehouse. It's the language we use to ask the database questions, or 'Queries'. With SQL, we can retrieve, filter, sort, and manipulate data with surgical precision.",
    points: 5
  },
  {
    id: 2,
    type: 'concept',
    title: "Origins of the Code",
    section: "Fundamentals",
    description: "A brief history of SQL.",
    content: "In the early 1970s, at IBM's San Jose Research Laboratory, a new relational model for data was born. Two researchers, Donald Chamberlin and Raymond Boyce, developed a language called SEQUEL (Structured English Query Language).\n\nLater shortened to SQL (due to trademark issues), it became the standard for communicating with relational databases. Today, whether it's a bank, a social network, or a secret government server, SQL is the language that runs the world.",
    points: 5
  },
  {
    id: 3,
    type: 'quiz',
    title: "Protocol Check: SQL",
    section: "Fundamentals",
    description: "Verify your understanding of SQL basics.",
    question: "What does SQL stand for?",
    options: [
      "Structured Question List",
      "Structured Query Language",
      "Simple Query Logic",
      "System Quantum Link"
    ],
    correctAnswer: 1,
    points: 10
  },

  // SECTION 1: BASIC RECONNAISSANCE (SELECT)
  {
    id: 4,
    type: 'query',
    title: "Identify Targets",
    section: "Reconnaissance",
    description: "Retrieve the full list of users from the database.",
    briefing: "AGENT, WE HAVE BREACHED THE PERIMETER. YOUR FIRST TASK IS TO IDENTIFY ALL POTENTIAL TARGETS WITHIN THE SYSTEM. EXTRACT THE FULL USER REGISTRY.",
    query: "SELECT * FROM users",
    points: 10
  },
  {
    id: 5,
    type: 'concept',
    title: "The SELECT Command",
    section: "Reconnaissance",
    description: "Learn about the SELECT statement.",
    content: "The SELECT command is your eyes in the digital world. It tells the database WHICH columns you want to see.\n\nUsing 'SELECT *' means 'show me everything'. The asterisk (*) is a wildcard that matches all columns.\n\nHowever, in a real infiltration, bandwidth is precious. Experienced netrunners often specify exactly which columns they need (e.g., 'SELECT name, email') to avoid detection and speed up data transfer.",
    points: 5
  },
  {
    id: 6,
    type: 'query',
    title: "Specific Columns",
    section: "Reconnaissance",
    description: "Select only the name and job of all users.",
    briefing: "BANDWIDTH IS LIMITED. STOP DOWNLOADING JUNK DATA. EXTRACT ONLY THE NAMES AND JOB TITLES. WE DON'T NEED THE REST.",
    query: "SELECT name, job FROM users",
    points: 25
  },
  {
    id: 7,
    type: 'query',
    title: "Filter by Age",
    section: "Reconnaissance",
    description: "Find all users who are 25 years old or older.",
    briefing: "GOOD WORK. NOW WE NEED TO NARROW DOWN THE LIST. FOCUS ON MATURE TARGETS. FILTER THE REGISTRY FOR INDIVIDUALS AGED 25 OR OLDER.",
    query: "SELECT * FROM users WHERE age >= 25",
    points: 15
  },
  {
    id: 8,
    type: 'concept',
    title: "Precision Targeting",
    section: "Reconnaissance",
    description: "Understanding the power of the WHERE clause.",
    content: "Imagine a database with a billion users. Asking for 'SELECT *' would crash your system and alert every security bot in the network.\n\nThe WHERE clause is your stealth tool. It filters data BEFORE it leaves the database server. This minimizes bandwidth usage and keeps your footprint small. Always filter as early as possible.",
    points: 5
  },
  {
    id: 9,
    type: 'quiz',
    title: "Protocol Check: Filtering",
    section: "Reconnaissance",
    description: "Test your knowledge on filtering data.",
    question: "Which keyword is used to filter records based on a condition?",
    options: [
      "FILTER",
      "WHEN",
      "WHERE",
      "IF"
    ],
    correctAnswer: 2,
    points: 10
  },
  {
    id: 10,
    type: 'query',
    title: "Locate Engineers",
    section: "Reconnaissance",
    description: "Find all users with the job title 'Engineer'.",
    briefing: "WE NEED TECHNICAL ACCESS. LOCATE THE SYSTEM ENGINEERS. THEY HOLD THE KEYS TO THE DEEPER LEVELS.",
    query: "SELECT * FROM users WHERE job = 'Engineer'",
    points: 20
  },

  // SECTION 2: DATA MANIPULATION (ORDER & LIMIT)
  {
    id: 11,
    type: 'query',
    title: "Sort by Age",
    section: "Data Manipulation",
    description: "List all users sorted by age in ascending order.",
    briefing: "THE DATA IS A MESS. ORGANIZE IT. SORT THE TARGETS BY AGE, YOUNGEST TO OLDEST.",
    query: "SELECT * FROM users ORDER BY age ASC",
    points: 30
  },
  {
    id: 12,
    type: 'query',
    title: "Top Earners",
    section: "Data Manipulation",
    description: "Find the top 3 users with the highest id (simulating latest signups).",
    briefing: "WE NEED THE NEWEST RECRUITS. RETRIEVE THE LAST 3 ENTRIES ADDED TO THE SYSTEM.",
    query: "SELECT * FROM users ORDER BY id DESC LIMIT 3",
    points: 35
  },

  // SECTION 3: AGGREGATION (COUNT, SUM, AVG)
  {
    id: 13,
    type: 'query',
    title: "Count Targets",
    section: "Aggregation",
    description: "Count the total number of users.",
    briefing: "SITREP REPORT REQUESTED. HOW MANY TOTAL TARGETS ARE WE DEALING WITH? GIVE ME A HEADCOUNT.",
    query: "SELECT COUNT(*) FROM users",
    points: 40
  },
  {
    id: 14,
    type: 'query',
    title: "Average Age",
    section: "Aggregation",
    description: "Calculate the average age of all users.",
    briefing: "PROFILING IN PROGRESS. DETERMINE THE AVERAGE AGE OF THE USERBASE TO ADJUST OUR SOCIAL ENGINEERING PROTOCOLS.",
    query: "SELECT AVG(age) FROM users",
    points: 45
  },

  // SECTION 4: COMPLEX QUERIES (JOIN & SUBQUERY)
  {
    id: 15,
    type: 'query',
    title: "Order History",
    section: "Deep Dive",
    description: "Find all orders placed by 'Alice'. (Use JOIN)",
    briefing: "TARGET 'ALICE' IS A PERSON OF INTEREST. CROSS-REFERENCE THE USER REGISTRY WITH THE ORDER LOGS. FIND EVERYTHING SHE BOUGHT.",
    query: "SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.name = 'Alice'",
    points: 60
  },
  {
    id: 16,
    type: 'query',
    title: "High Value Targets",
    section: "Deep Dive",
    description: "Find users who have placed an order for a 'Laptop'. (Use Subquery)",
    briefing: "WE ARE LOOKING FOR TECH BUYERS. IDENTIFY ANY USER WHO HAS PURCHASED A 'LAPTOP'. USE A SUBQUERY TO FILTER THE IDS.",
    query: "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE product = 'Laptop')",
    points: 75
  }
];
