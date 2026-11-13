export type PageId =
  | "dashboard"
  | "exploration"
  | "panji"
  | "materi"
  | "booking"
  | "progres"
  | "ticketing"
  | "payment"
  | "refund"
  | "notification"
  | "faq"
  | "users"
  | "profile";

export type MenuItem = {
  id: PageId;
  label: string; // teks di sidebar & breadcrumb
  title: string; // judul besar di halaman
  href: string; // URL halaman
  description: string; // subjudul halaman + bahan pencarian
};

export type MenuGroup = { heading: string; items: MenuItem[] };

export const MENU_GROUPS: MenuGroup[] = [
  {
    heading: "Navigasi Utama",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        title: "Dashboard",
        href: "/dashboard",
        description: "Pantau aktivitas Jelajah Topeng dalam satu dashboard.",
      },
      {
        id: "exploration",
        label: "Eksplorasi Kampung",
        title: "Eksplorasi Kampung",
        href: "/eksplorasi-kampung",
        description:
          "Jelajahi peta interaktif, detail titik lokasi, sejarah kampung, tokoh, tradisi, dan dokumentasi budaya.",
      },
      {
        id: "panji",
        label: "Jejak Sang Panji",
        title: "Jejak Sang Panji",
        href: "/jejak-sang-panji",
        description:
          "Ikuti pemberhentian cerita Panji, kumpulkan clue, buka galeri budaya, lalu raih reward.",
      },
      {
        id: "materi",
        label: "Belajar dengan Maestro",
        title: "Belajar dengan Maestro",
        href: "/belajar-dengan-maestro",
        description:
          "Temukan profil maestro, materi bertahap, detail video/artikel/PDF, progres modul, dan jadwal sesi.",
      },
      {
        id: "booking",
        label: "Jadwal & Booking",
        title: "Kalender Jadwal & Booking",
        href: "/jadwal-booking",
        description:
          "Pilih sesi maestro di kalender, kirim formulir konfirmasi, dan lihat riwayat booking.",
      },
      {
        id: "progres",
        label: "Progres Budaya",
        title: "Progres Budaya",
        href: "/progres-budaya",
        description:
          "Pantau misi dan modul yang selesai, koleksi lencana, sertifikat, serta riwayat aktivitas.",
      },
    ],
  },
  {
    heading: "Komersial & Operasional",
    items: [
      {
        id: "ticketing",
        label: "Ticketing Online",
        title: "Ticketing Online",
        href: "/ticketing-online",
        description:
          "Pilih paket kunjungan, jumlah peserta, tanggal, isi data pemesan, lalu lanjut checkout.",
      },
      {
        id: "payment",
        label: "Pembayaran & Transaksi",
        title: "Checkout & Pembayaran",
        href: "/pembayaran",
        description:
          "Tinjau ringkasan checkout, status pembayaran, e-ticket/QR code, dan riwayat pembelian.",
      },
      {
        id: "refund",
        label: "Manajemen Refund",
        title: "Manajemen Refund",
        href: "/manajemen-refund",
        description:
          "Pantau pengajuan refund, verifikasi bukti, dan catat status penyelesaian refund tiket budaya.",
      },
      {
        id: "notification",
        label: "Kelola Notifikasi",
        title: "Notifikasi",
        href: "/kelola-notifikasi",
        description:
          "Lihat pengingat jadwal, status booking, pembaruan misi, dan informasi perjalanan budaya.",
      },
      {
        id: "faq",
        label: "FAQ & Pusat Bantuan",
        title: "Bantuan / FAQ",
        href: "/faq",
        description:
          "Temukan panduan akun, eksplorasi, booking maestro, tiket, checkout, dan pembayaran.",
      },
    ],
  },
  {
    heading: "Administrasi Sistem",
    items: [
      {
        id: "users",
        label: "Profil Pengguna",
        title: "Profil Pengguna",
        href: "/profil-pengguna",
        description:
          "Kelola informasi profil pengguna yang dipakai untuk konfirmasi booking dan pembelian tiket.",
      },
      {
        id: "profile",
        label: "Profil Admin",
        title: "Profil Admin & Pengaturan Akun",
        href: "/profil-admin",
        description:
          "Profil admin dan pengaturan akun: identitas, jabatan, dan keamanan.",
      },
    ],
  },
];

export const MENU_ITEMS: MenuItem[] = MENU_GROUPS.flatMap((group) => group.items);

export const MENU_BY_ID = Object.fromEntries(
  MENU_ITEMS.map((item) => [item.id, item]),
) as Record<PageId, MenuItem>;

export const ADMIN_PATHS = MENU_ITEMS.map((item) => item.href);

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
