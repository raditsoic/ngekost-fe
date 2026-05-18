## DOKUMEN

## SPESIFIKASI KEBUTUHAN PERANGKAT LUNAK

# NGEKOST

## Untuk:

## Dokumentasi Internal Proyek Capstone Ngekost

## Oleh:

## Tim Capstone Ngekost

## Awang Fraditya - 5027221055

## Subkhan Mas Udi - 5027221044

## Salomo - 5027221063

## Daffa Rajendra Priyatama - 5027231009

## Jurusan Teknologi Informasi

## Institut Teknologi Sepuluh Nopember

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 1 dari 19
```

# DAFTAR PERUBAHAN

## Revisi Deskripsi

## 0 Dokumen awal

## INDEX TGL - A B C D E F G

## Ditulis oleh

## Diperiksa oleh

## Disetujui oleh

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 2 dari 19
```

# DAFTAR HALAMAN PERUBAHAN

## Halaman Revisi Halaman Revisi

## Semua 0 - -

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 3 dari 19
```

## DAFTAR ISI

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
- 1 Pendahuluan
   - 1.1 Tujuan Penulisan Dokumen
   - 1.2 Lingkup Masalah
   - 1.3 Definisi dan Istilah
   - 1.4 Aturan Penamaan dan Penulisan
   - 1.5 Referensi
   - 1.6 Deskripsi Umum Dokumen
- 2 Deskripsi Umum Perangkat Lunak
   - 2.1 Deskripsi Umum Sistem
   - 2.2 Fitur Utama
      - 2.2.1 Kebutuhan Fungsional
      - 2.2.2 Kebutuhan Non Fungsional
   - 2.3 Karakteristik Pengguna
   - 2.4 Batasan Sistem
   - 2.5 Asumsi dan Ketergantungan
- 3 Deskripsi Umum Kebutuhan
   - 3.1 Kebutuhan Antarmuka Eksternal
      - 3.1.1 Antarmuka Pengguna
      - 3.1.2 Antarmuka Perangkat Keras
      - 3.1.3 Antarmuka Perangkat Lunak
      - 3.1.4 Antarmuka Komunikasi
   - 3.2 Kebutuhan Fungsional
   - 3.3 Model Use Case
      - 3.3.1 Deskripsi Data
      - 3.3.2 Kebutuhan Non-Fungsional
         - DTI-ITS-SKPL-NGST-0001 i dari Nomer Dokumen Halaman


# DAFTAR GAMBAR

## 3.1 Diagram Use Case................................ 9

## 3.2 Entity Relationship Diagram........................... 16

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 ii dari 19
```

# DAFTAR TABEL

## 1.1 Aturan Penamaan dan Penomoran........................ 2

## 2.1 Kebutuhan Fungsional.............................. 4

## 2.2 Kebutuhan Non-Fungsional............................ 5

## 2.3 Karakteristik Pengguna.............................. 5

## 3.1 Komponen Perangkat Lunak........................... 8

## 3.2 Definisi Aktor................................... 10

## 3.3 Definisi Use Case................................. 10

## 3.4 Kamus Data Tabel User.............................. 17

## 3.5 Kamus Data Tabel KostProperty......................... 17

## 3.6 Kamus Data Tabel ExpenseTransaction..................... 18

## 3.7 Kamus Data Tabel Chat.............................. 18

## 3.8 Kamus Data Tabel Message............................ 19

