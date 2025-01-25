CREATE DATABASE IF NOT EXISTS db_petani_pintar;
USE db_petani_pintar;


/* Tabel User dan Authentication */
CREATE TABLE Pengguna (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    pengalaman TEXT NULL,
    tentang TEXT NULL,
    alamat VARCHAR(255) NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NULL,
    pekerjaan VARCHAR(255) NULL,
    no_hp VARCHAR(15) NULL,
    kata_sandi VARCHAR(255) NOT NULL,
    peran ENUM('petani', 'admin') DEFAULT 'petani',
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Tabel Autentikasi */
CREATE TABLE Autentikasi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pengguna_id INT,
    token VARCHAR(255) NOT NULL,
    kedaluwarsa_pada TIMESTAMP,
    FOREIGN KEY (pengguna_id) REFERENCES Pengguna(id) ON DELETE CASCADE
);

/* Tabel Profil */
CREATE TABLE Profil (
    pengguna_id INT PRIMARY KEY,
    nama VARCHAR(255),
    lokasi VARCHAR(255),
    metode_pertanian TEXT,
    produk_ditawarkan TEXT,
    bio TEXT,
    gambar VARCHAR(255), 
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengguna_id) REFERENCES Pengguna(id) ON DELETE CASCADE
);

/* Tabel Forum */
CREATE TABLE Forum (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Tabel Thread */
CREATE TABLE Thread (
    id INT PRIMARY KEY AUTO_INCREMENT,
    forum_id INT,
    pengguna_id INT,
    judul VARCHAR(255) NOT NULL,
    konten TEXT,
	gambar VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES Forum(id) ON DELETE CASCADE,
    FOREIGN KEY (pengguna_id) REFERENCES Pengguna(id) ON DELETE CASCADE
);

/* Tabel Thread Komentar */
CREATE TABLE Thread_Komentar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    thread_id INT,
    pengguna_id INT,
    konten TEXT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES Thread(id) ON DELETE CASCADE,
    FOREIGN KEY (pengguna_id) REFERENCES Pengguna(id) ON DELETE CASCADE
);

/* Tabel Chat */
CREATE TABLE Chat (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pengirim_id INT,
    penerima_id INT,
    pesan TEXT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengirim_id) REFERENCES Pengguna(id) ON DELETE CASCADE,
    FOREIGN KEY (penerima_id) REFERENCES Pengguna(id) ON DELETE CASCADE
);

/* Tabel Blog */
CREATE TABLE Blog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pengguna_id INT,
    judul VARCHAR(255) NOT NULL,
    konten TEXT,
    kategori VARCHAR(255),
	gambar VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengguna_id) REFERENCES Pengguna(id) ON DELETE CASCADE
);

/* Tabel Berita */
CREATE TABLE Berita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(255) NOT NULL,
    konten TEXT,
	gambar VARCHAR(255),
    diterbitkan_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Tabel Acara */
CREATE TABLE Acara (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    tanggal TIMESTAMP NOT NULL,
    lokasi VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Tabel Kategori */
CREATE TABLE Kategori (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    jenis VARCHAR(255) NOT NULL,
	gambar VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Tabel Produk */
CREATE TABLE Produk (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pengguna_id INT,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    kategori_id INT,
    harga DECIMAL(10, 2),
    lokasi VARCHAR(255),
    stok INT,
    gambar VARCHAR(255),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengguna_id) REFERENCES Pengguna(id) ON DELETE CASCADE,
    FOREIGN KEY (kategori_id) REFERENCES Kategori(id) ON DELETE CASCADE
);

CREATE TABLE Suka (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pengguna_id INT,
    produk_id INT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengguna_id) REFERENCES Pengguna(id) ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES Produk(id) ON DELETE CASCADE,
    UNIQUE (pengguna_id, produk_id)
);

/* Produk Komentar */
CREATE TABLE Produk_Komentar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produk_id INT,
    pengguna_id INT,
    konten TEXT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produk_id) REFERENCES Produk(id) ON DELETE CASCADE,
    FOREIGN KEY (pengguna_id) REFERENCES Pengguna(id) ON DELETE CASCADE
);

/* Tabel Edukasi */
CREATE TABLE Edukasi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(255) NOT NULL,
    konten TEXT,
    kategori_id INT,
	gambar VARCHAR(255),
    diterbitkan_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES Kategori(id) ON DELETE CASCADE
);

/* Tabel Aktivitas */
CREATE TABLE Aktivitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jenis_aktivitas VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- DATA DUMMY

