"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <>
      <style>{`
        .err-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(160deg, #f8fafc 0%, #eef2f7 100%);
          font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
        }
        .err-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 40px 32px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        }
        .err-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .err-title {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 700;
          color: #111827;
        }
        .err-text {
          margin: 0 0 28px;
          font-size: 14px;
          line-height: 1.6;
          color: #6b7280;
        }
        .err-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .err-btn {
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform 0.1s, background 0.15s;
        }
        .err-btn:hover { transform: translateY(-1px); }
        .err-btn:active { transform: translateY(0); }
        .err-btn-primary { background: #111827; color: #ffffff; }
        .err-btn-primary:hover { background: #1f2937; }
        .err-btn-ghost {
          background: #ffffff;
          color: #374151;
          border-color: #d1d5db;
        }
        .err-btn-ghost:hover { background: #f9fafb; }
        .err-hint {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px dashed #e5e7eb;
          font-size: 12px;
          color: #9ca3af;
        }
      `}</style>

      <div className="err-wrap">
        <div className="err-card" role="alert">
          <div className="err-icon">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 9-9" />
              <path d="M21 12a9 9 0 0 1-9 9" />
              <path d="M8 16l8-8" />
              <circle cx="12" cy="12" r="9" opacity="0.25" />
            </svg>
          </div>

          <h2 className="err-title">Gagal memuat dashboard</h2>
          <p className="err-text">
            Tidak dapat terhubung ke server. Pastikan server berjalan, lalu coba
            lagi.
          </p>

          <div className="err-actions">
            <button className="err-btn err-btn-primary" onClick={retry}>
              Coba lagi
            </button>
            <button
              className="err-btn err-btn-ghost"
              onClick={() => router.push("/")}
            >
              Ke beranda
            </button>
          </div>

          {error.digest && (
            <div className="err-hint">Kode error: {error.digest}</div>
          )}
        </div>
      </div>
    </>
  );
}