## 3.9 Kebutuhan Non-Fungsional............................ 19

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 iii dari 19
```

## 1 Pendahuluan

### 1.1 Tujuan Penulisan Dokumen

Tujuan penulisan dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL) ini adalah se-

bagai dokumentasi kebutuhan sistem yang akan dikembangkan dalam proyek Capstone berupa

sistem Multimodal Agentic AI untuk pencarian properti kos dan perencanaan biaya hidup maha-

siswa. Dokumen ini menjadi acuan dalam proses pengembangan perangkat lunak yang meliputi

tahap analisis kebutuhan pengguna, perancangan sistem, implementasi, hingga proses pengujian

sistem.

Sistem yang dikembangkan bertujuan untuk membantu mahasiswa dalam menemukan in-

formasi properti kos secara lebih terintegrasi, membandingkan fasilitas dan harga secara objek-

tif, serta menghitung estimasi biaya hidup secara personal berdasarkan lokasi tempat tinggal,

transportasi harian, dan pengeluaran rutin pengguna. Selain itu, sistem ini juga menyediakan

fitur pencatatan keuangan otomatis berbasis ekstraksi data dari gambar maupun tautan yang

diberikan oleh pengguna.

### 1.2 Lingkup Masalah

Lingkup permasalahan yang dibahas dalam pengembangan perangkat lunak ini meliputi:

1. Sistem dikembangkan sebagai platform berbasis Multimodal Agentic AI yang mampu
    menerima input berupa teks, tautan website, maupun gambar (screenshot atau foto).
2. Sistem mampu melakukan ekstraksi informasi properti kos seperti harga, fasilitas, dan
    lokasi dari berbagai sumber.
3. Sistem mampu melakukan analisis lingkungan sekitar properti seperti estimasi biaya
    transportasi menuju lokasi tujuan pengguna.
4. Sistem mampu menghitung estimasi total biaya hidup bulanan berdasarkan data properti,
    transportasi, dan pengeluaran rutin pengguna.
5. Sistem menyediakan fitur pencatatan keuangan otomatis dengan kemampuan ekstraksi
    data dari gambar maupun tautan yang diberikan oleh pengguna.
6. Sistem memberikan rekomendasi batas pengeluaran harian berdasarkan kondisi keuangan
    pengguna.
7. Sistem ditujukan terutama untuk mahasiswa yang sedang mencari tempat tinggal di seki-
    tar lingkungan kampus.

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 1 dari 19
```

### 1.3 Definisi dan Istilah

Berikut adalah daftar definisi dan istilah penting yang digunakan dalam dokumen SKPL

ini:

- Agentic AI Sistem kecerdasan buatan yang mampu merencanakan dan mengeksekusi
    serangkaian tugas secara otonom menggunakan berbagai tools.
- Multimodal LLM Model bahasa besar yang mampu memproses input tidak hanya teks,
    tetapi juga gambar (seperti fitur Vision).
- OCR Optical Character Recognition, teknologi yang digunakan untuk mengenali teks
    dalam gambar.
- POI Point of Interest, lokasi atau tempat yang menjadi fokus dalam pencarian properti
    kos.

### 1.4 Aturan Penamaan dan Penulisan

Penulisan dokumen SKPL ini menggunakan berbagai macam aturan penamaan dan penomoran

yang berbeda-beda untuk beberapa bagian tertentu. Aturan penamaan dan penomoran yang di-

gunakan berdasarkan hal/bagian tersebut adalah seperti yang tercantum pada Tabel 1.1 berikut

ini.

Bagian Aturan Penamaan/Penomoran

Fungsional SKPL-Fxxx

Non Fungsional SKPL-NFxxx

Use Case UC-xxx

Tabel 1.1: Aturan Penamaan dan Penomoran

### 1.5 Referensi

- Dokumentasi API Google Gemini.
- Dokumentasi Google Maps Routes API Places API.
- IEEE Std 830-1993: Recommended Practice for Software Requirements Specifications.

### 1.6 Deskripsi Umum Dokumen

Dokumen Spesifikasi Kebutuhan Perangkat Lunak ini terdiri dari beberapa bagian utama

sebagai berikut:

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 2 dari 19
```

- BAB 1 Pendahuluan: Bagian ini berisi tujuan penulisan dokumen, lingkup masalah,
    definisi dan istilah, aturan penamaan dan penulisan, referensi, serta deskripsi umum doku-
    men.
- BAB 2 Kebutuhan Perangkat Lunak: Bab ini menjelaskan kebutuhan perangkat lu-
    nak yang meliputi kebutuhan fungsional dan kebutuhan non-fungsional sistem yang akan
    dikembangkan.
- BAB 3 Model Analisis Sistem: Bab ini menjelaskan model analisis sistem yang digu-
    nakan dalam pengembangan perangkat lunak, termasuk use case diagram, activity dia-
    gram, sequence diagram, class diagram, serta rancangan arsitektur sistem.

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 3 dari 19
```

## 2 Deskripsi Umum Perangkat Lunak

### 2.1 Deskripsi Umum Sistem

### 2.2 Fitur Utama

Fungsi utama perangkat lunak ini adalah aplikasi penasihat finansial dan properti yang

memisahkan komponen antarmuka dari komponen layanan AI dan agregasi data yang memu-

ngkinkan pengguna untuk mencari dan membandingkan properti (kost) yang tersedia dengan

bantuan LLM. Pengguna dapat mencari kost berdasarkan berbagai kriteria seperti lokasi, harga,

fasilitas, dan jenis kost. Selain itu, pengguna juga dapat melihat detail informasi tentang kost

yang diminati, termasuk deskripsi, dan ulasan dari pengguna lain. Berikut rincian fitur utama

yang disediakan oleh perangkat lunak ini:

#### 2.2.1 Kebutuhan Fungsional

```
ID Deskripsi
SKPL-F001 Memproses input multimodal (URL listing atau gambar brosur kos) untuk
mengekstrak informasi fasilitas dan membandingkan harga.
SKPL-F002 Mengkalkulasi estimasi biaya transportasi harian menggunakan API rute
geospasial berdasarkan profil spesifikasi kendaraan pengguna.
SKPL-F003 Mendeteksi kepadatan tempat makan murah (POI) di sekitar lokasi kos untuk
mengestimasi biaya konsumsi bulanan.
SKPL-F004 Mengekstrak data pengeluaran secara otomatis dari unggahan foto nota/struk
belanja menggunakan Vision LLM (OCR).
SKPL-F005 Menghasilkan laporan proyeksi budgeting harian dan prediksi finansial
berdasarkan sisa saldo bulanan pengguna.
SKPL-F006 Menyediakan antarmuka bagi Admin untuk menambah, mengubah, mengha-
pus (CRUD), dan memvalidasi data listing kos secara manual ke dalam basis
data.
```
Tabel 2.1: Kebutuhan Fungsional

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 4 dari 19
```

#### 2.2.2 Kebutuhan Non Fungsional

```
ID Kriteria Deskripsi (Tuntutan)
SKPL-
NF
```
```
Portabilitas Perangkat lunak harus dapat diakses secara optimal melalui
web browser modern dengan pendekatan antarmuka desktop
(PC-first).
```
```
SKPL-
NF
```
```
Kinerja
(Latensi)
```
```
Perangkat lunak harus memiliki waktu respons pemrosesan
bahasa natural (teks) di bawah 2 detik, dan pemrosesan ek-
straksi gambar (OCR) maksimal 5 detik.
SKPL-
NF
```
```
Usability Perangkat lunak harus menyajikan panel percakapan (chat),
visualisasi peta (geospatial), dan grafik budgeting secara
bersamaan dalam satu dasbor terpusat.
SKPL-
NF
```
```
Keamanan Data Sistem harus mengamankan data pengguna dengan menyim-
pan kredensial akses dan riwayat budgeting menggunakan sis-
tem basis data relasional (PostgreSQL) yang dikonfigurasi
dengan standar keamanan backend.
```
Tabel 2.2: Kebutuhan Non-Fungsional

### 2.3 Karakteristik Pengguna

Karakteristik pengguna dijabarkan dalam Tabel 2.3 berikut ini:

```
Kategori
Pengguna
```
```
Tugas Hak Akses ke Ap-
likasi
```
```
Kemampuan yang
harus dimiliki
```
```
Mahasiswa Mencari dan memband-
ingkan kos, mengunggah
tangkapan layar brosur/nota
pengeluaran, berinteraksi
dengan agen AI, dan meman-
tau sisa budget bulanan.
```
```
Akses penuh ke dash-
board personal (fitur
percakapan AI, pen-
carian properti, dan vi-
sualisasi budgeting).
```
```
KMampu menggunakan
web browser, bernavigasi
pada peta interaktif, dan
berinteraksi melalui chat
dengan bahasa sehari-
hari.
```
```
Admin Mengelola dan memvalidasi
database properti simulasi,
mengonfigurasi limit API ek-
sternal (LLM/Google Maps),
dan memantau log aktivitas
agen AI.
```
```
Akses penuh ke dash-
board operasional
sistem (backend),
manajemen database,
dan konfigurasi envi-
ronment.
```
```
Kecakapan dalam man-
ajemen database re-
lasional, pemahaman
integrasi API, dan ke-
mampuan memantau log
server.
```
Tabel 2.3: Karakteristik Pengguna

### 2.4 Batasan Sistem

- Sistem sangat bergantung pada ketersediaan rate-limit dari API pihak ketiga (Google
    Maps API dan LLM Provider).

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 5 dari 19
```

- Sistem berfokus pada proyeksi finansial; tidak terhubung langsung dengan mutasi reken-
    ing bank pengguna.

### 2.5 Asumsi dan Ketergantungan