/* Data Dummy Pengguna */
INSERT INTO Pengguna (nama, email, alamat, jenis_kelamin, pekerjaan, no_hp, kata_sandi, peran)
VALUES 
('Admin', 'admin@example.com', 'Jl. Merdeka 10, Bandung', 'Laki-laki', 'Admin', '081234567890', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'admin'),
('Putri Sangkot Meliati', 'johndoe@example.com', 'Jl. Kemerdekaan 15, Jakarta', 'Perempuan', 'Petani', '082234567891', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Siti Aminah Widodo', 'siti@example.com', 'Jl. Sudirman 20, Surabaya', 'Perempuan', 'Petani Sayur', '083234567892', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Budi Santoso', 'budi@example.com', 'Jl. Pemuda 5, Yogyakarta', 'Laki-laki', 'Petani Jagung', '084234567893', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Ani Lestari', 'ani@example.com', 'Jl. Pahlawan 12, Semarang', 'Perempuan', 'Petani Buah', '085234567894', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Rudi Hartono', 'rudi@example.com', 'Jl. Diponegoro 8, Medan', 'Laki-laki', 'Petani Kopi', '086234567895', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Dewi Kusuma', 'dewi@example.com', 'Jl. Pattimura 17, Makassar', 'Perempuan', 'Petani Teh', '087234567896', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Tono Sugiarto', 'tono@example.com', 'Jl. Ahmad Yani 21, Malang', 'Laki-laki', 'Petani Kelapa Sawit', '088234567897', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Lina Anggraini', 'lina@example.com', 'Jl. Kartini 19, Bali', 'Perempuan', 'Petani Anggur', '089234567898', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Hendra Wijaya', 'hendra@example.com', 'Jl. Merapi 2, Padang', 'Laki-laki', 'Petani Beras', '081134567899', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Rina Sari', 'rina@example.com', 'Jl. Sumatra 14, Pontianak', 'Perempuan', 'Petani Cokelat', '082134567800', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Andi Pratama', 'andi@example.com', 'Jl. Flores 3, Palu', 'Laki-laki', 'Petani Karet', '083134567801', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani'),
('Maya Permata', 'maya@example.com', 'Jl. Kalimantan 25, Banjarmasin', 'Perempuan', 'Petani Padi', '084134567802', '$2b$10$ZPlbvzYqw8LZt0YO/BiBEuKDk532cRtywv5xlNFsAtWS1ZYqIIcQy', 'petani');

/* Data Dummy Profil */
INSERT INTO Profil (pengguna_id, nama, lokasi, metode_pertanian, produk_ditawarkan, bio, gambar)
VALUES 
(1, 'John Doe', 'Bandung', 'Hidroponik', 'Sayuran Organik', 'Petani dengan pengalaman lebih dari 5 tahun', '/uploads/1732021427380.png'),
(2, 'Putri Sangkot Meliati', 'Jakarta', 'Tradisional', 'Padi dan Jagung', 'Mengelola komunitas petani di daerah Jakarta', '/uploads/1733982719766.jpg'),
(3, 'Siti Aminah Widodo', 'Surabaya', 'Organik', 'Sayuran Hijau', 'Berfokus pada pertanian sayuran organik', '/uploads/1734096321530.jpg'),
(4, 'Budi Santoso', 'Yogyakarta', 'Hidroponik', 'Jagung Manis', 'Petani dengan keahlian dalam teknologi hidroponik', '/uploads/1734096351710.jpg'),
(5, 'Ani Lestari', 'Semarang', 'Organik', 'Buah-buahan Tropis', 'Memproduksi buah-buahan tropis berkualitas tinggi', '/uploads/1734096371754.png'),
(6, 'Rudi Hartono', 'Medan', 'Tradisional', 'Biji Kopi', 'Berpengalaman dalam pengolahan kopi sejak 10 tahun', '/uploads/1734096387466.jpg'),
(7, 'Dewi Kusuma', 'Makassar', 'Organik', 'Daun Teh Hijau', 'Mengelola kebun teh hijau organik', '/uploads/1734096406047.jpg'),
(8, 'Tono Sugiarto', 'Malang', 'Konvensional', 'Kelapa Sawit', 'Ahli dalam manajemen kebun kelapa sawit', '/uploads/1734096425931.jpg'),
(9, 'Lina Anggraini', 'Bali', 'Hidroponik', 'Anggur Merah', 'Petani anggur dengan metode modern hidroponik', '/uploads/1734096449564.png'),
(10, 'Hendra Wijaya', 'Padang', 'Tradisional', 'Beras Putih', 'Memproduksi beras putih berkualitas untuk ekspor', '/uploads/1734096470637.jpg'),
(11, 'Rina Sari', 'Pontianak', 'Organik', 'Kakao', 'Berfokus pada produksi kakao organik', '/uploads/1734096564230.jpg'),
(12, 'Andi Pratama', 'Palu', 'Konvensional', 'Karet Alam', 'Petani dengan fokus pada produksi karet alami', '/uploads/1734096513489.jpg'),
(13, 'Maya Permata', 'Banjarmasin', 'Tradisional', 'Padi Merah', 'Mengedepankan metode tradisional dalam menanam padi merah', '/uploads/1732021427380.png');

/* Data Dummy Forum */
INSERT INTO Forum (nama, deskripsi)
VALUES 
('Diskusi Umum', 'Forum untuk diskusi berbagai topik pertanian'),
('Hidroponik', 'Diskusi seputar metode pertanian hidroponik'),
('Tanaman Pangan', 'Forum yang berfokus pada tanaman pangan seperti padi dan jagung');

/* Data Dummy Thread */
INSERT INTO Thread (forum_id, pengguna_id, judul, konten)
VALUES 
(1, 1, 'Cara Menanam Tomat', 'Ada yang tahu cara terbaik menanam tomat secara organik?'),
(2, 2, 'Perawatan Tanaman Hidroponik', 'Apa saja tips perawatan tanaman hidroponik?'),
(3, 3, 'Harga Pupuk Melonjak', 'Kenapa harga pupuk melonjak akhir-akhir ini?');

/* Data Dummy Komentar */
INSERT INTO Thread_Komentar (thread_id, pengguna_id, konten)
VALUES 
(1, 2, 'Saya biasa menggunakan pupuk kompos untuk hasil yang lebih baik'),
(2, 1, 'Pastikan pH air tetap stabil agar tanaman tumbuh optimal'),
(3, 3, 'Kemungkinan karena biaya bahan baku yang meningkat');

/* Data Dummy Chat */
INSERT INTO Chat (pengirim_id, penerima_id, pesan)
VALUES 
(2, 3, 'Apakah kamu sudah mencoba metode hidroponik yang baru?'),
(2, 4, 'Saya ingin tahu lebih banyak tentang alat irigasi tetes, bisa bantu?'),
(3, 5, 'Terima kasih sudah memberikan informasi tentang pupuk hayati.'),
(4, 6, 'Apakah Anda punya rekomendasi mesin pengering daun teh?'),
(5, 7, 'Halo, saya tertarik dengan benih melon unggul. Bagaimana cara mendapatkannya?'),
(6, 8, 'Terima kasih untuk panduan tanam cabai, sangat berguna.'),
(7, 9, 'Apakah ada produk lain selain pupuk organik cair yang cocok untuk sayuran?'),
(8, 10, 'Halo, saya ingin berdiskusi tentang penggunaan pestisida nabati.'),
(9, 2, 'Kapan biasanya waktu terbaik untuk mulai menanam padi varietas unggul?'),
(3, 4, 'Apakah Anda sudah mencoba pupuk kompos granul yang baru?'),
(5, 6, 'Saya membutuhkan alat untuk mengukur pH tanah. Ada rekomendasi?'),
(7, 8, 'Terima kasih atas informasinya tentang alat penanam bibit padi.'),
(9, 10, 'Bagaimana cara mengatasi penyakit pada tanaman jagung?'),
(4, 3, 'Apakah bibit cabai hibrida bisa digunakan untuk daerah dataran tinggi?'),
(6, 5, 'Berapa lama waktu pengiriman untuk produk mesin pemipil jagung?'),
(8, 7, 'Saya ingin berbagi pengalaman menggunakan pupuk NPK, hasilnya sangat memuaskan.'),
(10, 9, 'Apakah ada alat yang dapat membantu meningkatkan efisiensi pengairan kebun?');

/* Data Dummy Blog */
INSERT INTO Blog (pengguna_id, judul, konten, kategori, gambar)
VALUES 
(1, 'Manfaat Hidroponik', 'Hidroponik dapat meningkatkan hasil panen secara signifikan', 'Pertanian', ''),
(2, 'Tips Bertani Organik', 'Menggunakan pupuk kompos untuk hasil yang lebih alami', 'Pertanian Organik', ''),
(3, 'Penyakit Tanaman Padi', 'Cara mengenali dan mengatasi penyakit pada tanaman padi', 'Tanaman Pangan', ''),
(4, 'Hidroponik untuk Pemula', 'Panduan lengkap bagi pemula yang ingin memulai hidroponik', 'Hidroponik', ''),
(4, 'Keuntungan Menanam Jagung Hidroponik', 'Jagung hidroponik dapat menghasilkan panen yang lebih cepat', 'Pertanian', ''),
(5, 'Buah Tropis Unggulan di Indonesia', 'Indonesia memiliki berbagai buah tropis unggulan seperti mangga dan durian', 'Buah-buahan', ''),
(5, 'Cara Mengelola Kebun Buah Secara Organik', 'Teknik mengelola kebun buah tanpa menggunakan bahan kimia', 'Pertanian Organik', ''),
(6, 'Proses Pengolahan Kopi', 'Langkah-langkah dalam mengolah kopi berkualitas tinggi', 'Tanaman Perkebunan', ''),
(6, 'Sejarah Kopi di Sumatera', 'Perkembangan kopi di Sumatera dari masa ke masa', 'Tanaman Pangan', ''),
(7, 'Manfaat Teh Hijau untuk Kesehatan', 'Teh hijau mengandung antioksidan yang baik untuk tubuh', 'Kesehatan', ''),
(7, 'Teknik Menanam Teh Organik', 'Panduan menanam teh tanpa pestisida', 'Tanaman Perkebunan', ''),
(8, 'Kelapa Sawit: Prospek dan Tantangan', 'Analisis peluang dan tantangan dalam bisnis kelapa sawit', 'Ekonomi Pertanian', ''),
(8, 'Pengelolaan Limbah Kelapa Sawit', 'Cara mengelola limbah dari proses produksi kelapa sawit', 'Lingkungan', ''),
(9, 'Budidaya Anggur Merah di Indonesia', 'Tips sukses membudidayakan anggur merah', 'Pertanian', ''),
(9, 'Keunikan Anggur Merah Bali', 'Anggur merah Bali memiliki rasa khas yang unik', 'Buah-buahan', ''),
(10, 'Beras Putih untuk Konsumsi Sehari-hari', 'Manfaat beras putih untuk kebutuhan rumah tangga', 'Tanaman Pangan', ''),
(10, 'Meningkatkan Produktivitas Beras', 'Strategi untuk meningkatkan hasil panen beras', 'Tanaman Pangan', ''),
(11, 'Cokelat Organik: Tren Baru di Pasar', 'Cokelat organik semakin digemari oleh konsumen', 'Tanaman Perkebunan', ''),
(11, 'Mengolah Kakao untuk Cokelat Premium', 'Proses fermentasi dan pengeringan kakao untuk hasil terbaik', 'Tanaman Perkebunan', ''),
(12, 'Industri Karet Alam di Indonesia', 'Karet alam menjadi salah satu komoditas unggulan Indonesia', 'Ekonomi Pertanian', ''),
(12, 'Tips Menanam Karet yang Produktif', 'Cara memilih bibit karet yang berkualitas', 'Tanaman Perkebunan', ''),
(13, 'Padi Merah: Alternatif Sehat untuk Konsumsi', 'Padi merah memiliki banyak manfaat kesehatan', 'Kesehatan', ''),
(13, 'Teknik Tradisional Menanam Padi', 'Panduan metode tradisional dalam bercocok tanam padi', 'Tanaman Pangan', '');

/* Data Dummy Berita */
INSERT INTO Berita (judul, konten, gambar) VALUES
('Teknik Peningkatan Hasil Panen Padi', 
 'Para petani di Desa Makmur mulai menerapkan teknik terbaru yang terbukti mampu meningkatkan hasil panen hingga 30%. Teknik ini melibatkan kombinasi antara penggunaan pupuk organik cair, rotasi tanaman, dan pemantauan hama dengan sistem berbasis teknologi. Dengan metode ini, petani tidak hanya dapat meningkatkan hasil panen, tetapi juga menjaga keseimbangan ekosistem yang mendukung keberlanjutan pertanian.','/uploads/1732603014900.jpg'),
('Penyuluhan Pertanian Organik', 
 'Dinas pertanian mengadakan penyuluhan di Kecamatan Sejahtera dengan tema "Masa Depan Pertanian Organik". Acara ini dihadiri oleh lebih dari 150 petani yang antusias mempelajari cara-cara bertani tanpa bahan kimia sintetis. Selain pembahasan teori, petani juga diajarkan praktik pembuatan pupuk kompos dan pestisida alami.', '/uploads/1732603043147.jpg'),
('Harga Gabah Naik 10%', 
 'Harga gabah kering panen di pasar lokal naik sebesar 10% dibandingkan minggu lalu akibat meningkatnya permintaan pasar domestik dan internasional. Petani optimis harga akan terus stabil, tetapi mereka juga meminta dukungan pemerintah dalam mengontrol harga pupuk yang terus melonjak.', '/uploads/1732603050147.jpg'),
('Pemanfaatan Teknologi Drone dalam Pertanian', 
 'Dalam era modern, teknologi drone semakin banyak digunakan dalam sektor pertanian untuk meningkatkan efisiensi. Dengan kemampuan memantau pertumbuhan tanaman dari udara, drone membantu petani memaksimalkan hasil tanpa perlu menghabiskan banyak waktu di lapangan. Drone juga mampu mengidentifikasi hama secara cepat.', '/uploads/1732603063736.webp'),
('Hama Wereng Menyerang Tanaman Padi', 
 'Hama wereng coklat menyerang lahan pertanian di wilayah Utara, mengakibatkan kerusakan lebih dari 200 hektar sawah. Serangan ini membuat petani kehilangan sebagian besar hasil panen. Untuk itu, dinas pertanian menyarankan penggunaan pengendalian hama berbasis biologis yang lebih ramah lingkungan.', '/uploads/1732603072230.jpg'),
('Pemerintah Luncurkan Subsidi Pupuk Baru', 
 'Subsidi pupuk organik resmi diluncurkan oleh pemerintah untuk mendukung keberlanjutan pertanian. Program ini bertujuan membantu petani kecil yang kesulitan mengakses pupuk berkualitas tinggi. Pupuk organik juga diharapkan dapat meningkatkan kesehatan tanah dalam jangka panjang.', '/uploads/1732603084360.jpg'),
('Workshop Pembuatan Pupuk Kompos', 
 'Kelompok tani Desa Hijau mengadakan workshop pembuatan pupuk kompos dari limbah organik. Workshop ini membantu petani memahami proses fermentasi yang sederhana dan hemat biaya. Selain itu, produk pupuk kompos ini juga dapat dijual sebagai tambahan penghasilan.', '/uploads/1732603097143.jpg'),
('Irigasi Tetes Mulai Diterapkan', 
 'Sistem irigasi tetes mulai digunakan oleh petani hortikultura di wilayah Timur. Sistem ini membantu petani menghemat air hingga 60% dibandingkan metode tradisional. Dengan bantuan teknologi sederhana, hasil panen meningkat secara signifikan meskipun di daerah dengan curah hujan rendah.', '/uploads/1732603110569.jpg'),
('Budidaya Jagung Hibrida untuk Daerah Kering', 
 'Jagung hibrida kini menjadi pilihan utama petani di wilayah yang minim curah hujan. Benih ini mampu tumbuh subur meskipun hanya dengan sedikit air, memberikan hasil panen yang lebih besar dibanding varietas biasa. Petani juga dilatih untuk menggunakan metode tanam bergilir.', '/uploads/1732603119247.jpg'),
('Pelatihan Pengolahan Pasca Panen', 
 'Pelatihan ini bertujuan membantu petani mengolah hasil panen menjadi produk dengan nilai tambah, seperti keripik dari singkong dan tepung dari jagung. Pelatihan melibatkan sesi praktik langsung yang dipandu oleh pelaku industri kecil menengah.', '/uploads/1732603128778.jpg'),
 ('Pameran Teknologi Pertanian Modern', 
 'Pameran yang berlangsung di Kota Hijau menampilkan berbagai inovasi teknologi seperti drone pertanian, alat pengukur kadar air tanah, dan aplikasi pertanian berbasis IoT. Acara ini dihadiri oleh ratusan petani yang tertarik mencoba teknologi tersebut.', 
 '/uploads/1732604014901.jpg'),
('Penyuluhan Tentang Tanaman Hidroponik', 
 'Penyuluhan ini mengajarkan petani cara menanam tanaman hidroponik di lahan terbatas. Teknik ini dinilai sangat cocok untuk daerah perkotaan yang memiliki ruang sempit tetapi tetap ingin memproduksi hasil tani segar.', 
 '/uploads/1732604024902.jpg'),
('Kelangkaan Pupuk Berdampak pada Produksi Padi', 
 'Petani di Kecamatan Damai mengeluhkan sulitnya mendapatkan pupuk urea yang berdampak langsung pada hasil panen. Pemerintah sedang mencari solusi agar distribusi pupuk kembali normal.', 
 '/uploads/1732604034903.jpg'),
('Perkembangan Pasar Tani Digital', 
 'Aplikasi pasar tani berbasis digital semakin diminati oleh petani muda. Melalui aplikasi ini, petani dapat menjual hasil panen mereka langsung ke konsumen tanpa melalui tengkulak, sehingga mendapatkan keuntungan lebih.', 
 '/uploads/1732604044904.jpg'),
('Peningkatan Produksi dengan Tanaman Tumpangsari', 
 'Metode tumpangsari mulai diterapkan oleh petani Desa Harmoni. Dengan menanam beberapa jenis tanaman secara bersamaan, hasil panen meningkat hingga 20% dan tanah menjadi lebih subur.', 
 '/uploads/1732604054905.jpg'),
('Krisis Air di Wilayah Pertanian', 
 'Petani di Desa Tandus menghadapi kesulitan akibat musim kemarau panjang. Pemerintah mulai memberikan bantuan berupa pembangunan sumur bor untuk mengatasi krisis air.', 
 '/uploads/1732604064906.jpg'),
('Pelatihan Manajemen Keuangan untuk Petani', 
 'Dinas pertanian mengadakan pelatihan keuangan untuk petani kecil. Pelatihan ini mengajarkan cara mengelola hasil penjualan dan membuat anggaran untuk pembelian alat dan bibit.', 
 '/uploads/1732604074907.jpg'),
('Kolaborasi Petani dan Startup Agritech', 
 'Beberapa petani di Kabupaten Hijau bekerja sama dengan startup teknologi untuk meningkatkan efisiensi produksi. Kolaborasi ini mencakup pemanfaatan aplikasi pencatatan hasil panen dan prediksi cuaca berbasis data.', 
 '/uploads/1732604084908.jpg'),
('Program Pendanaan untuk Petani Muda', 
 'Program pendanaan khusus untuk petani muda diluncurkan oleh pemerintah. Program ini bertujuan mendorong generasi muda terjun ke sektor pertanian dengan menyediakan modal awal untuk usaha tani.', 
 '/uploads/1732604094909.jpg'),
('Pelatihan Pemanfaatan Limbah Pertanian', 
 'Pelatihan ini membantu petani mengolah limbah pertanian seperti sekam padi dan jerami menjadi produk bernilai jual tinggi seperti pupuk organik dan briket bahan bakar.', 
 '/uploads/1732604104910.jpg'),
('Teknik Pemangkasan untuk Tanaman Buah', 
 'Petani di Desa Sejahtera mempelajari teknik pemangkasan yang tepat untuk meningkatkan hasil buah. Teknik ini telah terbukti meningkatkan produksi hingga 15% dalam satu musim tanam.', 
 '/uploads/1732604114911.jpg'),
('Festival Hasil Tani Lokal', 
 'Festival ini memamerkan berbagai produk hasil tani lokal seperti madu, kopi, dan rempah-rempah. Festival juga menjadi ajang bagi petani untuk memperluas jaringan dengan pembeli potensial.', 
 '/uploads/1732604124912.jpg'),
('Peluang Ekspor Sayuran Organik', 
 'Petani di wilayah Selatan berhasil menjajaki pasar ekspor untuk sayuran organik mereka. Permintaan yang tinggi dari luar negeri menjadi peluang besar untuk meningkatkan pendapatan petani.', 
 '/uploads/1732604134913.jpg'),
('Efisiensi Panen dengan Mesin Modern', 
 'Penggunaan mesin panen otomatis mulai diterapkan oleh petani jagung di Kecamatan Damai. Mesin ini mengurangi waktu panen hingga setengahnya dan meningkatkan efisiensi kerja.', 
 '/uploads/1732604144914.jpg'),
('Tanaman Herbal sebagai Alternatif Usaha', 
 'Petani di Desa Harmoni mulai membudidayakan tanaman herbal seperti jahe dan kunyit. Permintaan yang tinggi dari industri kesehatan membuat usaha ini sangat menjanjikan.', 
 '/uploads/1732604154915.jpg'),
('Penggunaan Benih Unggul untuk Padi', 
 'Benih unggul yang tahan terhadap perubahan iklim mulai diperkenalkan di wilayah Utara. Benih ini memungkinkan petani tetap mendapatkan hasil maksimal meskipun menghadapi cuaca yang tidak menentu.', 
 '/uploads/1732604164916.jpg'),
('Seminar Keseimbangan Ekosistem Pertanian', 
 'Seminar ini membahas pentingnya menjaga keseimbangan ekosistem pertanian dengan memanfaatkan teknologi ramah lingkungan seperti sistem agroforestri.', 
 '/uploads/1732604174917.jpg'),
('Pemanfaatan Biogas di Lahan Pertanian', 
 'Petani di Desa Hijau mulai menggunakan biogas sebagai sumber energi alternatif. Dengan menggunakan limbah ternak, mereka dapat menghemat biaya energi hingga 40%.', 
 '/uploads/1732604184918.jpg'),
('Pendidikan Anak Petani Melalui Beasiswa', 
 'Program beasiswa diluncurkan untuk anak-anak petani berprestasi agar mereka dapat melanjutkan pendidikan hingga perguruan tinggi. Program ini bertujuan menciptakan generasi muda yang lebih terampil.', 
 '/uploads/1732604194919.jpg'),
('Inovasi Alat Penyiram Otomatis', 
 'Inovasi alat penyiram otomatis berbasis IoT mulai diperkenalkan kepada petani. Alat ini dapat diatur melalui smartphone sehingga mempermudah proses penyiraman secara efisien.', 
 '/uploads/1732604204920.jpg');

/* Data Dummy Acara */
INSERT INTO Acara (nama, deskripsi, tanggal, lokasi) VALUES
('Pameran Hasil Pertanian Organik', 
 'Pameran ini menampilkan berbagai produk hasil tani organik, mulai dari sayur-mayur, buah-buahan, hingga olahan makanan seperti keripik dan jus segar. Selain itu, acara ini akan menyelenggarakan lomba inovasi pertanian organik yang melibatkan petani muda di wilayah sekitar.', 
 '2024-12-01', 'Gedung Serbaguna Desa Makmur'),
('Pelatihan Pengendalian Hama', 
 'Workshop ini memberikan edukasi kepada petani tentang cara mengendalikan hama secara alami. Materi mencakup teknik pemanfaatan predator alami, tanaman pengusir hama, hingga pembuatan pestisida dari bahan alami seperti daun mimba dan bawang putih.', 
 '2024-12-05', 'Balai Pertanian Kecamatan Damai'),
('Seminar Teknologi Pertanian', 
 'Seminar ini membahas penggunaan teknologi modern, seperti sensor tanah, drone, dan aplikasi berbasis IoT untuk pertanian pintar. Seminar diakhiri dengan demonstrasi langsung penggunaan alat-alat tersebut di lapangan.', 
 '2024-12-10', 'Aula Kampus IT Del'),
('Lomba Inovasi Pertanian', 
 'Acara ini merupakan lomba inovasi untuk generasi muda di bidang pertanian. Peserta mempresentasikan ide kreatif seperti alat penyiram otomatis berbasis IoT dan sistem tanam hidroponik sederhana. Pemenang akan mendapatkan pendanaan untuk mewujudkan inovasi mereka.', 
 '2024-12-15', 'Lapangan Desa Kreatif'),
('Diskusi Publik tentang Pupuk Organik', 
 'Diskusi ini menghadirkan ahli pertanian dan pemerintah setempat untuk membahas potensi dan tantangan penerapan pupuk organik di tingkat petani kecil. Peserta juga dapat mencoba sampel pupuk organik yang dikembangkan oleh mahasiswa lokal.', 
 '2024-12-18', 'Balai Desa Sejahtera'),
('Bursa Tani 2024', 
 'Ajang pertemuan petani dan distributor alat pertanian, termasuk alat modern seperti traktor mini dan mesin pemanen otomatis. Bursa ini juga menawarkan diskon khusus bagi petani yang membeli alat dalam jumlah besar.', 
 '2024-12-20', 'Gedung Expo Kota Hijau'),
('Pelatihan Irigasi Modern', 
 'Pelatihan ini mengajarkan cara memasang sistem irigasi tetes dan irigasi otomatis untuk kebun kecil. Materi meliputi penggunaan pompa air hemat energi dan pengelolaan sumber daya air yang berkelanjutan.', 
 '2024-12-22', 'Desa Produktif Barat'),
('Festival Panen Raya', 
 'Perayaan ini melibatkan petani lokal untuk memamerkan hasil panen terbaik mereka. Selain itu, terdapat kompetisi memasak berbahan dasar hasil tani seperti jagung dan singkong. Festival ini juga diiringi dengan pentas seni lokal.', 
 '2024-12-25', 'Lapangan Desa Harmoni'),
('Kursus Pembuatan Pupuk Cair', 
 'Kursus ini bertujuan untuk mengajarkan petani membuat pupuk cair berbasis bahan organik seperti kotoran ternak dan limbah dapur. Peserta akan mendapatkan pelatihan praktis dan panduan tertulis untuk pembuatan pupuk di rumah.', 
 '2024-12-28', 'Gedung Pelatihan Desa Makmur'),
('Penyuluhan Diversifikasi Tanaman', 
 'Penyuluhan ini mengedukasi petani tentang pentingnya menanam berbagai jenis tanaman untuk meningkatkan hasil panen. Selain itu, diberikan panduan tentang pengelolaan rotasi tanaman dan manfaat tanaman tumpangsari.', 
 '2024-12-30', 'Balai Penyuluhan Kecamatan Damai'),
 ('Workshop Hidroponik', 
 'Pelatihan intensif mengenai teknik bertani hidroponik untuk skala rumah tangga hingga komersial. Peserta akan mempelajari cara merakit sistem hidroponik sederhana dan memilih nutrisi tanaman yang tepat.', 
 '2025-01-05', 'Aula Desa Hijau'),
('Pelatihan Pertanian Organik', 
 'Acara ini mengajarkan prinsip-prinsip pertanian organik, seperti cara memanfaatkan pupuk alami, manajemen hama ramah lingkungan, dan teknik menanam tanpa pestisida kimia.', 
 '2025-01-08', 'Gedung Serbaguna Desa Harmoni'),
('Festival Teknologi Pertanian', 
 'Acara ini memamerkan inovasi teknologi di sektor pertanian, mulai dari mesin pertanian otomatis hingga aplikasi mobile untuk pengelolaan lahan. Festival juga menampilkan pameran startup agritech.', 
 '2025-01-10', 'Pusat Konvensi Kota Agro'),
('Lomba Desain Lahan Pertanian', 
 'Kompetisi ini menantang petani dan arsitek lanskap untuk mendesain tata letak lahan pertanian yang efisien dan berkelanjutan. Pemenang akan mendapatkan hadiah berupa alat pertanian modern.', 
 '2025-01-12', 'Lapangan Desa Kreatif'),
('Pelatihan Pengolahan Hasil Tani', 
 'Workshop ini mengajarkan cara mengolah hasil tani seperti buah dan sayur menjadi produk bernilai tambah, seperti jus, keripik, dan makanan olahan lainnya.', 
 '2025-01-15', 'Balai Pelatihan Desa Makmur'),
('Seminar Ketahanan Pangan', 
 'Diskusi mendalam tentang tantangan dan solusi dalam mewujudkan ketahanan pangan di masa depan. Materi disampaikan oleh pakar dari universitas ternama dan praktisi lapangan.', 
 '2025-01-18', 'Aula Kampus IT Del'),
('Pameran Produk Olahan Lokal', 
 'Pameran ini menghadirkan produk olahan lokal, seperti keripik singkong, sirup buah, dan sambal khas daerah. Acara ini juga memberikan sesi konsultasi gratis untuk pengembangan bisnis lokal.', 
 '2025-01-20', 'Gedung Kebudayaan Desa Harmoni'),
('Pelatihan Pemasaran Hasil Tani', 
 'Workshop ini membantu petani memasarkan produk mereka secara online melalui media sosial dan marketplace. Peserta juga mendapatkan tips branding produk tani.', 
 '2025-01-23', 'Balai Desa Sejahtera'),
('Bazar Pertanian Ramah Lingkungan', 
 'Ajang pertemuan petani dan pembeli dengan fokus pada produk ramah lingkungan. Bazar ini menyediakan berbagai kebutuhan pertanian organik, termasuk benih dan pupuk alami.', 
 '2025-01-25', 'Lapangan Desa Hijau'),
('Forum Diskusi Petani Muda', 
 'Forum ini menghubungkan petani muda untuk berbagi pengalaman dan ide inovatif di bidang pertanian. Ada sesi networking dan mentoring oleh ahli pertanian.', 
 '2025-01-28', 'Gedung Pemuda Kecamatan Damai'),
('Lokakarya Tanaman Tumpangsari', 
 'Peserta lokakarya ini akan mempelajari cara menanam tanaman tumpangsari untuk meningkatkan hasil panen dan efisiensi lahan. Materi mencakup praktik lapangan.', 
 '2025-01-30', 'Desa Produktif Timur'),
('Pelatihan Pembuatan Biogas', 
 'Pelatihan ini mengajarkan petani cara mengolah limbah organik menjadi biogas untuk kebutuhan energi rumah tangga. Peserta akan mendapatkan alat sederhana untuk praktik di rumah.', 
 '2025-02-02', 'Balai Energi Desa Hijau'),
('Penyuluhan Konservasi Air', 
 'Acara ini memberikan edukasi tentang teknik konservasi air untuk petani di daerah kering, seperti penggunaan embung dan pemanenan air hujan.', 
 '2025-02-05', 'Aula Desa Sejahtera'),
('Lomba Fotografi Pertanian', 
 'Kompetisi ini mengajak petani dan masyarakat umum untuk menangkap momen indah dan inspiratif dari kehidupan pertanian. Foto terbaik akan dipamerkan di galeri lokal.', 
 '2025-02-08', 'Gedung Seni Desa Harmoni'),
('Workshop Pengolahan Limbah Pertanian', 
 'Pelatihan ini mengajarkan cara mengelola limbah pertanian menjadi produk berguna, seperti pupuk kompos dan pakan ternak.', 
 '2025-02-10', 'Balai Pertanian Kecamatan Damai'),
('Festival Kearifan Lokal Pertanian', 
 'Festival ini menampilkan budaya dan tradisi pertanian lokal, seperti alat tradisional, sistem tanam adat, dan makanan khas hasil tani.', 
 '2025-02-12', 'Lapangan Desa Harmoni'),
('Seminar Agribisnis untuk Pemula', 
 'Seminar ini dirancang untuk petani muda yang ingin memulai usaha di bidang agribisnis. Materi mencakup perencanaan bisnis, pemasaran, dan manajemen keuangan.', 
 '2025-02-15', 'Gedung Pemuda Desa Kreatif'),
('Pelatihan Drone untuk Pertanian', 
 'Peserta pelatihan akan belajar cara mengoperasikan drone untuk pemantauan tanaman, pengelolaan irigasi, dan analisis hasil panen.', 
 '2025-02-18', 'Pusat Pelatihan Kota Agro'),
('Acara Donor Darah Petani', 
 'Acara kemanusiaan ini mengajak petani dan masyarakat untuk ikut serta dalam kegiatan donor darah, sekaligus mengedukasi tentang pentingnya kesehatan bagi petani.', 
 '2025-02-20', 'Balai Desa Produktif Barat'),
('Festival Panen Kopi', 
 'Festival ini merayakan musim panen kopi dengan berbagai kegiatan, seperti lomba seduh kopi, pameran varietas kopi lokal, dan tur kebun kopi.', 
 '2025-02-25', 'Lapangan Desa Kopi Jaya');

/* Data Dummy Kategori */
INSERT INTO Kategori (nama, jenis, gambar)
VALUES 
('Sayuran', 'Produk Pertanian', '1111111111111.jpg'),
('Buah-buahan', 'Produk Pertanian', '2222222222222.jpg'),
('Padi', 'Tanaman Pangan', '3333333333333.jpg'),
('Kopi', 'Tanaman Perkebunan', '4444444444444.jpg'),
('Teh', 'Tanaman Perkebunan', '5555555555555.jpg'),
('Kakao', 'Tanaman Perkebunan', '6666666666666.jpg'),
('Kelapa Sawit', 'Produk Pertanian', '7777777777777.jpg');

/* Data Dummy Produk */
INSERT INTO Produk (pengguna_id, nama, deskripsi, kategori_id, harga, lokasi, stok) VALUES
(2, 'Pupuk Organik Cair', 
 'Pupuk cair ini terbuat dari bahan organik berkualitas seperti kotoran ternak, limbah dapur, dan ekstrak tanaman. Proses fermentasi selama 30 hari memastikan pupuk ini kaya akan nutrisi dan mikroorganisme yang bermanfaat untuk memperbaiki kesuburan tanah. Pupuk ini sangat cocok untuk tanaman hortikultura dan padi.', 
 2, 50000, 'Desa Makmur', 100),
(2, 'Benih Padi Unggul', 
 'Benih padi varietas unggul ini dirancang untuk menghasilkan panen yang lebih melimpah dan tahan terhadap hama. Dengan teknologi pemuliaan modern, benih ini mampu tumbuh subur di berbagai kondisi cuaca dan memberikan hasil yang berkualitas tinggi. Direkomendasikan untuk daerah tropis.', 
 1, 30000, 'Kecamatan Damai', 200),
(3, 'Alat Penyemprot Otomatis', 
 'Alat ini mempermudah petani dalam proses penyemprotan pupuk cair atau pestisida ke tanaman. Dilengkapi dengan teknologi hemat energi, alat ini mampu menyemprot hingga 15 liter cairan dalam sekali pengisian. Cocok untuk pertanian skala kecil hingga menengah.', 
 3, 150000, 'Kota Hijau', 50),
(3, 'Kompos Granul', 
 'Kompos granul ini dibuat dari campuran kotoran ternak dan bahan hijauan yang difermentasi. Dengan bentuk butiran, produk ini lebih mudah diaplikasikan di lahan pertanian. Selain itu, granul ini kaya akan unsur hara seperti nitrogen, fosfor, dan kalium yang penting untuk pertumbuhan tanaman.', 
 2, 60000, 'Desa Sejahtera', 120),
(2, 'Bibit Cabai Hibrida', 
 'Bibit cabai hibrida ini memiliki daya tumbuh tinggi dan menghasilkan buah dengan kualitas unggul. Varietas ini tahan terhadap penyakit seperti antraknosa dan dapat dipanen lebih cepat dibandingkan cabai biasa. Sangat ideal untuk petani yang ingin meningkatkan hasil panen cabai mereka.', 
 1, 20000, 'Kecamatan Harmoni', 300),
(3, 'Mesin Pemipil Jagung', 
 'Mesin ini dirancang untuk membantu petani memipil jagung secara cepat dan efisien. Dengan motor bertenaga tinggi, alat ini mampu memipil hingga 200 kg jagung per jam. Cocok untuk petani jagung skala besar yang ingin menghemat waktu dan tenaga.', 
 3, 500000, 'Kota Produktif', 20),
(2, 'Pestisida Nabati', 
 'Pestisida nabati ini terbuat dari bahan alami seperti ekstrak daun mimba, bawang putih, dan cabai. Produk ini efektif untuk mengendalikan hama seperti kutu daun, ulat, dan wereng tanpa merusak lingkungan. Pestisida ini juga aman digunakan untuk tanaman organik.', 
 2, 40000, 'Desa Tani Asri', 150),
(3, 'Alat Pengukur pH Tanah', 
 'Alat ini membantu petani mengetahui tingkat keasaman tanah secara cepat dan akurat. Dengan desain portabel, alat ini mudah digunakan di berbagai jenis lahan. Informasi pH tanah sangat penting untuk menentukan jenis pupuk yang tepat untuk tanaman.', 
 3, 120000, 'Kecamatan Subur', 70),
(2, 'Bibit Tomat Super', 
 'Bibit tomat ini menghasilkan tanaman dengan buah yang besar, manis, dan tahan lama. Selain itu, varietas ini memiliki ketahanan terhadap penyakit layu bakteri dan virus mosaik. Cocok untuk budidaya di dataran rendah maupun tinggi.', 
 1, 25000, 'Kota Hijau', 200),
(3, 'Pupuk Hayati', 
 'Pupuk hayati ini mengandung mikroorganisme hidup yang bermanfaat untuk memperbaiki struktur tanah dan meningkatkan penyerapan nutrisi oleh tanaman. Produk ini sangat cocok digunakan untuk padi, jagung, dan sayuran.', 
 2, 70000, 'Desa Mandiri', 90),
 (4, 'Pupuk Kompos Premium', 
 'Pupuk ini terbuat dari limbah organik yang diformulasikan khusus untuk tanaman sayur dan buah. Memperbaiki struktur tanah dan meningkatkan hasil panen.', 
 2, 80000, 'Desa Bahagia', 120),
(4, 'Alat Irigasi Tetes', 
 'Alat ini memungkinkan pengairan yang efisien dengan meneteskan air langsung ke akar tanaman. Cocok untuk petani modern.', 
 3, 200000, 'Kota Sejuk', 50),
(5, 'Benih Melon Unggul', 
 'Benih melon hibrida yang menghasilkan buah manis dan tahan penyakit. Cocok untuk budidaya di dataran rendah.', 
 1, 35000, 'Desa Harapan', 300),
(5, 'Herbisida Organik', 
 'Herbisida yang efektif membasmi gulma tanpa merusak lingkungan. Aman digunakan untuk berbagai jenis tanaman.', 
 2, 60000, 'Kecamatan Subur', 100),
(6, 'Bibit Kopi Arabika', 
 'Bibit kopi Arabika berkualitas tinggi, cocok untuk dataran tinggi dengan rasa yang kaya.', 
 1, 40000, 'Kota Hijau', 150),
(6, 'Mesin Penggiling Kopi', 
 'Mesin ini dapat menggiling biji kopi secara halus dan konsisten, cocok untuk petani kopi.', 
 3, 750000, 'Desa Mandiri', 20),
(7, 'Teh Hijau Organik', 
 'Teh hijau dari kebun organik, kaya antioksidan dan tanpa bahan kimia.', 
 2, 50000, 'Desa Harmoni', 200),
(7, 'Mesin Pengering Daun Teh', 
 'Mesin pengering untuk menjaga kualitas daun teh setelah panen. Hemat energi dan mudah digunakan.', 
 3, 800000, 'Kota Sejahtera', 15),
(8, 'Bibit Kelapa Sawit Tenera', 
 'Bibit unggul yang menghasilkan tandan buah segar lebih banyak dan berkualitas tinggi.', 
 1, 30000, 'Desa Subur', 250),
(8, 'Pupuk NPK Kelapa Sawit', 
 'Pupuk yang dirancang khusus untuk meningkatkan produktivitas kelapa sawit.', 
 2, 90000, 'Kecamatan Makmur', 180),
(9, 'Bibit Anggur Hitam', 
 'Bibit unggul dengan kualitas buah yang manis dan tahan lama, cocok untuk iklim tropis.', 
 1, 45000, 'Kota Hijau', 120),
(9, 'Jaring Peneduh Kebun', 
 'Jaring ini melindungi tanaman dari sinar matahari langsung dan hama.', 
 3, 120000, 'Desa Harmoni', 70),
(10, 'Berasku Premium', 
 'Beras putih dengan kualitas super, cocok untuk kebutuhan sehari-hari.', 
 2, 55000, 'Kota Damai', 500),
(10, 'Mesin Penanam Padi', 
 'Mesin otomatis untuk menanam padi secara efisien dan menghemat tenaga.', 
 3, 600000, 'Desa Produktif', 30),
(11, 'Cokelat Bubuk Organik', 
 'Cokelat bubuk alami dari kakao organik berkualitas tinggi.', 
 2, 70000, 'Kecamatan Mandiri', 120),
(11, 'Mesin Pengolah Kakao', 
 'Mesin ini membantu petani mengolah biji kakao menjadi bubuk atau cokelat siap jual.', 
 3, 850000, 'Kota Sejahtera', 10),
(12, 'Karet Alam Premium', 
 'Karet dengan kualitas unggul untuk industri manufaktur dan otomotif.', 
 2, 100000, 'Kecamatan Harmoni', 80),
(12, 'Mesin Pemotong Lateks', 
 'Mesin untuk memotong lateks dengan presisi, meningkatkan produktivitas petani karet.', 
 3, 950000, 'Desa Subur', 15),
(13, 'Padi Organik', 
 'Padi bebas bahan kimia, cocok untuk konsumen yang peduli kesehatan.', 
 2, 65000, 'Kota Sejuk', 300),
(13, 'Alat Penanam Bibit Padi', 
 'Alat ini membantu menanam bibit padi secara lebih cepat dan akurat.', 
 3, 400000, 'Kecamatan Bahagia', 40);

 INSERT INTO Produk_Komentar (produk_id, pengguna_id, konten) VALUES
(1, 2, 'Produk ini sangat bagus, kualitasnya luar biasa!'),
(1, 3, 'Harga yang ditawarkan sangat terjangkau dengan kualitas seperti ini.'),
(2, 4, 'Saya sangat puas dengan produk ini, pengiriman cepat dan aman.'),
(3, 5, 'Desain produk ini menarik, namun perlu sedikit peningkatan pada bahan.'),
(4, 6, 'Produk tidak sesuai dengan deskripsi, kecewa dengan pembelian ini.');


/* Data Dummy Edukasi */
INSERT INTO Edukasi (judul, konten, kategori_id, gambar) VALUES
('Manfaat Pupuk Organik untuk Tanah', 
 'Penggunaan pupuk organik membawa banyak manfaat untuk tanah dan tanaman. Pupuk ini meningkatkan kesuburan tanah, memperbaiki struktur tanah, dan menyediakan nutrisi yang lebih alami untuk tanaman. Selain itu, pupuk organik membantu mengurangi penggunaan bahan kimia sintetis yang dapat merusak lingkungan.', 
 1, '/uploads/1732601715647.jpg'),
('Cara Budidaya Padi yang Efisien', 
 'Budidaya padi yang efisien melibatkan pemilihan varietas benih unggul, penyiapan lahan yang baik, dan sistem irigasi yang tepat. Teknik seperti jajar legowo juga dianjurkan untuk meningkatkan hasil panen. Petani perlu memonitor pertumbuhan tanaman secara berkala agar bisa segera menangani masalah seperti hama atau penyakit.', 
 1, '/uploads/1732601727587.jpg'),
('Teknologi Drone untuk Pemantauan Tanaman', 
 'Drone menjadi alat yang semakin populer di kalangan petani modern. Alat ini memungkinkan pemantauan kondisi tanaman dari udara dengan akurasi tinggi. Dengan bantuan drone, petani dapat mengidentifikasi area yang membutuhkan perhatian khusus, seperti daerah yang kekurangan air atau terinfestasi hama.', 
 3, '/uploads/1732602898144.jpg'),
('Pembuatan Pupuk Kompos', 
 'Pupuk kompos merupakan solusi ramah lingkungan untuk memanfaatkan limbah organik. Proses pembuatannya melibatkan pencampuran bahan-bahan seperti dedaunan, limbah dapur, dan kotoran ternak. Setelah melalui proses fermentasi, kompos ini siap digunakan untuk menyuburkan tanah.', 
 2, '/uploads/1732602909400.jpg'),
('Manajemen Air dalam Pertanian', 
 'Manajemen air yang baik sangat penting dalam pertanian, terutama di wilayah dengan curah hujan rendah. Sistem irigasi tetes dan pengelolaan sumber air alternatif seperti embung dapat membantu petani mempertahankan produktivitas lahan mereka.', 
 3, '/uploads/1732602920492.jpg'),
('Rotasi Tanaman untuk Kesuburan Tanah', 
 'Rotasi tanaman adalah praktik penting dalam pertanian berkelanjutan. Dengan menanam tanaman berbeda setiap musim, petani dapat mengurangi risiko penyakit tanah, meningkatkan kesuburan tanah, dan memanfaatkan nutrisi secara lebih efisien.', 
 1, '/uploads/1732602928519.jpg'),
('Keunggulan Tanaman Tumpangsari', 
 'Tumpangsari adalah teknik menanam dua atau lebih jenis tanaman dalam satu lahan. Teknik ini meningkatkan efisiensi lahan dan memberikan keuntungan ganda bagi petani, seperti hasil panen yang lebih banyak dan risiko gagal panen yang lebih rendah.', 
 1, '/uploads/1732602941910.jpg'),
('Teknik Pengendalian Hama Ramah Lingkungan', 
 'Pengendalian hama secara alami melibatkan penggunaan predator alami, pestisida nabati, dan rotasi tanaman. Teknik ini tidak hanya efektif mengendalikan hama, tetapi juga menjaga keseimbangan ekosistem.', 
 2, '/uploads/1732602953753.jpg'),
('Keuntungan Bertani Hidroponik', 
 'Hidroponik adalah metode bertani tanpa tanah yang semakin populer. Metode ini menggunakan air dan larutan nutrisi untuk menumbuhkan tanaman. Keunggulannya meliputi penggunaan lahan yang lebih sedikit, pengurangan kebutuhan air, dan panen yang lebih cepat.', 
 3, '/uploads/1732602970796.jpg'),
('Inovasi Pertanian dengan IoT', 
 'Internet of Things (IoT) membawa revolusi dalam pertanian. Dengan sensor IoT, petani dapat memantau kelembapan tanah, suhu, dan kebutuhan nutrisi tanaman secara real-time, sehingga keputusan pengelolaan lahan menjadi lebih tepat.', 
 3, '/uploads/1732602410973.webp'),
 ('Panduan Menanam Sayuran Organik di Rumah', 
 'Menanam sayuran organik di rumah adalah cara yang mudah untuk mendapatkan bahan makanan sehat. Gunakan pot atau polybag, tanah yang subur, dan pupuk organik untuk hasil terbaik.', 
 1, '/uploads/1732603125698.jpg'),
('Teknik Irigasi Tetes untuk Petani Kecil', 
 'Irigasi tetes adalah solusi hemat air untuk pertanian. Sistem ini mengalirkan air langsung ke akar tanaman, sehingga efisiensi penggunaan air menjadi lebih tinggi.', 
 3, '/uploads/1732603134983.jpg'),
('Pentingnya PH Tanah dalam Pertanian', 
 'Mengetahui pH tanah membantu petani menentukan jenis pupuk dan tanaman yang cocok. Tanah dengan pH netral biasanya ideal untuk sebagian besar tanaman.', 
 2, '/uploads/1732603145670.jpg'),
('Komunitas Petani untuk Peningkatan Produktivitas', 
 'Bergabung dalam komunitas petani membantu berbagi pengetahuan dan pengalaman. Petani dapat saling mendukung dan meningkatkan produktivitas mereka.', 
 3, '/uploads/1732603158992.jpg'),
('Keuntungan Rotasi Tanaman dalam Pertanian Modern', 
 'Rotasi tanaman mencegah penipisan nutrisi tanah dan mengurangi risiko penyakit. Strategi ini menjadi praktik wajib dalam pertanian modern.', 
 2, '/uploads/1732603168050.jpg'),
('Teknologi Pemantauan Tanaman dengan AI', 
 'Pemantauan tanaman berbasis AI membantu petani mendeteksi hama dan penyakit lebih cepat. Teknologi ini memberikan solusi tepat untuk meningkatkan hasil panen.', 
 3, '/uploads/1732603182647.jpg'),
('Pentingnya Penggunaan Benih Unggul', 
 'Benih unggul menghasilkan tanaman yang lebih tahan terhadap hama dan menghasilkan panen yang lebih banyak. Pilih benih yang sesuai dengan kondisi lahan dan iklim Anda.', 
 1, '/uploads/1732603191436.jpg'),
('Pengaruh Pupuk Hayati Terhadap Tanaman', 
 'Pupuk hayati mengandung mikroorganisme yang membantu meningkatkan penyerapan nutrisi oleh tanaman. Selain itu, pupuk ini juga meningkatkan kesuburan tanah secara alami.', 
 2, '/uploads/1732603200225.jpg'),
('Manfaat Tanaman Herbal untuk Kesehatan', 
 'Tanaman herbal seperti jahe, kunyit, dan serai memiliki banyak manfaat kesehatan. Budidaya tanaman ini juga dapat menjadi peluang bisnis yang menguntungkan.', 
 1, '/uploads/1732603217113.jpg'),
('Teknik Pengolahan Tanah untuk Tanaman Hortikultura', 
 'Tanaman hortikultura membutuhkan tanah yang gembur dan kaya nutrisi. Pengolahan tanah dengan cangkul dan pemakaian pupuk organik sangat dianjurkan.', 
 2, '/uploads/1732603234359.jpg'),
('Cara Efektif Menggunakan Pestisida Nabati', 
 'Pestisida nabati ramah lingkungan dan aman untuk tanaman. Gunakan sesuai dosis yang dianjurkan untuk hasil yang optimal.', 
 2, '/uploads/1732603247120.jpg'),
('Potensi Pasar Produk Organik di Indonesia', 
 'Permintaan produk organik terus meningkat. Petani organik memiliki peluang besar untuk memasuki pasar yang berkembang ini.', 
 3, '/uploads/1732603261374.jpg'),
('Teknik Penyemaian Benih Padi', 
 'Penyemaian benih padi yang baik adalah kunci sukses pertumbuhan tanaman. Pastikan benih direndam terlebih dahulu untuk memastikan daya tumbuh.', 
 1, '/uploads/1732603274865.jpg'),
('Optimalisasi Lahan Sempit untuk Pertanian', 
 'Dengan teknik vertikultur, lahan sempit dapat dimanfaatkan untuk menanam sayuran atau buah. Sistem ini cocok untuk lingkungan perkotaan.', 
 3, '/uploads/1732603286947.jpg'),
('Keunggulan Penggunaan Traktor Mini', 
 'Traktor mini adalah solusi untuk petani dengan lahan terbatas. Alat ini mempermudah pengolahan tanah dan hemat energi.', 
 3, '/uploads/1732603298675.jpg'),
('Pentingnya Diversifikasi Tanaman', 
 'Diversifikasi tanaman membantu mengurangi risiko gagal panen. Teknik ini juga meningkatkan pendapatan petani dengan hasil panen yang beragam.', 
 1, '/uploads/1732603309534.jpg'),
('Tips Mengurangi Erosi Tanah di Lahan Terbuka', 
 'Erosi tanah dapat dikurangi dengan menanam tanaman penutup tanah atau menggunakan sistem terasering. Langkah ini penting untuk menjaga kesuburan tanah.', 
 2, '/uploads/1732603318147.jpg'),
('Teknologi Penyimpanan Hasil Panen Modern', 
 'Teknologi penyimpanan seperti silo dan cold storage membantu menjaga kualitas hasil panen lebih lama. Petani dapat menjual produk dengan harga lebih tinggi.', 
 3, '/uploads/1732603332450.jpg'),
('Mengenal Teknik Agroforestri', 
 'Agroforestri adalah kombinasi antara tanaman pertanian dan pohon dalam satu lahan. Teknik ini memberikan manfaat ekologis sekaligus ekonomis.', 
 2, '/uploads/1732603347598.jpg'),
('Keunggulan Budidaya Tanaman Berbasis IoT', 
 'IoT memungkinkan kontrol otomatis terhadap irigasi dan pemupukan. Teknologi ini menghemat waktu dan meningkatkan hasil panen secara signifikan.', 
 3, '/uploads/1732603358970.jpg'),
 ('Cara Menanam Kopi Arabika', 
 'Pelajari cara menanam kopi arabika yang tepat, dari pemilihan bibit hingga perawatan tanaman. Kopi arabika memiliki cita rasa yang lebih halus dan banyak diminati di pasar internasional.', 
 4, '/assets/kopi-arabika.jpg'),
('Pengolahan Kopi Pasca Panen', 
 'Proses pengolahan biji kopi setelah dipanen sangat penting untuk menghasilkan kopi berkualitas tinggi. Pelajari tahapan-tahapan mulai dari pengeringan hingga pemanggangan biji kopi.', 
 4, '/assets/pengelolaan-kopi.jpg'),
('Keuntungan Menanam Kopi Robusta', 
 'Kopi robusta dikenal dengan rasa yang lebih kuat dan kandungan kafein yang lebih tinggi. Menanam kopi robusta bisa menjadi pilihan yang menguntungkan untuk daerah dataran rendah.', 
 4, '/assets/kopi-robusta.jpg'),
('Sejarah Kopi di Indonesia', 
 'Kopi adalah salah satu komoditas utama Indonesia. Pelajari sejarah panjang kopi di Indonesia, yang telah menjadi bagian dari budaya dan perekonomian negara.', 
 4, '/assets/sejarah-kopi.jpg'),
('Manfaat Kopi bagi Kesehatan', 
 'Kopi tidak hanya enak, tetapi juga memiliki banyak manfaat kesehatan. Konsumsi kopi secara moderat dapat meningkatkan kewaspadaan, mengurangi risiko beberapa penyakit, dan meningkatkan mood.', 
 4, '/assets/manfaat-kopi.jpg'),

('Cara Menanam Teh', 
 'Teh adalah tanaman perkebunan yang tumbuh subur di dataran tinggi. Pelajari cara menanam teh dengan memilih bibit yang tepat dan teknik perawatan tanaman yang efisien.', 
 5, '/assets/menanam-teh.jpg'),
('Proses Pengolahan Teh', 
 'Setelah dipetik, daun teh melalui beberapa tahap pengolahan untuk menghasilkan teh dengan rasa yang khas. Pelajari berbagai metode pengolahan teh seperti fermentasi dan pengeringan.', 
 5, '/assets/pengolahan-teh.jpg'),
('Teh Hijau vs Teh Hitam', 
 'Teh hijau dan teh hitam berasal dari tanaman teh yang sama, namun diproses dengan cara berbeda. Pelajari perbedaan antara keduanya dan manfaat kesehatan yang ditawarkan.', 
 5, '/assets/teh-hijau.jpg'),
('Menanam Teh di Indonesia', 
 'Indonesia memiliki banyak daerah yang cocok untuk budidaya teh. Pelajari daerah-daerah penghasil teh terbaik di Indonesia dan teknik menanam teh yang berhasil di iklim tropis.', 
 5, '/assets/menanam-teh-indonesia.jpg'),
('Manfaat Teh untuk Kesehatan', 
 'Teh tidak hanya menyegarkan, tetapi juga mengandung antioksidan dan memiliki manfaat kesehatan yang banyak, seperti mengurangi stres dan meningkatkan pencernaan.', 
 5, '/assets/manfaat-teh.jpg'),

('Cara Menanam Kakao', 
 'Kakao adalah tanaman perkebunan yang tumbuh di daerah tropis. Pelajari cara menanam kakao, dari memilih bibit unggul hingga perawatan tanaman yang dapat meningkatkan hasil panen.', 
 6, '/assets/menanam-kakao.jpg'),
('Pemangkasan Tanaman Kakao', 
 'Pemangkasan yang tepat dapat meningkatkan hasil panen kakao. Pelajari teknik pemangkasan yang efisien dan aman untuk tanaman kakao.', 
 6, '/assets/pemangkasan-kakao.jpg'),
('Pemanenan Kakao yang Tepat', 
 'Pemanenan yang tepat sangat penting untuk menghasilkan biji kakao berkualitas. Pelajari cara memetik buah kakao yang sudah matang dan proses fermentasi biji kakao.', 
 6, '/assets/pemanenan-kakao.jpg'),
('Pengolahan Kakao Pasca Panen', 
 'Pengolahan biji kakao setelah dipanen akan mempengaruhi kualitas cokelat yang dihasilkan. Pelajari cara fermentasi dan pengeringan biji kakao yang benar.', 
 6, '/assets/pengelolaan-kakao.jpg'),
('Manfaat Kakao bagi Kesehatan', 
 'Kakao kaya akan antioksidan dan memiliki banyak manfaat bagi kesehatan. Pelajari bagaimana konsumsi kakao dapat membantu meningkatkan kesehatan jantung dan mood.', 
 6, '/assets/manfaat-kakao.jpg'),

('Menanam Kelapa Sawit dengan Teknologi Tepat Guna', 
 'Kelapa sawit merupakan salah satu tanaman perkebunan yang menguntungkan. Pelajari cara menanam kelapa sawit dengan teknologi tepat guna untuk meningkatkan hasil panen.', 
 7, '/assets/menanam-kelapa-sawit.jpg'),
('Teknik Perawatan Kelapa Sawit', 
 'Perawatan kelapa sawit meliputi pemupukan, penyiraman, dan pengendalian hama. Pelajari cara perawatan kelapa sawit yang dapat meningkatkan produktivitas tanaman.', 
 7, '/assets/perawatan-kelapa-sawit.jpg'),
('Pemanenan Kelapa Sawit yang Efisien', 
 'Pemanenan kelapa sawit memerlukan teknik yang efisien agar hasilnya optimal. Pelajari cara memanen kelapa sawit dengan baik dan menghindari kerusakan buah.', 
 7, '/assets/pemanenan-kelapa-sawit.jpg'),
('Pengolahan CPO (Crude Palm Oil)', 
 'Setelah dipanen, kelapa sawit akan diproses menjadi CPO (Crude Palm Oil). Pelajari proses pengolahan kelapa sawit menjadi CPO dan produk turunannya.', 
 7, '/assets/pengolahan-cpo.jpg'),
('Dampak Lingkungan dari Perkebunan Kelapa Sawit', 
 'Perkebunan kelapa sawit dapat memberikan dampak lingkungan yang signifikan. Pelajari cara-cara untuk mengelola perkebunan kelapa sawit dengan ramah lingkungan.', 
 7, '/assets/dampak-lingkungan-kelapa-sawit.jpg'),

('Kelapa Sawit dan Ekonomi Indonesia', 
 'Kelapa sawit merupakan komoditas ekspor utama Indonesia. Pelajari bagaimana industri kelapa sawit berkontribusi terhadap perekonomian negara dan lapangan kerja di Indonesia.', 
 7, '/assets/ekonomi-kelapa-sawit.jpg'),
('Manfaat Minyak Kelapa Sawit untuk Industri', 
 'Minyak kelapa sawit memiliki banyak manfaat untuk berbagai industri, mulai dari makanan hingga kosmetik. Pelajari bagaimana minyak kelapa sawit digunakan dalam berbagai produk.', 
 7, '/assets/manfaat-minyak-kelapa-sawit.jpg'),
('Kelapa Sawit dalam Industri Energi', 
 'Kelapa sawit juga digunakan sebagai bahan baku biodiesel yang ramah lingkungan. Pelajari bagaimana kelapa sawit dapat mendukung industri energi terbarukan.', 
 7, '/assets/kelapa-sawit-energi.jpg'),
('Isu Sosial dalam Perkebunan Kelapa Sawit', 
 'Industri kelapa sawit sering kali menjadi topik kontroversial terkait isu sosial dan lingkungan. Pelajari bagaimana industri ini dapat lebih berkelanjutan dan mengurangi dampak negatifnya.', 
 7, '/assets/isu-sosial-kelapa-sawit.jpg');


/* Data Dummy Aktivitas */
INSERT INTO Aktivitas (jenis_aktivitas, deskripsi)
VALUES 
('Edukasi terbaru', 'Edukasi dengan judul "Teknik Pengendalian Hama Ramah Lingkungan" telah dipublikasikan.'),
('Edukasi terbaru', 'Edukasi dengan judul "Keuntungan Bertani Hidroponik" telah dipublikasikan.'),
('Edukasi terbaru', 'Edukasi dengan judul "Inovasi Pertanian dengan IoT" telah dipublikasikan.');
