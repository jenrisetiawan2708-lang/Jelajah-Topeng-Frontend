# Jelajah Topeng, Admin Web — Dokumen Spesifikasi Teknis PBL

Stack: Next.js 16 (App Router, `cacheComponents`), React 19, Auth.js v5, Zod, React Hook Form, Vercel Blob.
Backend bersama (web + mobile): Express + TypeScript + MySQL (TiDB Cloud). Deploy: Vercel.

---

## A. Identitas dan Ruang Lingkup Proyek

### 1. Topik Proyek
**Jelajah Topeng** adalah platform pelestarian budaya Topeng Malangan. Web ini adalah **Admin Panel Kuratorial**
untuk mengelola konten yang dipakai aplikasi mobile (Flutter): lokasi eksplorasi kampung, game Jejak Sang Panji,
materi belajar dengan maestro, jadwal booking, progres budaya, ticketing, pembayaran, refund, notifikasi, FAQ,
dan profil pengguna.

### 2. Batasan Proyek
**a. Batasan hak akses peran**
- Hanya peran **admin** yang boleh masuk dan mengubah data. Akun non-admin ditolak (halaman `AccessDenied`).
- Tidak ada registrasi publik di web; akun admin dikelola lewat konfigurasi server.
- Pengguna aplikasi mobile tidak memakai web ini.

**b. Batasan ruang lingkup fitur**
- Web: CRUD konten (10 jenis data), dashboard ringkasan, manajemen refund, profil admin, unggah gambar.
- Di luar lingkup web: fitur pengguna akhir (kuis, belanja tiket, pembayaran oleh pengguna), push notification, AI. Itu ada di aplikasi mobile/BE.

**c. Aturan otorisasi spesifik**
- Rute admin dilindungi `proxy.ts` (belum login → redirect ke `/login`; sudah login → `/login` dialihkan ke dashboard).
- Setiap halaman/aksi memanggil `verifySession()` / `requireAdmin()` di Data Access Layer (`src/lib/dal.ts`); UI tidak dipercaya.
- Server Action `saveRecord` dan `deleteRecord` memeriksa ulang `user.role === "admin"` (status 403 logis: `FORBIDDEN`).
- Setiap query ke BE membawa `userId` pemilik sesi, dan BE memfilter berdasarkan `userId` tersebut.
- Web menandatangani token JWT HS256 berumur 5 menit untuk tiap panggilan ke BE (`src/lib/api.ts`); BE memverifikasi dengan secret yang sama.

### 3. Ekspektasi Sistem
**a. Target performa tampilan data**
- Rangka halaman tampil langsung (Suspense + skeleton), isi data menyusul.
- Daftar data dipaginasi 3 baris per halaman di klien; pencarian dan pengurutan instan tanpa request ulang.
- Ringkasan dashboard di-cache 60 detik (`"use cache"`, `cacheLife`), dibersihkan otomatis saat ada tambah/ubah/hapus data.

**b. Mekanisme validasi input**
- Skema **Zod** yang sama dipakai di klien (React Hook Form) dan server (Server Action). Server tetap memvalidasi ulang.
- Validasi login: `src/lib/auth-schema.ts`. Validasi data: `src/lib/schemas.ts`. Validasi refund: `src/lib/refund-schema.ts`.
- Unggah gambar dibatasi jenis (MIME) dan ukuran sebelum dikirim ke Vercel Blob; berkas tidak valid ditolak.

**c. Standar keamanan navigasi dan autentikasi**
- Sesi Auth.js (cookie terenkripsi) dengan login kredensial admin dan Google (daftar email diizinkan).
- Kata sandi disimpan sebagai hash (scrypt), tidak pernah plaintext.
- Secret (JWT, kunci Blob, kredensial DB) hanya di environment variable Vercel, tidak di repo.
- Rute admin diproteksi di tiga lapis: `proxy.ts`, DAL (`verifySession`), dan pemeriksaan peran di Server Action.

---

## B-1. Pemetaan Rendering: SSR, CSR, RSC (aspek 1)

Definisi yang dipakai:
- **RSC (React Server Component):** komponen tanpa `"use client"`; berjalan di server, tidak mengirim JavaScript ke browser, boleh `await` data.
- **CSR (Client Component):** komponen dengan `"use client"`; interaktif (state, event, hook browser). Tetap dirender awal di server lalu di-hydrate di browser.
- **SSR (dynamic rendering):** halaman admin dirender di server **per request** karena membaca sesi/cookie; bagian lambat dialirkan lewat `Suspense`.

