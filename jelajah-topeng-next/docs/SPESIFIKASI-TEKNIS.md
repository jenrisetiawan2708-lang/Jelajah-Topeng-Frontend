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
- Rute admin dilindungi `src/proxy.ts` yang memakai callback `authorized` di `auth.ts`: belum login → redirect ke `/login`; sudah login dan membuka `/login` → dialihkan ke `/dashboard`.
- Setiap halaman/aksi memanggil `verifySession()` / `requireAdmin()` di Data Access Layer (`src/lib/dal.ts`); UI tidak dipercaya.
- Server Action `saveRecord` dan `deleteRecord` memeriksa ulang `user.role === "admin"` (status 403 logis: `FORBIDDEN`).
- Setiap query ke BE membawa `userId` pemilik sesi, dan BE memfilter berdasarkan `userId` tersebut.
- Web menandatangani token JWT HS256 berumur 5 menit untuk tiap panggilan ke BE (`src/lib/api.ts`); BE memverifikasi dengan secret yang sama.

### 3. Ekspektasi Sistem
**a. Target performa tampilan data**
- Rangka halaman tampil langsung (Suspense + skeleton), isi data menyusul.
- Daftar data dipaginasi 3 baris per halaman di klien; pencarian dan pengurutan instan tanpa request ulang.
- Ringkasan dashboard di-cache (`"use cache"`, `cacheLife`: stale 30 detik, revalidate 60 detik, expire 300 detik) dan dibersihkan otomatis lewat `updateTag` saat ada tambah/ubah/hapus data.

**b. Mekanisme validasi input**
- Skema **Zod** yang sama dipakai di klien (React Hook Form) dan server (Server Action). Server tetap memvalidasi ulang.
- Validasi login: `src/lib/auth-schema.ts`. Validasi data: `src/lib/schemas.ts`. Validasi refund: `src/lib/refund-schema.ts`. Validasi pembayaran: `src/lib/payment-schema.ts`.
- Unggah gambar dibatasi jenis (hanya JPEG, PNG, WebP) dan ukuran (maksimal 4 MB). Dicek cepat di browser (`ImageUploadField.tsx`), lalu diperiksa ulang di Server Action `uploadImage` (`src/app/actions/upload.ts`) sebelum disimpan ke Vercel Blob; berkas tidak valid ditolak.
- Input tanggal pada form dibatasi dari hari ini sampai 7 hari ke depan (zona WIB) lewat `src/lib/date-limits.ts`.

**c. Standar keamanan navigasi dan autentikasi**
- Sesi Auth.js (cookie terenkripsi) dengan login kredensial admin dan Google (daftar email diizinkan).
- Kata sandi disimpan sebagai hash (scrypt, `src/lib/password.ts`), tidak pernah plaintext.
- Secret (JWT, kunci Blob, kredensial DB) hanya di environment variable Vercel, tidak di repo.
- Rute admin diproteksi di tiga lapis: `src/proxy.ts` (callback `authorized`), DAL (`verifySession`), dan pemeriksaan peran di Server Action.

---

## B-1. Pemetaan Rendering: SSR, CSR, RSC (aspek 1)

Definisi yang dipakai:
- **RSC (React Server Component):** komponen tanpa `"use client"`; berjalan di server, tidak mengirim JavaScript ke browser, boleh `await` data.
- **CSR (Client Component):** komponen dengan `"use client"`; interaktif (state, event, hook browser). Tetap dirender awal di server lalu di-hydrate di browser.
- **SSR (dynamic rendering):** halaman admin dirender di server **per request** karena membaca sesi/cookie; bagian lambat dialirkan lewat `Suspense`.

