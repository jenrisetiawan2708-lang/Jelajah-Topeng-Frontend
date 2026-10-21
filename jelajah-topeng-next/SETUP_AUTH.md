# Menyiapkan autentikasi PBL

Proyek ini memakai Auth.js v5 beta, sesi JWT dalam cookie HttpOnly, provider email/kata sandi untuk akun admin yang dikonfigurasi, dan OAuth Google.

## 1. Buat rahasia aplikasi dan hash kata sandi admin

Di terminal proyek, buat file lokal `.env.local` dari `.env.example`, lalu buat secret:

```bash
cp .env.example .env.local
openssl rand -base64 32
```

Salin hasil `openssl` ke `AUTH_SECRET` di `.env.local`. Buat hash kata sandi tanpa menaruh kata sandi di riwayat terminal:

```bash
npm run auth:hash-password
```

Ketik kata sandi saat diminta. Simpan hasil hash ke `ADMIN_PASSWORD_HASH`. Isi `ADMIN_EMAIL` dengan email login admin dan masukkan email yang sama ke `ADMIN_EMAILS`.

## 2. Konfigurasi Google OAuth

Buat OAuth Client ID tipe Web di Google Cloud Console. Tambahkan URL callback berikut ke **Authorized redirect URIs**:

```text
http://localhost:3000/api/auth/callback/google
```

Isi `AUTH_GOOGLE_ID` dan `AUTH_GOOGLE_SECRET` di `.env.local`. Tambahkan hanya email yang boleh menjadi admin ke `ADMIN_EMAILS`. Akun Google lain dapat terautentikasi, tetapi tidak menerima peran admin.

## 3. Jalankan

```bash
npm run dev
```

Buka `http://localhost:3000/login`. Route `/dashboard` dialihkan ke login bila belum ada sesi. Pengguna Google non-admin hanya melihat halaman akses terbatas; aksi admin mengembalikan error `FORBIDDEN`.

## Bagian tugas PBL

- `auth.ts` dan `src/app/api/auth/[...nextauth]/route.ts`: email/password dan OAuth Google dengan Auth.js.
- `proxy.ts`: pemeriksaan awal dan pengalihan `/dashboard`.
- `src/app/dashboard/layout.tsx` dan `src/lib/dal.ts`: pemeriksaan sesi server dan DTO ringkasan terbatas.
- `src/app/actions/admin.ts`: Server Action memeriksa peran admin dan menghasilkan `FORBIDDEN` untuk peran lain.
- `src/components/AdminActionButton.tsx`: demo tombol untuk mencoba Server Action.

Angka dashboard saat ini adalah data contoh statis karena proyek ZIP belum menyertakan database. Ganti sumber contoh di DAL dengan query database saat backend data sudah tersedia. Data transaksi contoh hanya dikirim saat role sesi adalah admin.
