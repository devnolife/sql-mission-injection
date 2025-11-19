export const lessons = [
  // SECTION 0: FUNDAMENTALS (CONCEPT & QUIZ)
  {
    id: 1,
    type: 'concept',
    title: "Matriks Data",
    section: "Dasar-Dasar",
    description: "Memahami apa itu Database.",
    content: "Di dunia digital, informasi adalah kekuatan. Tapi data mentah adalah kekacauan. Untuk mengendalikannya, kita menggunakan DATABASE.\n\nBayangkan database seperti gudang besar yang aman. Di dalamnya, data tidak hanya ditumpuk; itu diatur ke dalam TABEL. Tabel itu seperti spreadsheet: baris adalah catatan individu (seperti pengguna tertentu), dan kolom adalah atribut (seperti nama, usia, pekerjaan).\n\nSQL (Structured Query Language) adalah kunci gudang ini. Ini adalah bahasa yang kita gunakan untuk mengajukan pertanyaan ke database, atau 'Queries'. Dengan SQL, kita dapat mengambil, memfilter, mengurutkan, dan memanipulasi data dengan presisi bedah.",
    points: 5
  },
  {
    id: 2,
    type: 'concept',
    title: "Asal Usul Kode",
    section: "Dasar-Dasar",
    description: "Sejarah singkat SQL.",
    content: "Pada awal 1970-an, di Laboratorium Riset IBM San Jose, model relasional baru untuk data lahir. Dua peneliti, Donald Chamberlin dan Raymond Boyce, mengembangkan bahasa yang disebut SEQUEL (Structured English Query Language).\n\nKemudian disingkat menjadi SQL (karena masalah merek dagang), itu menjadi standar untuk berkomunikasi dengan database relasional. Hari ini, baik itu bank, jejaring sosial, atau server pemerintah rahasia, SQL adalah bahasa yang menjalankan dunia.",
    points: 5
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
    content: "DATABASE RELASIONAL adalah sistem yang menyimpan data dalam tabel-tabel yang saling terhubung melalui relasi. Contoh: sistem perbankan yang menghubungkan tabel 'Nasabah' dengan tabel 'Rekening' dan 'Transaksi'.\n\nTERMINOLOGI KUNCI:\n• ROW (Baris): Satu record lengkap dalam tabel (contoh: data satu pengguna)\n• COLUMN (Kolom): Satu atribut/field dalam tabel (contoh: 'nama' atau 'email')\n• FIELD: Titik pertemuan antara row dan column (contoh: nama 'John' di baris user#5)\n• PRIMARY KEY: Identifier unik untuk setiap row (contoh: user_id yang tidak boleh duplikat)\n• FOREIGN KEY: Column yang mereferensikan PRIMARY KEY dari tabel lain (contoh: order.user_id yang menunjuk ke users.id)\n\nRELEVANSI DALAM KEHIDUPAN:\nSetiap kali Anda login media sosial, pesan ojek online, atau transfer uang, database relasional bekerja di balik layar. Mereka memastikan data Anda aman, terstruktur, dan dapat diakses dalam milidetik.",
    points: 5
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
  {
    id: 6,
    type: 'quiz',
    title: "Cek Protokol: Table Keys",
    section: "Dasar-Dasar",
    description: "Verifikasi pengetahuan tentang foreign key.",
    question: "Apa fungsi dari FOREIGN KEY dalam database relasional?",
    options: [
      "Mengunci tabel agar tidak bisa diedit",
      "Membuat backup otomatis dari data",
      "Menghubungkan data antar tabel melalui referensi ke primary key tabel lain",
      "Mengenkripsi data sensitif"
    ],
    correctAnswer: 2,
    points: 10
  },
  {
    id: 7,
    type: 'quiz',
    title: "Cek Protokol: Terminology",
    section: "Dasar-Dasar",
    description: "Uji pengetahuan terminologi database.",
    question: "Dalam konteks database, apa yang dimaksud dengan ROW (baris)?",
    options: [
      "Nama tabel dalam database",
      "Satu record lengkap yang berisi semua atribut",
      "Header kolom di bagian atas tabel",
      "Query SQL yang dijalankan"
    ],
    correctAnswer: 1,
    points: 10
  },

  // SECTION 1: BASIC RECONNAISSANCE (SELECT)
  {
    id: 8,
    type: 'query',
    title: "Identifikasi Target",
    section: "Pengintaian",
    description: "Ambil daftar lengkap pengguna dari database.",
    briefing: "AGEN, KITA TELAH MENEMBUS PERIMETER. TUGAS PERTAMA ANDA ADALAH MENGIDENTIFIKASI SEMUA TARGET POTENSIAL DI DALAM SISTEM. EKSTRAK REGISTRI PENGGUNA LENGKAP.",
    query: "SELECT * FROM users",
    points: 10
  },
  {
    id: 9,
    type: 'concept',
    title: "Perintah SELECT",
    section: "Pengintaian",
    description: "Pelajari tentang pernyataan SELECT.",
    content: "Perintah SELECT adalah mata Anda di dunia digital. Ini memberi tahu database kolom MANA yang ingin Anda lihat.\n\nMenggunakan 'SELECT *' berarti 'tunjukkan semuanya'. Tanda bintang (*) adalah wildcard yang cocok dengan semua kolom.\n\nNamun, dalam infiltrasi nyata, bandwidth sangat berharga. Netrunner berpengalaman sering menentukan dengan tepat kolom mana yang mereka butuhkan (mis., 'SELECT name, email') untuk menghindari deteksi dan mempercepat transfer data.",
    points: 5
  },
  {
    id: 10,
    type: 'query',
    title: "Kolom Spesifik",
    section: "Pengintaian",
    description: "Pilih hanya nama dan pekerjaan dari semua pengguna.",
    briefing: "BANDWIDTH TERBATAS. BERHENTI MENGUNDUH DATA SAMPAH. EKSTRAK HANYA NAMA DAN JUDUL PEKERJAAN. KITA TIDAK BUTUH SISANYA.",
    query: "SELECT name, job FROM users",
    points: 25
  },
  {
    id: 11,
    type: 'query',
    title: "Filter berdasarkan Usia",
    section: "Pengintaian",
    description: "Temukan semua pengguna yang berusia 25 tahun atau lebih.",
    briefing: "KERJA BAGUS. SEKARANG KITA PERLU MEMPERSEMPIT DAFTAR. FOKUS PADA TARGET DEWASA. FILTER REGISTRI UNTUK INDIVIDU BERUSIA 25 TAHUN ATAU LEBIH.",
    query: "SELECT * FROM users WHERE age >= 25",
    points: 15
  },
  {
    id: 12,
    type: 'concept',
    title: "Penargetan Presisi",
    section: "Pengintaian",
    description: "Memahami kekuatan klausa WHERE.",
    content: "Bayangkan database dengan satu miliar pengguna. Meminta 'SELECT *' akan membuat sistem Anda crash dan memperingatkan setiap bot keamanan di jaringan.\n\nKlausa WHERE adalah alat siluman Anda. Ini memfilter data SEBELUM meninggalkan server database. Ini meminimalkan penggunaan bandwidth dan menjaga jejak Anda tetap kecil. Selalu filter sedini mungkin.",
    points: 5
  },
  {
    id: 13,
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
    id: 14,
    type: 'query',
    title: "Lokasi Insinyur",
    section: "Pengintaian",
    description: "Temukan semua pengguna dengan judul pekerjaan 'Engineer'.",
    briefing: "KITA BUTUH AKSES TEKNIS. TEMUKAN INSINYUR SISTEM. MEREKA MEMEGANG KUNCI KE LEVEL YANG LEBIH DALAM.",
    query: "SELECT * FROM users WHERE job = 'Engineer'",
    points: 20
  },

  // SECTION 2: DATA MANIPULATION (ORDER & LIMIT)
  {
    id: 15,
    type: 'query',
    title: "Urutkan berdasarkan Usia",
    section: "Manipulasi Data",
    description: "Daftar semua pengguna diurutkan berdasarkan usia dalam urutan menaik.",
    briefing: "DATA INI BERANTAKAN. ORGANISASIKAN. URUTKAN TARGET BERDASARKAN USIA, DARI YANG TERMUDA HINGGA TERTUA.",
    query: "SELECT * FROM users ORDER BY age ASC",
    points: 30
  },
  {
    id: 16,
    type: 'query',
    title: "Penghasil Teratas",
    section: "Manipulasi Data",
    description: "Temukan 3 pengguna teratas dengan id tertinggi (mensimulasikan pendaftaran terbaru).",
    briefing: "KITA BUTUH REKRUTAN TERBARU. AMBIL 3 ENTRI TERAKHIR YANG DITAMBAHKAN KE SISTEM.",
    query: "SELECT * FROM users ORDER BY id DESC LIMIT 3",
    points: 35
  },

  // SECTION 3: AGGREGATION (COUNT, SUM, AVG)
  {
    id: 17,
    type: 'query',
    title: "Hitung Target",
    section: "Agregasi",
    description: "Hitung jumlah total pengguna.",
    briefing: "LAPORAN SITREP DIMINTA. BERAPA BANYAK TOTAL TARGET YANG KITA HADAPI? BERIKAN SAYA JUMLAH KEPALA.",
    query: "SELECT COUNT(*) FROM users",
    points: 40
  },
  {
    id: 18,
    type: 'query',
    title: "Usia Rata-rata",
    section: "Agregasi",
    description: "Hitung usia rata-rata semua pengguna.",
    briefing: "PROFILING SEDANG BERLANGSUNG. TENTUKAN USIA RATA-RATA BASIS PENGGUNA UNTUK MENYESUAIKAN PROTOKOL REKAYASA SOSIAL KITA.",
    query: "SELECT AVG(age) FROM users",
    points: 45
  },

  // SECTION 4: COMPLEX QUERIES (JOIN & SUBQUERY)
  {
    id: 19,
    type: 'query',
    title: "Riwayat Pesanan",
    section: "Deep Dive",
    description: "Temukan semua pesanan yang dibuat oleh 'Alice'. (Gunakan JOIN)",
    briefing: "TARGET 'ALICE' ADALAH ORANG YANG DIMINATI. REFERENSI SILANG REGISTRI PENGGUNA DENGAN LOG PESANAN. TEMUKAN SEMUA YANG DIA BELI.",
    query: "SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.name = 'Alice'",
    points: 60
  },
  {
    id: 20,
    type: 'query',
    title: "Target Bernilai Tinggi",
    section: "Deep Dive",
    description: "Temukan pengguna yang telah memesan 'Laptop'. (Gunakan Subquery)",
    briefing: "KITA MENCARI PEMBELI TEKNOLOGI. IDENTIFIKASI PENGGUNA MANA PUN YANG TELAH MEMBELI 'LAPTOP'. GUNAKAN SUBQUERY UNTUK MEMFILTER ID.",
    query: "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE product = 'Laptop')",
    points: 75
  }
];