Route group yang dipakai: `(admin)` untuk halaman setelah login, `(auth)` untuk halaman login. Nama group tidak muncul di URL.

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
| `src/app/(auth)/login/page.tsx` | Halaman login (merender `Login`) |
| `src/app/page.tsx` | Rute `/`, mengalihkan ke `/dashboard` |
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
src/app/(auth)/login/page.tsx   (RSC, Parent)
└─ components/Login.tsx         (CSR, Child: form RHF + Zod)
```

### Dashboard
```text
src/app/(admin)/dashboard/page.tsx                (RSC, Parent)
└─ components/dashboard/DashboardView.tsx         (CSR)
   ├─ components/ui/StatCard.tsx                  (CSR, 4 kartu)
   ├─ components/dashboard/TransactionRow.tsx     (CSR)
   ├─ components/dashboard/Masterclass.tsx        (CSR)
   ├─ components/dashboard/FavoriteCard.tsx       (CSR)
   └─ components/AdminActionButton.tsx            (CSR)
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
| Daftar, checkout, sinkron status, hapus pembayaran (`listPayments`, `createCheckout`, `syncPayment`, `deletePayment`) | `src/lib/payments.ts` | Memanggil BE (`apiFetch`), BE yang berhubungan dengan Midtrans |
| Ambil dan putuskan refund (`getRefundsDTO`, `decideRefundRecord`) | `src/lib/refunds.ts` | Memanggil BE (`apiFetch`) |
| Server Action `saveRecord`, `deleteRecord` | `src/app/actions/records.ts` | Mutasi + `await` ke BE |
| Server Action `uploadImage` | `src/app/actions/upload.ts` | Membaca isi berkas + unggah ke Vercel Blob |
| Server Action `decideRefund` | `src/app/actions/refunds.ts` | Mutasi keputusan refund ke BE |
| Server Action `fetchPayments`, `refreshPaymentStatus`, `removePayment` | `src/app/actions/payments.ts` | Panggilan ke BE |
| Server Action `signOutAction` | `src/app/actions/auth.ts` | Menghapus sesi Auth.js |
| Login (`signIn`) | `src/components/Login.tsx` | Request ke Auth.js |
| Verifikasi hash kata sandi (`verifyAdminPassword`, scrypt), dipanggil dari `authorize` di `auth.ts` | `src/lib/password.ts` | Fungsi hash berbasis callback/promise |
| Route Handler cek kesehatan layanan | `src/app/api/health/route.ts` | Handler request/response |
| Server Action `runAdminReport` | `src/app/actions/admin.ts` | `await requireAdmin()` membaca sesi |
| Query MySQL | BE: `src/config/db.ts`, `src/models/*.model.ts` | I/O database |

### Synchronous (komputasi murni, tanpa I/O)
| Kode | Berkas | Kenapa sync |
|---|---|---|
| Validasi Zod `safeParse` | `src/lib/schemas.ts`, `auth-schema.ts`, `refund-schema.ts`, `payment-schema.ts` | Skema tanpa refinement async |
| Mesin aturan `checkRecord`, `validateByLabel`, `isRealDate`, `todayWib` | `src/lib/schemas.ts` | Fungsi murni |
| Cek tanda tangan isi berkas (`matchesSignature`) | `src/app/actions/upload.ts` | Membandingkan byte awal berkas di memori |
| Batas tanggal input (`minDate`, `maxDate`, `dateError`) | `src/lib/date-limits.ts` | Perhitungan tanggal murni |
| Pembuatan indeks pencarian (`buildSearchIndex`) | `src/lib/search.ts` | Transformasi data di memori, hasilnya dikirim ke `Topbar` |
| Filter, sort, slice, reduce pada array | `components/records/RecordPage.tsx` | Operasi array di memori |
| Format tanggal `Intl.DateTimeFormat` | `components/records/RecordPage.tsx` | Utilitas lokal |
| `getRecordLayout`, `emptyRecords`, `toDraft` | `src/lib/record-layout.ts`, `content-config.ts` | Transformasi data |
| `getHealth()` | `src/lib/services/health.service.ts` | Mengembalikan objek status |
| Pembungkus respons `ok()`, `fail()` | `src/lib/http/response.ts` | Membuat objek respons |

Alasan pemisahan: operasi yang menyentuh jaringan, database, cookie, atau file wajib async agar thread
tidak terblokir; validasi dan transformasi data murni dibuat sync karena cepat dan lebih mudah diuji.

---

## B-4. App Router dan Special Files (aspek 3 dan 4)

Seluruh rute memakai direktori `src/app` (App Router, folder-based routing). Satu folder = satu segmen URL.