- Backend orkestrasi berjalan pada Go, sedangkan agen AI berjalan pada Python 3.12.
- Frontend menggunakan React dengan TypeScript.

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 6 dari 19
```

## 3 Deskripsi Umum Kebutuhan

### 3.1 Kebutuhan Antarmuka Eksternal

#### 3.1.1 Antarmuka Pengguna

Antarmuka pemakai tersedia dalam bentuk aplikasi web tunggal (Single Page Application)

dengan pendekatan perancangan utama untuk layar desktop (PC-first). Antarmuka web harus

menyajikan ruang kerja luas yang dibagi menjadi beberapa panel utama dalam satu dashboard:

- Panel Percakapan Agen: Jendela obrolan interaktif tempat pengguna dapat mengirimkan
    teks, menempelkan tautan (link), atau mengunggah gambar nota/brosur kos.
- Panel Visualisasi Geospasial: Peta interaktif (integrasi Google Maps) yang menampilkan
    titik lokasi properti, rute commute ke kampus, dan sebaran titik POI (warung makan/minimarket).
- Panel Dasbor Finansial: Menampilkan grafik burn-rate bulanan, proyeksi pengeluaran
    harian, dan tabel rincian biaya hidup dari properti yang sedang dievaluasi.
- Sistem harus memberikan umpan balik visual saat agen AI sedang memproses pemang-
    gilan fungsi (Tool Use) agar pengguna mengetahui status pencarian web atau komparasi
    data yang sedang berjalan.

#### 3.1.2 Antarmuka Perangkat Keras

Tidak terdapat perangkat keras khusus yang dibutuhkan oleh pengguna untuk mengakses

sistem ini.

- Di sisi Pengguna: Kebutuhan perangkat keras minimum adalah komputer pribadi (PC)
    atau laptop dengan resolusi layar standar desktop (minimal 1080p direkomendasikan un-
    tuk pengalaman optimal), koneksi internet, serta perangkat input standar seperti keyboard
    dan mouse.
- Di sisi Server: Membutuhkan infrastruktur server (bisa berbasis cloud komoditas) yang
    mampu menjalankan container, environment eksekusi Go, Python, dan Rust, serta mem-
    ori yang memadai untuk operasi basis data relasional dan vektor.

#### 3.1.3 Antarmuka Perangkat Lunak

Sistem ini menggunakan arsitektur microservices. Komponen perangkat lunak yang saling

berinteraksi dijabarkan dalam Tabel 3.1 berikut ini:

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 7 dari 19
```

```
Komponen Teknologi Keterangan
```
```
Frontend Web React + Tailwind CSS Menyediakan dashboard PC-first yang
dinamis dan berinteraksi dengan API
Backend.
```
```
Backend API
Gateway
```
```
Go Menangani routing, autentikasi, mana-
jemen sesi pengguna, dan meneruskan
permintaan ke layanan AI.
```
```
Layanan Agentic AI Python Mengeksekusi logika agen, pemros-
esan Vision LLM (OCR gambar), dan
mengelola alur percakapan.
```
```
Layanan Data
Agregasi
```
```
Python Menjalankan proses scraping atau pe-
narikan data listing properti.
```
```
Penyimpanan Data
Utama
```
```
PostgreSQL Menyimpan profil pengguna, riwayat
budgeting, dan metadata catatan pen-
geluaran.
```
```
Penyimpanan
Pencarian Semantik
```
```
Qdrant Menyimpan embeddings dokumen dan
deskripsi properti untuk fitur pencarian
berbasis makna.
```
```
Layanan Eksternal
(API)
```
```
Google Maps API &
& Web Search API&
& Penyedia LLM
```
```
Menyediakan data rute, POI
geospasial, dan kapabilitas rea-
soning (Vision/Text).
```
Tabel 3.1: Komponen Perangkat Lunak

#### 3.1.4 Antarmuka Komunikasi

Komunikasi data antarkomponen dalam sistem ini diatur dengan standar berikut:

- Client-Server (Frontend ke API Gateway): Menggunakan protokol HTTPS. Request
    JSON dipakai untuk interaksi percakapan teks standar dan pengambilan data budgeting.
    Format request multipart/form-data dipakai saat pengguna mengunggah berkas gambar
    (nota belanja atau brosur properti).
- Real-time Streaming: Menggunakan protokol WebSockets (WSS) atau Server-Sent Events
    (SSE) khusus pada panel percakapan agar respons dari agen AI dapat ditampilkan secara
    streaming kata per kata, memberikan kesan responsif tanpa waktu tunggu HTTP yang
    panjang.
- Server-to-Server (Internal Microservices): Komunikasi internal antara API Gateway
    (Go) dengan layanan AI (Python) dan Agregasi (Python) menggunakan protokol HTTP/REST
    internal, atau gRPC untuk latensi yang lebih rendah.

### 3.2 Kebutuhan Fungsional

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 8 dari 19
```

### 3.3 Model Use Case

### 3.3.0.1 Diagram Use Case

Gambar 3.1: Diagram Use Case

### 3.3.0.2 Definisi Aktor

Tabel ini mendefinisikan siapa saja yang berinteraksi dengan sistem dan batasan hak op-

erasional mereka.

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 9 dari 19
```

