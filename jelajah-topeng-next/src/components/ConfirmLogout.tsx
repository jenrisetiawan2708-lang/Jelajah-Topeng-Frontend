"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { signOutAction } from "@/app/actions/auth";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? "Keluar..." : "Ya, Logout"}
    </button>
  );
}

export default function ConfirmLogout({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children ?? "Logout"}
      </button>

      {open &&
        // Portal ke body: sidebar punya transform, yang bisa merusak posisi "fixed".
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="logout-title" className="text-lg font-bold text-slate-900">
                Keluar dari akun?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Apakah Anda yakin ingin logout dari panel admin?
              </p>
              <form action={signOutAction} className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <ConfirmButton />
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}