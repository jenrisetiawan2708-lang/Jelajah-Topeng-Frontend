"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error";
type Toast = {
  id: number;
  type: ToastType;
  message: string;
  leaving: boolean;
};

const SHOW_MS = 2500; // lama toast tampil
const EXIT_MS = 350; // lama animasi keluar

const ToastContext = createContext<
  ((type: ToastType, message: string) => void) | null
>(null);

export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return {
    success: (message: string) => notify("success", message),
    error: (message: string) => notify("error", message),
  };
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();

    setToasts((current) => [...current, { id, type, message, leaving: false }]);

    // 1) setelah SHOW_MS, mulai animasi keluar
    setTimeout(() => {
      setToasts((current) =>
        current.map((toast) =>
          toast.id === id ? { ...toast, leaving: true } : toast,
        ),
      );
    }, SHOW_MS);

    // 2) setelah animasi keluar selesai, hapus dari daftar
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, SHOW_MS + EXIT_MS);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}

      <style>{`
        @keyframes toast-in {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes toast-out {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(120%); opacity: 0; }
        }
        .toast-in  { animation: toast-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .toast-out { animation: toast-out ${EXIT_MS}ms ease-in forwards; }
        @media (prefers-reduced-motion: reduce) {
          .toast-in, .toast-out { animation-duration: 0.01ms; }
        }
      `}</style>

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
              toast.leaving ? "toast-out" : "toast-in"
            } ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}