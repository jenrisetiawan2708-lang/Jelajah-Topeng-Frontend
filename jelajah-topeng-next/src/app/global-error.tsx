"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "#f7f8fb",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#b91c1c", letterSpacing: 1 }}>
            500
          </p>
          <h1 style={{ fontSize: 28, margin: "8px 0" }}>Terjadi kesalahan</h1>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>
            Maaf, ada masalah di server. Coba muat ulang halaman.
          </p>
          {error.digest ? (
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
              Kode: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: "#047857",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}