```
Aktor Deskripsi Use Case Utama
```
```
Mahasiswa Pengguna akhir yang mengoperasikan sis-
tem melalui antarmuka web desktop untuk
mencari kos, mencatat pengeluaran, dan
memantau budget bulanan.
```
```
UC-001, UC-002,
UC-003, UC-
```
```
Admin Sistem Pengguna yang bertanggung jawab pada
konfigurasi environment, pemantauan
kuota API eksternal (LLM, Google
Maps), dan pengelolaan database refer-
ensi.
```
```
UC-
```
Tabel 3.2: Definisi Aktor

### 3.3.0.3 Definisi Use Case

Berikut adalah definisi use case yang dijabarkan dalam Tabel 3.3 berikut ini:

```
ID Nama Use Case Deskripsi Singkat
```
```
UC-
001
```
```
Evaluasi Properti
Multimodal
```
```
Mahasiswa mengunggah tangkapan layar brosur
atau tautan (link) listing kos. Agen AI mengek-
strak informasi fasilitas, membandingkan harga, dan
memberikan ringkasan kelayakan properti.
```
```
UC-
002
```
```
Kalkulasi Biaya
Hidup Geospasial
```
```
Agen AI menghitung estimasi biaya transportasi
harian (berdasarkan kendaraan mahasiswa) dan bi-
aya makan (berdasarkan titik POI di sekitar kos)
menggunakan API pemetaan.
```
```
UC-
003
```
```
Pencatatan
Pengeluaran Otomatis
(OCR)
```
```
Mahasiswa mengunggah foto nota atau kwitansi.
Agen AI menggunakan Vision LLM untuk mengek-
strak nominal, mengkategorikan transaksi, dan
memotong saldo bulanan secara otomatis.
```
```
UC-
004
```
```
Konsultasi Proyeksi
Finansial
```
```
Mahasiswa berinteraksi melalui chat dengan agen
AI untuk menanyakan sisa budget, meminta saran
pembatasan pengeluaran harian, atau mengevaluasi
kesehatan finansial.
```
```
UC-
005
```
```
Kelola Data Properti
dan Pemantauan &
Data Sistem
```
```
Admin mengelola (Create, Read, Update, Delete)
data listing kos secara manual ke dalam database sis-
tem dan memantau log aktivitas pengguna.
```
Tabel 3.3: Definisi Use Case

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 10 dari 19
```

### 3.3.0.4 Spesifikasi Use Case

UC-001 – Evaluasi Properti Multimodal

```
Komponen Deskripsi
Deskripsi Singkat Mahasiswa mengunggah tangkapan layar brosur atau mem-
berikan tautan (URL) listing kos. Agen AI mengekstrak fasil-
itas, membandingkan harga, dan menyajikan ringkasan prop-
erti.
Aktor Mahasiswa
Pre-Condition Sistem aktif dan kuota Vision LLM serta Web Scraper tersedia.
Post-Condition Informasi detail properti, fasilitas, dan komparasi harga pasar
berhasil diekstrak dan ditampilkan pada dasbor pengguna.
Alur Normal
```
1. Mahasiswa memasukkan tautan listing atau mengung-
    gah gambar brosur properti ke kolom chat.
2. Agen AI memproses gambar menggunakan Vision LLM
    atau melakukan scraping pada tautan yang diberikan.
3. Sistem mengekstrak parameter penting (harga, fasilitas
    kamar, lokasi).
4. Agen AI melakukan pencarian latar belakang untuk
    membandingkan harga dengan properti sejenis di area
    tersebut.
5. Sistem menampilkan ringkasan evaluasi properti secara
    terstruktur di panel dasbor.
Alur Alternatif/
Exception
1. Tautan yang diberikan mati atau dilindungi sistem anti-
bot: Agen AI menginformasikan kegagalan akses dan
meminta mahasiswa memberikan tautan lain atau gam-
bar screenshot.
2. Gambar terlalu buram atau teks tidak terbaca: Sistem
meminta pengguna mengunggah ulang gambar dengan
resolusi lebih tinggi.

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 11 dari 19
```

UC-002 – Kalkulasi Biaya Hidup Geospasial

