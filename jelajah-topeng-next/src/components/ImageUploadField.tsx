"use client";

import { useId, useRef, useState } from "react";
import NextImage from "next/image";
import { uploadImage } from "@/app/actions/upload";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    // Cek cepat di browser (server tetap memeriksa ulang)
    if (!ALLOWED.includes(file.type)) {
      setError("File wajib berupa gambar JPG, PNG, atau WebP");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Ukuran gambar maksimal 4 MB");
      e.target.value = "";
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const result = await uploadImage(fd);
    setUploading(false);

    if (result.ok) {
      onChange(result.url);
    } else {
      setError(result.error);
      e.target.value = "";
    }
  }

  return (
    <div className="block text-sm font-medium text-slate-700">
      <label htmlFor={id}>Gambar yang relevan</label>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        disabled={uploading}
        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"
      />
      <span className="mt-1 block text-xs font-normal text-slate-400">
        Format JPG, PNG, atau WebP. Maksimal 4 MB.
      </span>

      {uploading && (
        <p className="mt-2 text-sm font-normal text-slate-500">
          Mengunggah gambar...
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm font-normal text-red-600">
          {error}
        </p>
      )}

      {value && !uploading && (
        <div className="mt-3 space-y-2">
          <NextImage
            src={value}
            alt="Pratinjau gambar game"
            width={640}
            height={360}
            className="h-52 w-full rounded-xl border border-slate-200 object-cover"
          />
          <button
            type="button"
            onClick={() => {
              onChange("");
              setError("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Hapus gambar
          </button>
        </div>
      )}
    </div>
  );
}