| Special file | Lokasi | Fungsi |
|---|---|---|
| `layout.tsx` | `src/app/layout.tsx` (root), `src/app/(admin)/layout.tsx` | Kerangka bersama; layout admin memasang `AdminFrame` (sidebar, topbar, breadcrumb) |
| `page.tsx` | `src/app/(admin)/*/page.tsx`, `src/app/(auth)/login/page.tsx` | Halaman untuk tiap rute |
| `loading.tsx` | `src/app/(admin)/loading.tsx` | Tampilan loading otomatis (skeleton) saat halaman admin dimuat |
| `error.tsx` | `src/app/(admin)/error.tsx` | Error boundary untuk halaman admin, ada tombol "Coba lagi" (`reset`) |
| `global-error.tsx` | `src/app/global-error.tsx` | Error boundary terakhir untuk error di root layout; menampilkan kode `digest` |
| `not-found.tsx` | `src/app/not-found.tsx` | Halaman 404 dengan tautan kembali ke dashboard |
| `page.tsx` (root) | `src/app/page.tsx` | Rute `/` langsung `redirect("/dashboard")` |
| `route.ts` | `src/app/api/health/route.ts`, `src/app/api/auth/[...nextauth]/route.ts` | Route Handler (API) |

---

## B-5. Dynamic Routes dan Route Groups (aspek 5)

**Dynamic route:** `src/app/(admin)/<modul>/[id]/page.tsx` untuk 10 jenis data, misalnya `/belajar-dengan-maestro/[id]`.
Catch-all untuk Auth.js: `src/app/api/auth/[...nextauth]/route.ts`.

**Route groups** (nama dalam kurung tidak muncul di URL):
- `(admin)`: semua halaman setelah login (dashboard, 10 modul data, refund, profil admin), berbagi layout `AdminFrame`.
- `(auth)`: halaman `/login` tanpa sidebar/topbar admin.

---

## B-6. State Management dan React Hooks (aspek 6 dan 7)

**State lokal (`useState`)**
- `DashboardView`: periode yang dipilih dan menu periode terbuka/tertutup.
- `PaymentPanel`: daftar transaksi, status loading, id yang sedang diproses, konfirmasi hapus, pesan.
- `ConfirmLogout`: dialog terbuka/tertutup.
- `RecordPage`: pencarian, urutan, halaman, dan modal.

**State global (Context)**
- `ToastProvider` membuat `ToastContext`; seluruh aplikasi memakai notifikasi lewat hook `useToast()`.

**Form state:** React Hook Form (`useForm`) di `RecordForm`, dan `useActionState` untuk hasil Server Action.

| Hook | Dipakai di | Tujuan |
|---|---|---|
| `useState` | `DashboardView`, `PaymentPanel`, `ConfirmLogout`, `ToastProvider`, `RecordPage` | State lokal |
| `useEffect` | `DeleteRecordButton`, `ConfirmLogout`, `DateLimiter`, `PaymentPanel` | Efek samping: toast setelah aksi, pasang/lepas listener tombol Esc, `MutationObserver` untuk batas tanggal, muat data awal |
| `useContext` | `ToastProvider.tsx` (di dalam `useToast`) | Membaca fungsi notifikasi global |
| `useCallback` | `ToastProvider`, `PaymentPanel` | Menjaga fungsi `notify` dan `load` tetap stabil |
| `useRef`, `useId` | `ImageUploadField` | Mereset input file; id label yang unik |
| `useTransition` | `RecordForm` | Mengirim Server Action dari handler RHF dengan status "mengirim" |
| `useActionState` | `RecordForm`, `DeleteRecordButton` | Hasil Server Action (sukses/gagal, pesan, error per field) |
| `useFormStatus` | `ConfirmLogout` | Status tombol saat logout berjalan |
| `useRouter`, `usePathname` | `DashboardView`, `Sidebar`, `Breadcrumb` | Navigasi dan menu aktif |
| **Custom hook** `useToast` | `src/components/ToastProvider.tsx` | Membungkus context menjadi `toast.success()` dan `toast.error()`, melempar error jika dipakai di luar provider |

---

## B-7. Sistem Caching (aspek 8)

Berkas: `src/lib/page-data.ts`, fitur `cacheComponents: true` (Next.js 16).

| Data | Strategi | Durasi |
|---|---|---|
| Ringkasan dashboard (`fetchSummaryCached`) | `"use cache"` + `cacheLife` + `cacheTag("summary-<userId>")` | stale 30 detik, revalidate 60 detik (mirip ISR), expire 300 detik |
| Data daftar CRUD dan refund (`getAllRecords`, `getAllRefunds`) | Tidak di-cache lintas request; hanya `cache()` React agar tidak dipanggil ganda dalam satu render | Selalu segar |
| Panggilan ke BE (`apiFetch`) | `cache: "no-store"` | Tanpa cache |