### RSC — komponen server (tanpa `"use client"`)
| Berkas | Peran |
|---|---|
| `src/app/(admin)/layout.tsx` | Kerangka admin, memasang `AdminFrame` |
| `src/app/(admin)/*/page.tsx` (10 halaman data) | Halaman rute, memanggil `RecordRoute` |
| `src/app/(admin)/dashboard/page.tsx` | Halaman dashboard |
| `src/app/(admin)/manajemen-refund/page.tsx` | Halaman refund |
| `src/app/(admin)/profil-admin/page.tsx` | Halaman profil admin |
| `src/app/(admin)/*/[id]/page.tsx` (10 halaman) | Halaman detail dinamis |
| `src/app/(admin)/loading.tsx` | UI loading |
| `src/app/login/page.tsx` | Halaman login (merender `Login`) |
| `src/app/not-found.tsx` | Halaman 404 |
| `src/components/records/RecordRoute.tsx` | Ambil sesi + data daftar di server |
| `src/components/records/RecordDetailRoute.tsx` | Ambil sesi + satu data di server |
| `src/components/ui/PageSkeleton.tsx` | Skeleton loading |

### CSR — komponen klien (`"use client"`)
| Berkas | Alasan memakai `"use client"` |
|---|---|
| `src/components/Login.tsx` | React Hook Form, `signIn`, state error |
| `src/components/records/RecordPage.tsx` | State pencarian, urutan, halaman, modal |
| `src/components/records/RecordForm.tsx` | React Hook Form, `useActionState`, upload |
| `src/components/records/RecordDetail.tsx` | Tombol aksi (tutup/edit) |
| `src/components/records/DeleteRecordButton.tsx` | Konfirmasi + Server Action hapus |
| `src/components/ui/Modal.tsx` | Dialog interaktif |
| `src/components/ui/StatCard.tsx` | Kartu statistik |
| `src/components/ImageUploadField.tsx` | Pilih file, validasi, unggah |
| `src/components/ToastProvider.tsx` | Context notifikasi (state global) |
| `src/components/ConfirmLogout.tsx` | Dialog konfirmasi keluar |
| `src/components/DateLimiter.tsx` | Interaksi input tanggal |
| `src/components/AdminActionButton.tsx` | Tombol aksi admin |
| `src/components/PaymentPanel.tsx` | Panel pembayaran interaktif |
| `src/components/RefundPage.tsx` | Keputusan refund (form + state) |
| `src/components/dashboard/DashboardView.tsx` | Tampilan dashboard interaktif |
| `src/components/dashboard/FavoriteCard.tsx` | Bagian dashboard |
| `src/components/dashboard/Masterclass.tsx` | Bagian dashboard |
| `src/components/dashboard/TransactionRow.tsx` | Baris transaksi |
| `src/components/layout/AdminFrame.tsx` | State buka/tutup sidebar |
| `src/components/layout/Sidebar.tsx` | Menu aktif (`usePathname`) |
| `src/components/layout/Topbar.tsx` | Pencarian, notifikasi, logout |
| `src/components/layout/Breadcrumb.tsx` | Jejak halaman (`usePathname`) |
| `src/components/layout/AccessDenied.tsx` | Tampilan akses ditolak |
| `src/components/profile/ProfileView.tsx` | Tampilan profil interaktif |
| `src/app/(admin)/error.tsx` | Error boundary (wajib klien) |
| `src/app/global-error.tsx` | Error boundary global (wajib klien) |

### SSR (rendering saat request)
Semua halaman di `src/app/(admin)/` dirender dinamis per request karena membaca sesi di server
(`requireAdmin()`), dan datanya dialirkan lewat `<Suspense fallback={<PageSkeleton />}>`
sehingga rangka tampil duluan (Partial Prerendering, `cacheComponents: true`).

---

## B-2. Hierarki Komponen (aspek 2)

### Halaman daftar data (contoh: `/belajar-dengan-maestro`)
```text
src/app/layout.tsx                              (root, RSC)
└─ src/app/(admin)/layout.tsx                   (RSC)
   └─ components/layout/AdminFrame.tsx          (CSR)
      ├─ components/layout/Sidebar.tsx          (CSR)
      ├─ components/layout/Topbar.tsx           (CSR)
      ├─ components/layout/Breadcrumb.tsx       (CSR)
      └─ src/app/(admin)/belajar-dengan-maestro/page.tsx   (RSC)
         └─ components/records/RecordRoute.tsx              (RSC, Suspense)
            ├─ components/ui/PageSkeleton.tsx               (fallback)
            └─ RecordContent (di RecordRoute.tsx)           (RSC, ambil sesi + data)
               └─ components/records/RecordPage.tsx         (CSR)
                  ├─ components/ui/StatCard.tsx             (CSR, 4 kartu)
                  └─ components/ui/Modal.tsx                (CSR)
                     ├─ components/records/RecordDetail.tsx (CSR)
                     │  └─ components/records/DeleteRecordButton.tsx (CSR)
                     └─ components/records/RecordForm.tsx   (CSR)
                        └─ components/ImageUploadField.tsx  (CSR, khusus Jejak Sang Panji)
```