```
Komponen Deskripsi
Deskripsi Singkat Sistem menghitung estimasi biaya transportasi harian dan
ketersediaan titik makan murah (POI) di sekitar lokasi kos
menggunakan API pemetaan.
Aktor Mahasiswa
Pre-Condition Lokasi koordinat properti sudah diketahui (dari UC-001) dan
profil kendaraan mahasiswa telah diatur.
Post-Condition Estimasi commute cost bulanan dan radius biaya makan dita-
mpilkan.
Alur Normal
```
1. Mahasiswa meminta AI mengkalkulasi biaya hidup un-
    tuk properti tertentu.
2. Sistem memanggil Google Maps API untuk menghitung
    jarak rute dan waktu tempuh dari lokasi kos ke kampus
    ITS.
3. Sistem mengkalkulasi biaya bahan bakar/transportasi
    berdasarkan profil kendaraan mahasiswa.
4. Sistem memanggil Places API untuk memindai titik
    Point of Interest (warung makan, minimarket) di radius
    pejalan kaki.
5. Sistem menggabungkan data menjadi estimasi pengelu-
    aran burn-rate bulanan.
Alur Alternatif/
Exception
1. Lokasi properti tidak dapat dipetakan secara akurat: Sis-
tem meminta mahasiswa untuk memasukkan nama jalan
atau titik terdekat secara manual.
2. Rate limit Google Maps API tercapai: Sistem
menampilkan estimasi kasar berbasis jarak udara garis
lurus dan memberikan notifikasi pembatasan sistem.

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 12 dari 19
```

UC-003 – Pencatatan Pengeluaran Otomatis (OCR)

```
Komponen Deskripsi
Deskripsi Singkat Mahasiswa mengunggah foto nota atau kwitansi belanja. Agen
AI mengekstrak nominal, mengkategorikan transaksi, dan
memotong saldo budget secara otomatis.
Aktor Mahasiswa
Pre-Condition Mahasiswa telah mengatur saldo awal bulan atau batas
anggaran bulanan.
Post-Condition Transaksi baru tercatat di database dan sisa budget bulanan ter-
potong.
Alur Normal
```
1. Mahasiswa memotret dan mengunggah nota/kwitansi
    pengeluaran melalui panel chat.
2. Sistem menggunakan Vision LLM (OCR) untuk
    mengekstrak total nominal dan nama merchant.
3. Agen AI mengklasifikasikan transaksi ke dalam kategori
    budget yang sesuai (misal: “Utilitas”, “Konsumsi”, atau
    “Transportasi”).
4. Sistem menyimpan ExpenseTransaction ke dalam Post-
    greSQL.
5. Sistem memperbarui grafik finansial dan merespons den-
    gan konfirmasi pencatatan.
Alur Alternatif/
Exception
1. Nominal pada nota tulisan tangan tidak dapat dikenali:
AI meminta mahasiswa untuk mengetikkan nominal se-
cara manual.
2. Kategori yang dipilih AI tidak tepat: Mahasiswa mem-
berikan koreksi melalui instruksi teks (misal: “Itu
bukan konsumsi, tapi tugas kuliah”), lalu AI mengoreksi
catatan di database.

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 13 dari 19
```

UC-004 – Konsultasi Proyeksi Finansial

```
Komponen Deskripsi
Deskripsi Singkat Mahasiswa berinteraksi dengan agen AI untuk menanyakan
sisa budget, menganalisis tren pengeluaran, dan meminta
rekomendasi pembatasan harian.
Aktor Mahasiswa
Pre-Condition Terdapat riwayat transaksi pengeluaran (UC-003) atau data
anggaran di dalam sistem.
Post-Condition Mahasiswa menerima laporan proyeksi finansial berbasis teks
atau grafik.
Alur Normal
```
1. Mahasiswa menanyakan status keuangannya (misal:
    “Berapa sisa uangku untuk minggu ini?”).
2. Agen AI melakukan query ke basis data PostgreSQL un-
    tuk mengambil profil budgeting mahasiswa.
3. Sistem mengkalkulasi rata-rata pengeluaran harian dan
    memproyeksikan kapan dana akan habis (runway).
4. Agen AI memformulasikan respons empatik, men-
    yarankan batas pengeluaran harian maksimum yang
    aman, dan menampilkannya di panel percakapan.