- `userId` menjadi bagian kunci cache, jadi data antar akun tidak tertukar.
- Sesi dibaca di luar fungsi cache karena cookie tidak boleh dibaca di dalam `"use cache"`.
- **Invalidasi:** Server Action `saveRecord` dan `deleteRecord` memanggil `updateTag("summary-<userId>")` dan `revalidatePath("/", "layout")`, sehingga ringkasan langsung diperbarui setelah tambah/ubah/hapus data.

---

## B-8. Integrasi FE dan BE, Modular Routing, Standarisasi Response (aspek 9, 11, 13)

**Integrasi (aspek 9)**

Alur: Server Component / Server Action → fungsi di `src/lib/*.ts` → `apiFetch` (`src/lib/api.ts`, `fetch` + token JWT HS256 5 menit) → BE Express → database MySQL (TiDB Cloud).

| Domain | Berkas FE | Endpoint BE |
|---|---|---|
| Data CRUD | `src/lib/records.ts` | per jenis data |
| Ringkasan dashboard | `src/lib/page-data.ts` | `GET /api/dashboard` |
| Pembayaran | `src/lib/payments.ts` | `/api/payments`, `/payments/checkout`, `/payments/:orderId/status` |
| Refund | `src/lib/refunds.ts` | `GET /api/refunds`, `PATCH /api/refunds/:id/decision` |

> TODO: tulis ORM/driver yang dipakai BE dan lokasi koneksinya (lihat B-11).

**Modular routing (aspek 11)**
- Route Handler web tipis: `src/app/api/health/route.ts` hanya memanggil `getHealth()` di `src/lib/services/health.service.ts`, lalu membungkus hasilnya dengan `ok()`/`fail()`.
- Logika bisnis web dipisah dari rute: `src/lib/` (data, skema, DAL) dan `src/app/actions/` (Server Action: `records`, `refunds`, `payments`, `upload`, `auth`).

Backend Express dipisah per lapisan dan per modul (auth, dashboard, payment, record, refund):

| Folder BE | Isi |
|---|---|
| `src/routes/` | `index.ts` + `auth`, `dashboard`, `payment`, `record`, `refund` (`*.route.ts`) |
| `src/controllers/` | `*.controller.ts` per modul |
| `src/services/` | `auth.service.ts`, `payment.service.ts` |
| `src/models/` | `*.model.ts` per modul (akses database) |
| `src/validators/` | `*.validator.ts` per modul + `validate.ts` |
| `src/middleware/` | `verifyToken`, `requireJson`, `requestContext`, `responseEnvelope`, `errorHandler` |
| `src/config/`, `src/utils/`, `src/types/` | `db.ts`, `env.ts`; `AppError`, `asyncHandler`; `express.d.ts` |

> TODO: cek isi `routes/index.ts` untuk prefix rute (`/api/...`).

**Standarisasi response (aspek 13)**

`src/lib/http/response.ts` membungkus respons Route Handler:
- Sukses: `{ success: true, data, error: null }` lewat `ok(data, status = 200)`.
- Gagal: `{ success: false, data: null, error: { code, message } }` lewat `fail(code, message, status = 400)`.
- Contoh: `/api/health` mengembalikan `ok(getHealth())`, atau `fail("INTERNAL_ERROR", "...", 500)` jika gagal.
- `apiFetch` membaca isi `data` dari respons BE (`body.data`), dan melempar `ApiError(status, message, fields)` jika respons tidak OK.
- Server Action memakai tipe hasil sendiri: `FormState` (`ok`, `message`, `errors`, `ts`) dan `PaymentResult` (`ok` + `data` atau `error`).

---

## B-9. Middleware / Proxy (aspek 10)

Next.js 16 mengganti nama `middleware.ts` menjadi `proxy.ts`; fungsinya sama. Berkas: `src/proxy.ts`, yang mengekspor `auth` dari `auth.ts` sebagai `proxy`.

- `config.matcher` mencakup `/dashboard`, 10 modul data, `/pembayaran`, `/manajemen-refund`, `/profil-admin`, dan `/login`.
- Logika di callback `authorized` (`auth.ts`):
  - belum login membuka rute terproteksi → dialihkan ke `/login` (`pages.signIn`);
  - sudah login membuka `/login` → dialihkan ke `/dashboard`.