### Halaman detail dinamis (`/belajar-dengan-maestro/[id]`)
```text
src/app/(admin)/belajar-dengan-maestro/[id]/page.tsx   (RSC, Parent)
└─ components/records/RecordDetailRoute.tsx            (RSC, Suspense)
   └─ DetailContent (di RecordDetailRoute.tsx)         (RSC, ambil sesi + satu data)
```

### Halaman login
```text
src/app/login/page.tsx   (RSC, Parent)
└─ components/Login.tsx  (CSR, Child: form RHF + Zod)
```

### Dashboard
```text
src/app/(admin)/dashboard/page.tsx                (RSC, Parent)
└─ components/dashboard/DashboardView.tsx         (CSR)
   ├─ components/dashboard/FavoriteCard.tsx       (CSR)
   ├─ components/dashboard/Masterclass.tsx        (CSR)
   └─ components/dashboard/TransactionRow.tsx     (CSR)
```

Aturan desain: komponen induk (Parent) berupa RSC mengambil data di server lalu
menurunkannya lewat props ke komponen anak (Child) berupa CSR yang interaktif.
Dengan begitu JavaScript yang dikirim ke browser hanya untuk bagian yang memang interaktif.

---

## B-3. Asynchronous vs Synchronous (aspek 14)

### Asynchronous (I/O, harus `await`)
| Kode | Berkas | Kenapa async |
|---|---|---|
| Panggilan ke BE (`apiFetch`) + penandatanganan JWT (`jose`) | `src/lib/api.ts` | `fetch` jaringan dan `SignJWT` asinkron |
| Verifikasi sesi (`verifySession`, `requireAdmin`) | `src/lib/dal.ts` | Membaca sesi/cookie (`await auth()`) |
| Ambil data (`getSummary`, `getAllRecords`, `getAllRefunds`) | `src/lib/page-data.ts` | Query data lewat BE ke database |
| Ringkasan dashboard ter-cache | `src/lib/page-data.ts` | `"use cache"` pada fungsi async |
| Insert / update / hapus data, cek nama | `src/lib/records.ts` | Query database lewat BE |
| Hapus berkas lama di Vercel Blob | `src/lib/records.ts` | Panggilan API cloud storage |
| Server Action `saveRecord`, `deleteRecord` | `src/app/actions/records.ts` | Mutasi + `await` ke BE |
| Login (`signIn`) | `src/components/Login.tsx` | Request ke Auth.js |
| Verifikasi hash kata sandi (scrypt) | `auth.ts` | Fungsi hash berbasis callback/promise |
| Query MySQL (`pool.query`) | BE: `src/config/db.ts`, modul repository | I/O database |

### Synchronous (komputasi murni, tanpa I/O)
| Kode | Berkas | Kenapa sync |
|---|---|---|
| Validasi Zod `safeParse` | `src/lib/schemas.ts`, `auth-schema.ts`, `refund-schema.ts` | Skema tanpa refinement async |
| Mesin aturan `checkRecord`, `validateByLabel`, `isRealDate`, `todayWib` | `src/lib/schemas.ts` | Fungsi murni |
| Filter, sort, slice, reduce pada array | `components/records/RecordPage.tsx` | Operasi array di memori |
| Format tanggal `Intl.DateTimeFormat` | `components/records/RecordPage.tsx` | Utilitas lokal |
| `getRecordLayout`, `emptyRecords`, `toDraft` | `src/lib/record-layout.ts`, `content-config.ts` | Transformasi data |
| `getHealth()` | `src/lib/services/health.service.ts` | Mengembalikan objek status |
| Pembungkus respons `ok()`, `fail()` | `src/lib/http/response.ts` | Membuat objek respons |

Alasan pemisahan: operasi yang menyentuh jaringan, database, cookie, atau file wajib async agar thread
tidak terblokir; validasi dan transformasi data murni dibuat sync karena cepat dan lebih mudah diuji.