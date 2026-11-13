export { auth as proxy } from "./auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/eksplorasi-kampung/:path*",
    "/jejak-sang-panji/:path*",
    "/belajar-dengan-maestro/:path*",
    "/jadwal-booking/:path*",
    "/progres-budaya/:path*",
    "/ticketing-online/:path*",
    "/pembayaran/:path*",
    "/manajemen-refund/:path*",
    "/kelola-notifikasi/:path*",
    "/faq/:path*",
    "/profil-pengguna/:path*",
    "/profil-admin/:path*",
    "/login",
  ],
};