Alur Alternatif/
Exception
1. Mahasiswa belum pernah mencatat pengeluaran bulan
ini: Agen AI menginformasikan bahwa data tidak cukup
untuk membuat proyeksi dan mendorong mahasiswa un-
tuk mulai mengunggah nota pengeluaran.

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 14 dari 19
```

UC-005 – Kelola Data Properti dan Pemantauan& Data Sistem

```
Komponen Deskripsi
Deskripsi Singkat Admin bertindak sebagai pengelola data (moderator). Admin
dapat menambahkan, mengubah, atau menghapus listing kos
secara manual ke dalam sistem sebagai basis data untuk Agen
AI, serta memantau aktivitas pengguna.
Aktor Admin Sistem
Pre-Condition Pengguna berhasil masuk (login) melalui kredensial adminis-
trator.
Post-Condition Data kos berhasil diperbarui di dalam database (PostgreSQL
dan Vector DB) dan siap diakses atau direkomendasikan oleh
Agen AI kepada mahasiswa.
Alur Normal
```
1. Admin mengakses menu Manajemen Properti di dasbor.
2. Admin menginputkan data listing kos baru (meliputi
    nama kos, harga sewa, fasilitas, alamat/koordinat peta,
    dan foto).
3. Sistem memvalidasi input, membuat embeddings dari
    deskripsi properti (untuk pencarian semantik AI), dan
    menyimpannya ke dalam database.
4. Admin mengakses menu Pemantauan untuk melihat
    statistik pencarian mahasiswa dan riwayat log Agen AI
    untuk memastikan sistem berjalan aman.
Alur Alternatif/
Exception
1. Terdapat data wajib (seperti harga atau koordinat) yang
kosong atau format foto tidak didukung: Sistem meno-
lak penyimpanan dan menampilkan pesan error validasi
input kepada Admin.
2. Duplikasi data properti: Sistem mendeteksi properti
dengan alamat dan nama yang sama persis sudah ada
di database, lalu memberikan peringatan kepada Admin
untuk memperbarui data lama alih-alih membuat data
baru.

Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.

```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 15 dari 19
```

#### 3.3.1 Deskripsi Data

### 3.3.1.1 Entity Relationship Diagram

Gambar 3.2: Entity Relationship Diagram

### 3.3.1.2 Kamus Data

Berikut adalah definisi atribut, tipe data, dan aturan konstrain untuk masing-masing tabel

pada basis data relasional.

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 16 dari 19
```

### 3.3.1.3 Tabel User

Menyimpan data profil mahasiswa, parameter finansial, dan pengaturan kendaraan yang

akan digunakan sebagai basis perhitungan algoritma geospasial oleh Agen AI.

```
Atribut Representasi Format Range/Contoh Default NULL
user_id String UUID 123e4567-e89b... Auto-generate Tidak
name String Teks Awang Fraditya - Tidak
email String Email awang@student.its.ac.id - Tidak
monthly_budget Integer Rupiah 3000000 0 Tidak
vehicle_type String Enum Honda Brio, Motor Matic, Jalan
Kaki
```
```
Jalan Kaki Tidak
```
```
created_at String ISO-8601 2026-04-01T... Timestamp saat
ini
```
```
Tidak
```
Tabel 3.4: Kamus Data Tabel User

### 3.3.1.4 Tabel KostProperty

Menyimpan data master (katalog) kos yang diinput secara manual oleh Admin atau hasil

dari agregasi otomatis. Entitas ini bertindak sebagai basis referensi utama (ground truth) bagi

Agen AI saat merekomendasikan tempat tinggal.

