import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f7f8fb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#047857", letterSpacing: 1 }}>
          404
        </p>
        <h1 style={{ fontSize: 28, margin: "8px 0" }}>Halaman tidak ditemukan</h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          Alamat yang kamu buka tidak ada atau sudah dipindahkan.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: 10,
            background: "#047857",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Kembali ke dashboard
        </Link>
      </div>
    </main>
  );
}