- Pemeriksaan peran admin tetap dilakukan di DAL dan Server Action (lihat B-12).

---

## B-10. Augmentasi Request dan Deklarasi Tipe (aspek 12)

Berkas: `src/types/next-auth.d.ts` memperluas tipe Auth.js:
- `Session.user` ditambah `id: string` dan `role: "admin" | "user"`.
- `User` ditambah `role?: "admin" | "user"`.
- `JWT` ditambah `role?: "admin" | "user"`.

Alur atribut kustom di `auth.ts`:
1. `authorize` (login kredensial) mengembalikan `role: "admin"`; untuk Google, `jwt` callback menentukan peran dari daftar `ADMIN_EMAILS`.
2. Callback `jwt` menyimpan `token.role`.
3. Callback `session` menyalin `token.sub` ke `session.user.id` dan `token.role` ke `session.user.role`.
4. `verifySession()` di `src/lib/dal.ts` mengembalikan `{ id, email, role }` yang dipakai semua halaman dan Server Action. Di `proxy.ts`, sesi tersedia sebagai `req.auth`.

---

## B-11. Konektivitas Database (aspek 15)

> TODO: tulis pool/singleton koneksi dari `src/config/db.ts` di BE (cek isi file dulu). Sisi web tidak mengakses database langsung; sisa Prisma (`src/lib/db.ts`, folder `prisma/`) dihapus setelah dipastikan tidak ada yang meng-import.

---

## B-12. Authentication, Authorization, dan Data Access Layer (aspek 16 dan 17)

**Autentikasi dan peran (aspek 16)**
- Auth.js v5, sesi JWT (`session.strategy: "jwt"`), provider Google dan Credentials.
- Peran: `admin` jika email ada di `ADMIN_EMAILS` / `ADMIN_EMAIL`, selain itu `user`. Hanya `admin` yang boleh melihat dan mengubah data.
- Kata sandi diverifikasi dengan `verifyAdminPassword` (scrypt) di `src/lib/password.ts`. Hash dibuat dengan `npm run auth:hash-password` (`scripts/hash-password.mjs`, kata sandi minimal 12 karakter, format `scrypt$<salt>$<hash>`) dan disimpan di variabel `ADMIN_PASSWORD_HASH`.
- Contoh penolakan peran: Server Action `runAdminReport` (`src/app/actions/admin.ts`) memanggil `requireAdmin()`; bila bukan admin, `AuthorizationError` ditangkap dan hasilnya `{ ok: false, error: "FORBIDDEN" }`. Tombol pemanggilnya: `AdminActionButton`.

**Data Access Layer (aspek 17)**
- `src/lib/dal.ts`: `verifySession()` (redirect ke `/login` jika tidak ada sesi) dan `requireAdmin()` (melempar `AuthorizationError` / `FORBIDDEN` jika bukan admin).
- Fungsi akses data dipisah di `src/lib/records.ts`, `payments.ts`, `refunds.ts`, `page-data.ts`; semuanya menerima `userId` dari sesi dan meneruskannya ke BE lewat token JWT.
- Server Action memeriksa ulang `user.role !== "admin"` sebelum mutasi (`saveRecord`, `deleteRecord`, `decideRefund`, `fetchPayments`, `refreshPaymentStatus`, `removePayment`, `uploadImage`).
- Kepemilikan data: `updateRecord`/`removeRecord` dibatasi `userId`; hasil `false` berarti data tidak ditemukan atau bukan milik akun ini.

> TODO: konfirmasi di BE bagaimana filter `userId`/`role` diterapkan, khususnya untuk daftar transaksi (admin melihat transaksi semua pengunjung).

---

## B-13. Form dan Validasi Skema (aspek 18)

- Form: React Hook Form dengan `zodResolver(recordSchema)`, `mode: "onChange"`, tombol Simpan nonaktif sampai `isValid`.
- Skema yang sama dipakai di server: `recordSchema.safeParse` di `saveRecord`, `refundDecisionSchema` di `decideRefund`.
- Error server dipetakan per field lewat `fieldErrorsFromIssues` dan ditampilkan lewat `setError` di form.
- Mutasi CRUD memakai Server Action: `saveRecord` (tambah dan ubah, lewat `useActionState`), `deleteRecord` (dengan `.bind(null, kind, id)`), `decideRefund`.
- Setelah mutasi: `revalidatePath("/", "layout")` dan `updateTag` agar tampilan dan cache segar tanpa refresh.
- Input tanggal dibatasi hari ini sampai 7 hari ke depan oleh `DateLimiter` (UI) dan `date-limits.ts`.