```
Atribut Representasi Format Range/Contoh Default NULL
property_id String UUID 987f6543-a21b... Auto-generate Tidak
name String Teks Kos Puncak Kertajaya - Tidak
address String Teks Jl. Kertajaya Indah... - Tidak
latitude Float Koordinat -7.282... - Tidak
longitude Float Koordinat 112.795... - Tidak
price_per_month Integer Rupiah 1500000 - Tidak
facilities String Teks JSON ["AC", "WiFi", "K. Mandi
Dalam"]
```
```
[] Tidak
```
```
image_url String URL https://storage/kos.jpg - Ya
created_at String ISO-8601 2026-04-01T... Timestamp saat
ini
```
```
Tidak
```
Tabel 3.5: Kamus Data Tabel KostProperty

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 17 dari 19
```

### 3.3.1.5 Tabel ExpenseTransaction

Menyimpan riwayat transaksi finansial harian pengguna. Nilai nominal dan kategori pada

entitas ini sebagian besar diisi secara otomatis oleh Agen AI melalui ekstraksi Vision OCR dari

gambar nota.

```
Atribut Representasi Format Range/Contoh Default NULL
transaction_id String UUID 555c4321-b45c... Auto-generate Tidak
user_id String UUID 123e4567-e89b... - Tidak
amount Integer Rupiah 45000 - Tidak
category String Enum Konsumsi, Transportasi, Utili-
tas, Sewa, Lainnya
```
```
Lainnya Tidak
```
```
receipt_image_url String URL https://storage/nota.jpg - Ya
transaction_date String ISO-8601 2026-04-01T... Diambil dari
nota
```
```
Tidak
```
```
created_at String ISO-8601 2026-04-01T... Timestamp saat
ini
```
```
Tidak
```
Tabel 3.6: Kamus Data Tabel ExpenseTransaction

### 3.3.1.6 Tabel Chat

Menyimpan metadata pengelompokan sesi percakapan. Tabel ini penting untuk mem-

berikan konteks berkesinambungan (memori jangka panjang) bagi Agen AI.

```
Atribut Representasi Format Range/Contoh Default NULL
chat_id String UUID abcd1234-efgh... Auto-generate Tidak
user_id String UUID 123e4567-e89b... - Tidak
title String Teks Evaluasi Kos Kertajaya Chat Baru Tidak
context_summary String Teks “Mencari kos dengan budget
1.5jt di area ITS...”
```
- Ya

```
created_at String ISO-8601 2026-04-01T... Timestamp saat
ini
```
```
Tidak
```
```
updated_at String ISO-8601 2026-04-01T... Timestamp saat
ini
```
```
Tidak
```
Tabel 3.7: Kamus Data Tabel Chat

### 3.3.1.7 Tabel Message

Menyimpan rincian pertukaran pesan dalam satu sesi Chat. Tabel ini dirancang khusus

untuk mendukung arsitektur Agentic Workflow dengan melacak status pemanggilan fungsi (tool

calls) dan mengelola input multimodal (URL gambar).

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 18 dari 19
```

```
Atribut Representasi Format Range/Contoh Default NULL
message_id String UUID msg-9876-xyz... Auto-generate Tidak
chat_id String UUID abcd1234-efgh... - Tidak
role String Enum user, assistant, system, tool - Tidak
content String Teks “Hitung jarak dari kos ini ke
kampus.”
```
- Ya

```
image_urls String JSON Array ["https://storage/kos_depan.jpg"][] Ya
tool_calls String JSON Array [{"id": "call_abc",
"type": "function",
"function": {"name":
"get_route"}}]
```
- Ya

```
tool_call_id String Teks "call_abc" (Wajib diisi bila
role = tool)
```
- Ya

```
tokens_used Integer Angka 250 0 Ya
created_at String ISO-8601 2026-04-01T... Timestamp saat
ini
```
```
Tidak
```
Tabel 3.8: Kamus Data Tabel Message

#### 3.3.2 Kebutuhan Non-Fungsional

```
ID Kriteria Tuntutan
SKPL-
NF001
```
```
Portabilitas Perangkat lunak harus dapat diakses secara optimal melalui
antarmuka web browser modern, dengan pendekatan peran-
cangan utama untuk layar desktop (PC-first) tanpa memer-
lukan instalasi aplikasi lokal.
SKPL-
NF002
```
```
Kinerja
(Latensi)
```
```
Waktu respons pemrosesan bahasa natural (teks) oleh agen AI
harus berada di bawah 2 detik, sedangkan pemrosesan beban
berat seperti ekstraksi gambar (Vision LLM/OCR) maksimal
diselesaikan dalam 5 detik.
SKPL-
NF003
```
```
Usability
(Kebergunaan)
```
```
Antarmuka pengguna harus menyajikan panel percakapan
obrolan, visualisasi peta geospasial (Google Maps), dan das-
bor metrik finansial secara bersamaan di dalam satu layar ter-
pusat agar pengguna tidak perlu berpindah halaman.
SKPL-
NF004
```
```
Keamanan Data Sistem harus mengamankan privasi data pengguna dengan
menyimpan riwayat pengeluaran dan budgeting pada basis
data relasional (PostgreSQL), serta dilarang keras mengek-
spos API Keys pihak ketiga (Google/LLM) ke sisi frontend
klien.
SKPL-
NF005
```
```
Skalabilitas Arsitektur backend (microservices Go dan Python) harus da-
pat diorkestrasi dan diskalakan untuk menangani lonjakan lalu
lintas kueri pengguna, terutama pada masa puncak pencarian
kos menjelang tahun ajaran baru mahasiswa.
```
Tabel 3.9: Kebutuhan Non-Fungsional

```
Dokumen ini dan informasi yang dimilikinya adalah milik DTI–ITS dan bersifat rahasia. Dilarang me-reproduksi
dokumen ini tanpa diketahui oleh DTI.
```
```
Jurusan
Teknologi Informasi
```
```
Nomer Dokumen Halaman
DTI-ITS-SKPL-NGST-0001 19 dari 19
```

