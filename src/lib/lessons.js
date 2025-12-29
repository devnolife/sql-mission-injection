export const lessons = [
  // ==================== SECTION 0: DASAR-DASAR ====================
  {
    id: 1,
    type: 'concept',
    title: "Matriks Data",
    section: "Dasar-Dasar",
    description: "Memahami apa itu Database.",
    content: "Di dunia digital, informasi adalah kekuatan. Tapi data mentah adalah kekacauan. Untuk mengendalikannya, kita menggunakan DATABASE.\n\nBayangkan database seperti gudang besar yang aman. Di dalamnya, data tidak hanya ditumpuk; itu diatur ke dalam TABEL. Tabel itu seperti spreadsheet: baris adalah catatan individu (seperti pengguna tertentu), dan kolom adalah atribut (seperti nama, usia, pekerjaan).\n\nSQL (Structured Query Language) adalah kunci gudang ini. Ini adalah bahasa yang kita gunakan untuk mengajukan pertanyaan ke database, atau 'Query'. Dengan SQL, kita dapat mengambil, memfilter, mengurutkan, dan memanipulasi data dengan presisi bedah.",
    points: 5,
    visualDemo: {
      tableName: "users",
      demoQuery: "SELECT * FROM users",
      steps: [
        { action: "showTable", description: "Ini adalah DATABASE - tempat kita menyimpan informasi terstruktur" },
        { action: "highlightRow", row: 0, description: "Setiap BARIS adalah satu record/data lengkap (contoh: data Alice)" },
        { action: "highlightRow", row: 1, description: "Baris kedua berisi data Bob - setiap orang = satu baris" },
        { action: "highlightColumn", column: "name", description: "Setiap KOLOM adalah satu atribut/field (contoh: nama)" },
        { action: "highlightColumn", column: "age", description: "Kolom 'age' menyimpan usia - atribut lainnya" },
        { action: "runQuery", query: "SELECT * FROM users", description: "SQL adalah bahasa untuk 'berbicara' dengan database" }
      ]
    }
  },
  {
    id: 2,
    type: 'concept',
    title: "Asal Usul Kode",
    section: "Dasar-Dasar",
    description: "Sejarah singkat SQL.",
    content: "Pada awal 1970-an, di Laboratorium Riset IBM San Jose, model relasional baru untuk data lahir. Dua peneliti, Donald Chamberlin dan Raymond Boyce, mengembangkan bahasa yang disebut SEQUEL (Structured English Query Language).\n\nKemudian disingkat menjadi SQL (karena masalah merek dagang), itu menjadi standar untuk berkomunikasi dengan database relasional. Hari ini, baik itu bank, jejaring sosial, atau server perusahaan besar, SQL adalah bahasa yang menjalankan dunia.",
    points: 5
  },
  {
    id: 2.5,
    type: 'execution-order',
    title: "Urutan Eksekusi SQL",
    section: "Dasar-Dasar",
    description: "Pelajari bagaimana SQL dieksekusi - berbeda dari cara menulisnya!",
    content: "SQL tidak dieksekusi dari kiri ke kanan seperti yang kita tulis. SELECT ditulis pertama, tapi dieksekusi hampir terakhir! Memahami urutan eksekusi sangat penting untuk menulis query yang efisien.",
    points: 15
  },
  {
    id: 3,
    type: 'quiz',
    title: "Cek Protokol: SQL",
    section: "Dasar-Dasar",
    description: "Verifikasi pemahaman Anda tentang dasar-dasar SQL.",
    question: "Apa kepanjangan dari SQL?",
    options: [
      "Structured Question List",
      "Structured Query Language",
      "Simple Query Logic",
      "System Quantum Link"
    ],
    correctAnswer: 1,
    points: 10
  },
  {
    id: 4,
    type: 'concept',
    title: "Database Relasional",
    section: "Dasar-Dasar",
    description: "Memahami konsep database relasional dan terminologi kunci.",
    content: "DATABASE RELASIONAL adalah sistem yang menyimpan data dalam tabel-tabel yang saling terhubung melalui relasi. Contoh: sistem perbankan yang menghubungkan tabel 'Nasabah' dengan tabel 'Rekening' dan 'Transaksi'.\n\nTERMINOLOGI KUNCI:\n• ROW (Baris): Satu record lengkap dalam tabel (contoh: data satu pengguna)\n• COLUMN (Kolom): Satu atribut/field dalam tabel (contoh: 'nama' atau 'email')\n• PRIMARY KEY: Identifier unik untuk setiap baris (contoh: user_id)\n• FOREIGN KEY: Kolom yang mereferensikan PRIMARY KEY dari tabel lain",
    points: 5,
    visualDemo: {
      tableName: "users",
      demoQuery: "SELECT * FROM users",
      steps: [
        { action: "showTable", description: "Ini adalah tabel 'users' yang menyimpan data pengguna" },
        { action: "highlightColumn", column: "id", description: "Ini adalah KOLOM 'id' - setiap kolom mewakili satu atribut/field" },
        { action: "highlightColumn", column: "name", description: "Kolom 'name' berisi nama pengguna - ini juga sebuah KOLOM" },
        { action: "highlightRow", row: 0, description: "Ini adalah BARIS pertama - setiap baris mewakili satu data lengkap (record)" },
        { action: "highlightRow", row: 2, description: "BARIS ketiga berisi semua data milik Charlie" },
        { action: "runQuery", query: "SELECT name, job FROM users", description: "Query SQL memilih kolom tertentu dari tabel" }
      ]
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: "Cek Protokol: Relational DB",
    section: "Dasar-Dasar",
    description: "Uji pemahaman Anda tentang database relasional.",
    question: "Apa yang dimaksud dengan PRIMARY KEY dalam sebuah tabel database?",
    options: [
      "Kolom yang bisa berisi data duplikat",
      "Identifier unik untuk setiap baris dalam tabel",
      "Kolom yang menghubungkan ke tabel eksternal",
      "Baris pertama dalam setiap tabel"
    ],
    correctAnswer: 1,
    points: 10
  },

  // ==================== SECTION 1: PENGINTAIAN (SELECT) ====================
  {
    id: 6,
    type: 'query',
    title: "Identifikasi Target",
    section: "Pengintaian",
    description: "Ambil daftar lengkap pengguna dari database.",
    briefing: "AGEN, KITA TELAH MENEMBUS PERIMETER. TUGAS PERTAMA ANDA ADALAH MENGIDENTIFIKASI SEMUA TARGET POTENSIAL DI DALAM SISTEM. EKSTRAK REGISTRI PENGGUNA LENGKAP.",
    query: "SELECT * FROM users",
    points: 10,
    exampleDemo: {
      description: "Contoh: Mengambil semua data dari tabel products",
      exampleQuery: "SELECT * FROM products",
      tableName: "products"
    }
  },
  {
    id: 7,
    type: 'concept',
    title: "Perintah SELECT",
    section: "Pengintaian",
    description: "Pelajari tentang pernyataan SELECT.",
    content: "Perintah SELECT adalah mata Anda di dunia digital. Ini memberi tahu database kolom MANA yang ingin Anda lihat.\n\nMenggunakan 'SELECT *' berarti 'tunjukkan semuanya'. Tanda bintang (*) adalah wildcard yang cocok dengan semua kolom.\n\nNamun, dalam infiltrasi nyata, bandwidth sangat berharga. Netrunner berpengalaman sering menentukan dengan tepat kolom mana yang mereka butuhkan (mis., 'SELECT name, age') untuk efisiensi.",
    points: 5,
    visualDemo: {
      tableName: "users",
      demoQuery: "SELECT * FROM users",
      steps: [
        { action: "showTable", description: "Tabel users berisi semua data pengguna" },
        { action: "runQuery", query: "SELECT * FROM users", description: "SELECT * mengambil SEMUA kolom - wildcard '*' = semuanya" },
        { action: "highlightColumn", column: "name", description: "Kita bisa pilih kolom spesifik saja..." },
        { action: "highlightColumn", column: "job", description: "...seperti 'name' dan 'job' saja" },
        { action: "runQuery", query: "SELECT name, job FROM users", description: "SELECT name, job hanya mengambil 2 kolom yang diperlukan" }
      ]
    }
  },
  {
    id: 8,
    type: 'query',
    title: "Kolom Spesifik",
    section: "Pengintaian",
    description: "Pilih hanya nama dan pekerjaan dari semua pengguna.",
    briefing: "BANDWIDTH TERBATAS. BERHENTI MENGUNDUH DATA SAMPAH. EKSTRAK HANYA NAMA DAN PEKERJAAN. KITA TIDAK BUTUH SISANYA.",
    query: "SELECT name, job FROM users",
    points: 25,
    exampleDemo: {
      description: "Contoh: Mengambil hanya nama dan harga dari products",
      exampleQuery: "SELECT name, price FROM products",
      tableName: "products"
    }
  },
  {
    id: 9,
    type: 'query',
    title: "Filter berdasarkan Usia",
    section: "Pengintaian",
    description: "Temukan semua pengguna yang berusia 25 tahun atau lebih.",
    briefing: "KERJA BAGUS. SEKARANG KITA PERLU MEMPERSEMPIT DAFTAR. FOKUS PADA TARGET DEWASA. FILTER REGISTRI UNTUK INDIVIDU BERUSIA 25 TAHUN ATAU LEBIH.",
    query: "SELECT * FROM users WHERE age >= 25",
    points: 15,
    exampleDemo: {
      description: "Contoh: Filter products dengan harga >= 1000000",
      exampleQuery: "SELECT * FROM products WHERE price >= 1000000",
      tableName: "products"
    }
  },
  {
    id: 10,
    type: 'concept',
    title: "Penargetan Presisi",
    section: "Pengintaian",
    description: "Memahami kekuatan klausa WHERE.",
    content: "Bayangkan database dengan jutaan pengguna. Meminta 'SELECT *' akan membanjiri sistem Anda.\n\nKlausa WHERE adalah alat filter Anda. Ini memfilter data SEBELUM meninggalkan server database. Operator yang bisa digunakan:\n• = (sama dengan)\n• > (lebih besar)\n• < (lebih kecil)\n• >= (lebih besar atau sama)\n• <= (lebih kecil atau sama)",
    points: 5,
    visualDemo: {
      tableName: "users",
      demoQuery: "SELECT * FROM users WHERE age >= 25",
      steps: [
        { action: "showTable", description: "Tabel users berisi semua data pengguna" },
        { action: "highlightColumn", column: "age", description: "Kolom 'age' akan kita gunakan untuk filter" },
        { action: "highlightRow", row: 0, description: "Alice berusia 28 - memenuhi kriteria age >= 25" },
        { action: "highlightRow", row: 2, description: "Charlie berusia 22 - TIDAK memenuhi kriteria" },
        { action: "runQuery", query: "SELECT * FROM users WHERE age >= 25", description: "WHERE memfilter hanya baris yang memenuhi kondisi" }
      ]
    }
  },
  {
    id: 11,
    type: 'quiz',
    title: "Cek Protokol: Filtering",
    section: "Pengintaian",
    description: "Uji pengetahuan Anda tentang memfilter data.",
    question: "Kata kunci mana yang digunakan untuk memfilter catatan berdasarkan kondisi?",
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
    id: 12,
    type: 'query',
    title: "Lokasi Engineer",
    section: "Pengintaian",
    description: "Temukan semua pengguna dengan pekerjaan 'Engineer'.",
    briefing: "KITA BUTUH AKSES TEKNIS. TEMUKAN PARA ENGINEER. MEREKA MEMEGANG KUNCI KE LEVEL YANG LEBIH DALAM.",
    query: "SELECT * FROM users WHERE job = 'Engineer'",
    points: 20,
    exampleDemo: {
      description: "Contoh: Filter products dengan kategori 'Electronics'",
      exampleQuery: "SELECT * FROM products WHERE category = 'Electronics'",
      tableName: "products"
    }
  },

  // ==================== SECTION 2: MANIPULASI DATA (ORDER & LIMIT) ====================
  {
    id: 13,
    type: 'query',
    title: "Urutkan berdasarkan Usia",
    section: "Manipulasi Data",
    description: "Daftar semua pengguna diurutkan berdasarkan usia menaik.",
    briefing: "DATA INI BERANTAKAN. ORGANISASIKAN. URUTKAN TARGET BERDASARKAN USIA, DARI YANG TERMUDA HINGGA TERTUA.",
    query: "SELECT * FROM users ORDER BY age ASC",
    points: 30
  },
  {
    id: 14,
    type: 'query',
    title: "Entri Terakhir",
    section: "Manipulasi Data",
    description: "Ambil 3 pengguna dengan id tertinggi (pendaftaran terbaru).",
    briefing: "KITA BUTUH REKRUTAN TERBARU. AMBIL 3 ENTRI TERAKHIR YANG DITAMBAHKAN KE SISTEM.",
    query: "SELECT * FROM users ORDER BY id DESC LIMIT 3",
    points: 35
  },

  // ==================== SECTION 3: FUNGSI AGREGASI ====================
  {
    id: 15,
    type: 'concept',
    title: "Fungsi Agregasi",
    section: "Agregasi",
    description: "Memahami fungsi-fungsi untuk menghitung data.",
    content: "FUNGSI AGREGASI adalah operasi yang menggabungkan banyak baris menjadi satu nilai ringkasan.\n\nFUNGSI UTAMA:\n• COUNT(*) - Menghitung jumlah baris\n• SUM(kolom) - Menjumlahkan nilai numerik\n• AVG(kolom) - Menghitung rata-rata\n• MAX(kolom) - Mencari nilai tertinggi\n• MIN(kolom) - Mencari nilai terendah\n\nContoh: SELECT COUNT(*) FROM users akan mengembalikan total jumlah pengguna dalam tabel.",
    points: 5,
    visualDemo: {
      tableName: "users",
      demoQuery: "SELECT COUNT(*) FROM users",
      steps: [
        { action: "showTable", description: "Tabel users berisi 4 baris data" },
        { action: "highlightRow", row: 0, description: "Baris 1..." },
        { action: "highlightRow", row: 1, description: "Baris 2..." },
        { action: "highlightRow", row: 2, description: "Baris 3..." },
        { action: "highlightRow", row: 3, description: "Baris 4... Total ada 4 baris!" },
        { action: "runQuery", query: "SELECT COUNT(*) FROM users", description: "COUNT(*) menghitung total baris = 4" }
      ]
    }
  },
  {
    id: 16,
    type: 'query',
    title: "Hitung Target",
    section: "Agregasi",
    description: "Hitung jumlah total pengguna.",
    briefing: "LAPORAN SITREP DIMINTA. BERAPA BANYAK TOTAL TARGET YANG KITA HADAPI? BERIKAN SAYA JUMLAH KEPALA.",
    query: "SELECT COUNT(*) FROM users",
    points: 40
  },
  {
    id: 17,
    type: 'query',
    title: "Usia Rata-rata",
    section: "Agregasi",
    description: "Hitung usia rata-rata semua pengguna.",
    briefing: "PROFILING SEDANG BERLANGSUNG. TENTUKAN USIA RATA-RATA BASIS PENGGUNA UNTUK MENYESUAIKAN PROTOKOL.",
    query: "SELECT AVG(age) FROM users",
    points: 45
  },
  {
    id: 18,
    type: 'query',
    title: "Gaji Tertinggi",
    section: "Agregasi",
    description: "Temukan gaji tertinggi di antara pengguna.",
    briefing: "KITA PERLU MENGIDENTIFIKASI TARGET BERNILAI TINGGI. TEMUKAN SIAPA YANG MEMILIKI GAJI TERTINGGI.",
    query: "SELECT MAX(salary) FROM users",
    points: 35
  },
  {
    id: 19,
    type: 'query',
    title: "Harga Minimum",
    section: "Agregasi",
    description: "Temukan produk dengan harga terendah.",
    briefing: "OPTIMISASI BIAYA DIPERLUKAN. IDENTIFIKASI PRODUK TERMURAH DALAM INVENTARIS.",
    query: "SELECT MIN(price) FROM products",
    points: 35
  },
  {
    id: 20,
    type: 'query',
    title: "Total Nilai Stok",
    section: "Agregasi",
    description: "Hitung total harga semua produk.",
    briefing: "KALKULASI ASET DIMINTA. BERAPA TOTAL NILAI SEMUA PRODUK DALAM SISTEM?",
    query: "SELECT SUM(price) FROM products",
    points: 40
  },
  {
    id: 21,
    type: 'quiz',
    title: "Cek Protokol: Agregasi",
    section: "Agregasi",
    description: "Verifikasi pemahaman fungsi agregasi.",
    question: "Fungsi mana yang digunakan untuk menghitung nilai rata-rata dari sebuah kolom?",
    options: [
      "SUM()",
      "COUNT()",
      "AVG()",
      "MEAN()"
    ],
    correctAnswer: 2,
    points: 10
  },

  // ==================== SECTION 4: GROUP BY ====================
  {
    id: 22,
    type: 'concept',
    title: "Pengelompokan Data",
    section: "Group By",
    description: "Memahami konsep GROUP BY untuk mengelompokkan data.",
    content: "GROUP BY adalah perintah SQL yang mengelompokkan baris dengan nilai yang sama ke dalam baris ringkasan.\n\nMISALNYA:\nJika Anda memiliki tabel users dengan kolom 'department', Anda bisa mengelompokkan pengguna berdasarkan departemen mereka dan menghitung berapa banyak di setiap departemen.\n\nSINTAKS:\nSELECT department, COUNT(*) FROM users GROUP BY department\n\nHasil akan menunjukkan setiap departemen unik beserta jumlah karyawan di dalamnya.\n\nPENTING: Ketika menggunakan GROUP BY, kolom yang tidak diagregasi harus muncul di klausa GROUP BY.",
    points: 10,
    visualDemo: {
      tableName: "users",
      demoQuery: "SELECT job, COUNT(*) FROM users GROUP BY job",
      steps: [
        { action: "showTable", description: "Tabel users memiliki kolom 'job' dengan nilai berbeda" },
        { action: "highlightColumn", column: "job", description: "Kolom 'job' berisi: Engineer, Designer, Manager" },
        { action: "highlightRow", row: 0, description: "Alice = Engineer" },
        { action: "highlightRow", row: 2, description: "Charlie = Engineer juga! Mereka akan dikelompokkan" },
        { action: "runQuery", query: "SELECT job, COUNT(*) FROM users GROUP BY job", description: "GROUP BY mengelompokkan berdasarkan job dan menghitung masing-masing" }
      ]
    }
  },
  {
    id: 23,
    type: 'query',
    title: "Grup Pekerjaan",
    section: "Group By",
    description: "Hitung jumlah pengguna berdasarkan pekerjaan.",
    briefing: "ANALISIS TENAGA KERJA DIPERLUKAN. KELOMPOKKAN PERSONEL BERDASARKAN JENIS PEKERJAAN DAN HITUNG MASING-MASING.",
    query: "SELECT job, COUNT(*) FROM users GROUP BY job",
    points: 50
  },
  {
    id: 24,
    type: 'query',
    title: "Departemen & Gaji",
    section: "Group By",
    description: "Hitung total gaji per departemen.",
    briefing: "AUDIT KEUANGAN DIMINTA. HITUNG TOTAL PENGELUARAN GAJI UNTUK SETIAP DEPARTEMEN.",
    query: "SELECT department, SUM(salary) FROM users GROUP BY department",
    points: 55
  },
  {
    id: 25,
    type: 'query',
    title: "Rata-rata Gaji Departemen",
    section: "Group By",
    description: "Hitung gaji rata-rata per departemen.",
    briefing: "BANDINGKAN KOMPENSASI ANTAR DIVISI. TEMUKAN RATA-RATA GAJI UNTUK SETIAP DEPARTEMEN.",
    query: "SELECT department, AVG(salary) FROM users GROUP BY department",
    points: 55
  },
  {
    id: 26,
    type: 'quiz',
    title: "Cek Protokol: GROUP BY",
    section: "Group By",
    description: "Uji pemahaman Anda tentang GROUP BY.",
    question: "Apa fungsi dari klausa GROUP BY dalam SQL?",
    options: [
      "Mengurutkan data secara alfabetis",
      "Menghapus baris duplikat",
      "Mengelompokkan baris dengan nilai yang sama untuk agregasi",
      "Membatasi jumlah hasil"
    ],
    correctAnswer: 2,
    points: 10
  },

  // ==================== SECTION 5: HAVING ====================
  {
    id: 27,
    type: 'concept',
    title: "Filter Setelah Grup",
    section: "Having",
    description: "Memahami perbedaan WHERE dan HAVING.",
    content: "HAVING adalah klausa yang memfilter hasil SETELAH GROUP BY dijalankan.\n\nPERBEDAAN WHERE vs HAVING:\n• WHERE memfilter baris SEBELUM pengelompokan\n• HAVING memfilter grup SETELAH pengelompokan\n\nCONTOH:\nSELECT department, COUNT(*) FROM users GROUP BY department HAVING COUNT(*) > 2\n\nQuery ini akan menampilkan hanya departemen yang memiliki lebih dari 2 karyawan.\n\nINGAT: HAVING biasanya digunakan dengan fungsi agregasi seperti COUNT, SUM, AVG.",
    points: 10,
    visualDemo: {
      tableName: "users",
      demoQuery: "SELECT job, COUNT(*) FROM users GROUP BY job HAVING COUNT(*) > 1",
      steps: [
        { action: "showTable", description: "Tabel users dengan berbagai pekerjaan" },
        { action: "highlightColumn", column: "job", description: "Pertama, kita GROUP BY kolom 'job'" },
        { action: "highlightRow", row: 0, description: "Engineer (Alice)" },
        { action: "highlightRow", row: 2, description: "Engineer (Charlie) - 2 orang Engineer" },
        { action: "runQuery", query: "SELECT job, COUNT(*) FROM users GROUP BY job HAVING COUNT(*) > 1", description: "HAVING COUNT(*) > 1 hanya tampilkan job dengan lebih dari 1 orang" }
      ]
    }
  },
  {
    id: 28,
    type: 'query',
    title: "Departemen Besar",
    section: "Having",
    description: "Temukan departemen dengan lebih dari 2 karyawan.",
    briefing: "IDENTIFIKASI DIVISI UTAMA. TEMUKAN DEPARTEMEN MANA YANG MEMILIKI LEBIH DARI 2 PERSONEL.",
    query: "SELECT department, COUNT(*) FROM users GROUP BY department HAVING COUNT(*) > 2",
    points: 60
  },
  {
    id: 29,
    type: 'quiz',
    title: "Cek Protokol: HAVING",
    section: "Having",
    description: "Uji pemahaman tentang HAVING vs WHERE.",
    question: "Kapan kita menggunakan HAVING alih-alih WHERE?",
    options: [
      "Untuk memfilter berdasarkan nama kolom",
      "Untuk memfilter hasil setelah GROUP BY",
      "Untuk mengurutkan data",
      "Untuk menghapus duplikat"
    ],
    correctAnswer: 1,
    points: 10
  },

  // ==================== SECTION 6: JOIN ====================
  {
    id: 30,
    type: 'concept',
    title: "Menggabungkan Tabel",
    section: "Deep Dive",
    description: "Memahami konsep JOIN untuk menghubungkan tabel.",
    content: "JOIN adalah operasi yang menggabungkan baris dari dua atau lebih tabel berdasarkan kolom yang terkait.\n\nCONTOH SEDERHANA:\nTabel 'orders' memiliki kolom 'user_id' yang mereferensikan 'id' di tabel 'users'.\n\nSINTAKS:\nSELECT * FROM orders JOIN users ON orders.user_id = users.id\n\nQuery ini akan menampilkan data pesanan beserta informasi pengguna yang membuat pesanan tersebut.\n\nJENIS JOIN:\n• INNER JOIN - Hanya baris yang cocok di kedua tabel\n• LEFT JOIN - Semua dari tabel kiri + yang cocok dari kanan\n• RIGHT JOIN - Semua dari tabel kanan + yang cocok dari kiri",
    points: 10,
    visualDemo: {
      tableName: "users",
      demoQuery: "SELECT * FROM orders JOIN users ON orders.user_id = users.id",
      steps: [
        { action: "showTable", description: "Tabel 'users' berisi data pengguna" },
        { action: "highlightColumn", column: "id", description: "Kolom 'id' di users adalah PRIMARY KEY" },
        { action: "highlightRow", row: 0, description: "Alice memiliki id=1" },
        { action: "highlightRow", row: 1, description: "Bob memiliki id=2, dst." },
        { action: "runQuery", query: "SELECT * FROM orders JOIN users ON orders.user_id = users.id", description: "JOIN menghubungkan orders.user_id dengan users.id" }
      ]
    }
  },
  {
    id: 31,
    type: 'query',
    title: "Riwayat Pesanan Alice",
    section: "Deep Dive",
    description: "Temukan semua pesanan yang dibuat oleh 'Alice'.",
    briefing: "TARGET 'ALICE' ADALAH ORANG YANG DIMINATI. REFERENSI SILANG REGISTRI PENGGUNA DENGAN LOG PESANAN. TEMUKAN SEMUA YANG DIA BELI.",
    query: "SELECT * FROM orders JOIN users ON orders.user_id = users.id WHERE users.name = 'Alice'",
    points: 60
  },
  {
    id: 32,
    type: 'query',
    title: "Target Bernilai Tinggi",
    section: "Deep Dive",
    description: "Temukan pengguna yang telah memesan 'Laptop'. (Gunakan Subquery)",
    briefing: "KITA MENCARI PEMBELI TEKNOLOGI. IDENTIFIKASI PENGGUNA MANA PUN YANG TELAH MEMBELI 'LAPTOP'. GUNAKAN SUBQUERY UNTUK MEMFILTER ID.",
    query: "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE product_id = 101)",
    points: 75
  },

  // ==================== SECTION 7: INSERT ====================
  {
    id: 33,
    type: 'concept',
    title: "Menambah Data Baru",
    section: "Modifikasi Data",
    description: "Memahami cara menambah data dengan INSERT INTO.",
    content: "INSERT INTO adalah perintah untuk menambahkan baris baru ke dalam tabel.\n\nSINTAKS DASAR:\nINSERT INTO nama_tabel (kolom1, kolom2, kolom3)\nVALUES (nilai1, nilai2, nilai3)\n\nCONTOH:\nINSERT INTO users (name, age, job) VALUES ('John', 30, 'Developer')\n\nPENTING:\n• Urutan nilai harus sesuai dengan urutan kolom\n• String/teks harus diapit tanda kutip\n• Angka tidak perlu tanda kutip\n• ID biasanya otomatis ditambahkan oleh sistem",
    points: 10,
    visualDemo: {
      tableName: "users",
      demoQuery: "INSERT INTO users (name, age, job) VALUES ('Neo', 32, 'Hacker')",
      steps: [
        { action: "showTable", description: "Tabel users saat ini memiliki 4 baris" },
        { action: "highlightColumn", column: "name", description: "Kolom 'name' - akan diisi 'Neo'" },
        { action: "highlightColumn", column: "age", description: "Kolom 'age' - akan diisi 32" },
        { action: "highlightColumn", column: "job", description: "Kolom 'job' - akan diisi 'Hacker'" },
        { action: "runQuery", query: "INSERT INTO users (name, age, job) VALUES ('Neo', 32, 'Hacker')", description: "INSERT menambahkan baris baru ke tabel" }
      ]
    }
  },
  {
    id: 34,
    type: 'query',
    title: "Rekrut Agen Baru",
    section: "Modifikasi Data",
    description: "Tambahkan pengguna baru bernama 'Neo' berusia 32 dengan pekerjaan 'Hacker'.",
    briefing: "REKRUT BARU BERGABUNG. MASUKKAN PROFIL AGEN 'NEO' KE DALAM SISTEM. USIA 32, SPESIALISASI: HACKER.",
    query: "INSERT INTO users (name, age, job) VALUES ('Neo', 32, 'Hacker')",
    points: 50
  },
  {
    id: 35,
    type: 'quiz',
    title: "Cek Protokol: INSERT",
    section: "Modifikasi Data",
    description: "Verifikasi pemahaman tentang INSERT INTO.",
    question: "Sintaks mana yang benar untuk menambahkan data baru?",
    options: [
      "ADD INTO users VALUES ('John', 25)",
      "INSERT users (name, age) SET ('John', 25)",
      "INSERT INTO users (name, age) VALUES ('John', 25)",
      "CREATE ROW users (name='John', age=25)"
    ],
    correctAnswer: 2,
    points: 10
  },

  // ==================== SECTION 8: UPDATE ====================
  {
    id: 36,
    type: 'concept',
    title: "Mengubah Data",
    section: "Modifikasi Data",
    description: "Memahami cara mengubah data dengan UPDATE.",
    content: "UPDATE adalah perintah untuk mengubah data yang sudah ada dalam tabel.\n\nSINTAKS:\nUPDATE nama_tabel\nSET kolom1 = nilai_baru\nWHERE kondisi\n\nCONTOH:\nUPDATE users SET age = 30 WHERE name = 'Alice'\n\nPERINGATAN: Selalu gunakan WHERE saat UPDATE!\nTanpa WHERE, SEMUA baris akan diubah!\n\nUPDATE MULTIPLE KOLOM:\nUPDATE users SET age = 30, job = 'Manager' WHERE id = 1",
    points: 10,
    visualDemo: {
      tableName: "users",
      demoQuery: "UPDATE users SET job = 'Senior Engineer' WHERE name = 'Charlie'",
      steps: [
        { action: "showTable", description: "Tabel users - Charlie saat ini adalah Engineer" },
        { action: "highlightRow", row: 2, description: "Baris Charlie yang akan diubah" },
        { action: "highlightColumn", column: "job", description: "Kolom 'job' yang akan di-UPDATE" },
        { action: "highlightColumn", column: "name", description: "WHERE name = 'Charlie' - kondisi filter" },
        { action: "runQuery", query: "UPDATE users SET job = 'Senior' WHERE name = 'Charlie'", description: "UPDATE mengubah job Charlie menjadi Senior" }
      ]
    }
  },
  {
    id: 37,
    type: 'query',
    title: "Promosi Charlie",
    section: "Modifikasi Data",
    description: "Ubah pekerjaan Charlie menjadi 'Senior Engineer'.",
    briefing: "AGEN CHARLIE TELAH MEMBUKTIKAN KEMAMPUANNYA. UPDATE STATUSNYA MENJADI 'SENIOR ENGINEER'.",
    query: "UPDATE users SET job = 'Senior Engineer' WHERE name = 'Charlie'",
    points: 55
  },
  {
    id: 38,
    type: 'quiz',
    title: "Cek Protokol: UPDATE",
    section: "Modifikasi Data",
    description: "Verifikasi pemahaman tentang UPDATE.",
    question: "Apa yang terjadi jika menjalankan UPDATE tanpa klausa WHERE?",
    options: [
      "Query akan error",
      "Tidak ada yang berubah",
      "Semua baris dalam tabel akan diubah",
      "Hanya baris pertama yang berubah"
    ],
    correctAnswer: 2,
    points: 10
  },

  // ==================== SECTION 9: DELETE ====================
  {
    id: 39,
    type: 'concept',
    title: "Menghapus Data",
    section: "Modifikasi Data",
    description: "Memahami cara menghapus data dengan DELETE.",
    content: "DELETE adalah perintah untuk menghapus baris dari tabel.\n\nSINTAKS:\nDELETE FROM nama_tabel WHERE kondisi\n\nCONTOH:\nDELETE FROM users WHERE id = 5\n\nPERINGATAN KRITIS:\n• Selalu gunakan WHERE saat DELETE!\n• Tanpa WHERE, SEMUA data akan terhapus!\n• Operasi DELETE tidak bisa di-undo dengan mudah\n• Selalu backup data sebelum menghapus\n\nBEST PRACTICE:\nJalankan SELECT dengan kondisi yang sama terlebih dahulu untuk memastikan data yang akan dihapus sudah benar.",
    points: 10
  },
  {
    id: 40,
    type: 'query',
    title: "Hapus Pesanan Pending",
    section: "Modifikasi Data",
    description: "Hapus pesanan dengan status 'pending'.",
    briefing: "OPERASI PEMBERSIHAN. HAPUS SEMUA PESANAN YANG MASIH PENDING DARI SISTEM.",
    query: "DELETE FROM orders WHERE status = 'pending'",
    points: 55
  },
  {
    id: 41,
    type: 'quiz',
    title: "Cek Protokol: DELETE",
    section: "Modifikasi Data",
    description: "Uji pemahaman tentang DELETE.",
    question: "Mengapa kita harus berhati-hati saat menggunakan DELETE?",
    options: [
      "Karena syntaxnya rumit",
      "Karena prosesnya lambat",
      "Karena data yang dihapus sulit dikembalikan",
      "Karena membutuhkan izin admin"
    ],
    correctAnswer: 2,
    points: 10
  },

  // ==================== FINAL MISSION ====================
  {
    id: 42,
    type: 'concept',
    title: "Misi Selesai",
    section: "Final",
    description: "Selamat! Anda telah menyelesaikan semua misi.",
    content: "SELAMAT, AGEN!\n\nAnda telah berhasil menguasai dasar-dasar SQL:\n\n✓ SELECT - Mengambil data\n✓ WHERE - Memfilter data\n✓ ORDER BY - Mengurutkan data\n✓ LIMIT - Membatasi hasil\n✓ Fungsi Agregasi (COUNT, SUM, AVG, MAX, MIN)\n✓ GROUP BY - Mengelompokkan data\n✓ HAVING - Filter setelah pengelompokan\n✓ JOIN - Menggabungkan tabel\n✓ INSERT - Menambah data\n✓ UPDATE - Mengubah data\n✓ DELETE - Menghapus data\n\nAnda sekarang siap untuk misi-misi yang lebih kompleks di dunia nyata. Tetap berlatih dan perluas pengetahuan Anda!\n\nKODE NETRUNNER: APPROVED",
    points: 100
  }
];