---

## B-14. File Upload dan Keamanan File (aspek 19 dan 20)

**Upload (aspek 19):** `ImageUploadField` → Server Action `uploadImage` (`src/app/actions/upload.ts`) → Vercel Blob (`put`). URL hasil unggah disimpan di field `imageUrl` pada data Jejak Sang Panji. Nama berkas diacak (`uploads/<userId>/<uuid>.<ext>`). Domain Blob diizinkan di `next.config.ts` (`*.public.blob.vercel-storage.com`) agar bisa ditampilkan dengan `next/image`. Saat data dihapus, berkas lama di Blob dihapus lebih dulu (`removeRecord`).

**Validasi (aspek 20)**

| Lapisan | Pemeriksaan |
|---|---|
| Browser (`ImageUploadField`) | MIME hanya `image/jpeg`, `image/png`, `image/webp`; ukuran maksimal 4 MB; atribut `accept` pada input |
| Server (`uploadImage`) | Wajib login dan admin; file wajib ada; MIME allowlist; ukuran maksimal 4 MB; cek tanda tangan byte awal (JPEG, PNG, WebP) agar isi sesuai format, bukan sekadar label MIME |
| Konfigurasi | `serverActions.bodySizeLimit: "5mb"` |

Berkas tidak valid ditolak dengan pesan error, dan tidak pernah dikirim ke Vercel Blob.

---

## B-15. Error Handling (aspek 21)

**Error terduga (expected)** ditangani sebagai hasil, bukan crash:
- Validasi Zod gagal → `FormState { ok: false, errors }`, ditampilkan per field.
- Respons BE tidak OK → `ApiError(status, message, fields)`, ditangkap di Server Action dan diubah jadi pesan; `decideRefundRecord` memetakan status 404/409 menjadi "tidak ditemukan atau sudah diproses".
- Bukan admin → `FORBIDDEN` (403 logis), data nama sudah ada, data bukan milik akun.
- Upload tidak valid → `{ ok: false, error }`.
- Route Handler: `fail(code, message, status)`, misalnya `/api/health` mengembalikan HTTP 500.
- BE tidak terjangkau di `payments`: pesan "Tidak dapat terhubung ke server".

**Error tak terduga (unexpected)** dilempar ulang dan ditangkap boundary:
- `src/app/(admin)/error.tsx`: halaman admin, ada tombol "Coba lagi" dan "Ke Dashboard".
- `src/app/global-error.tsx`: error di root layout, menampilkan kode `digest`.
- `src/app/not-found.tsx`: rute tidak ada (404).
- Detail error dicatat di log server (`console.error`), tidak ditampilkan ke pengguna.

---

## B-16. Deployment (aspek 22)

Deploy di Vercel. Environment variable produksi hanya diatur di dashboard Vercel, tidak ada di repo.

| Variabel | Fungsi |
|---|---|
| `API_URL` | Alamat BE (default lokal `http://localhost:5050/api`) |
| `JWT_SECRET` | Rahasia penanda token ke BE, sama dengan di BE |
| `AUTH_SECRET` | Rahasia enkripsi sesi Auth.js |
| `ADMIN_EMAIL`, `ADMIN_EMAILS` | Daftar email admin |
| `ADMIN_PASSWORD_HASH` | Hash scrypt kata sandi admin (bukan kata sandi asli) |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Kredensial OAuth Google |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob (nama standar `@vercel/blob`) |

BE memiliki `api/index.js` dan `vercel.json` sebagai titik masuk deploy di Vercel.

**Production build:** `npm run build` (Next.js 16.4.0, Turbopack) lolos: kompilasi, pemeriksaan TypeScript, dan pembuatan 28 halaman berhasil. Ringkasan rute hasil build:
- `ƒ Proxy (Middleware)`: `src/proxy.ts` terdeteksi.
- `◐ Partial Prerender`: halaman admin (dashboard, 10 modul data beserta `[id]`, refund, pembayaran, profil) dirender statis dengan bagian dinamis dialirkan.
- `○ Static`: `/` dan `/login`.
- `ƒ Dynamic`: `/api/auth/[...nextauth]` dan `/api/health`.

> TODO: URL FE yang online dan URL BE yang online.