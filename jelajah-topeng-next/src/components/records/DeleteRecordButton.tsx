"use client";

import { useActionState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { deleteRecord } from "@/app/actions/records";
import { useToast } from "@/components/ToastProvider";
import type { FormState, RecordKind } from "@/lib/content-config";

// Server Action + .bind(): kind & id dititipkan ke action.
export default function DeleteRecordButton({
  kind,
  id,
  onDone,
}: {
  kind: RecordKind;
  id: string;
  onDone: () => void;
}) {
  const toast = useToast();
  const [state, deleteAction, pending] = useActionState(
    deleteRecord.bind(null, kind, id),
    {} as FormState,
  );

  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) {
      toast.success(state.message ?? "Data berhasil dihapus");
      onDone();
    } else {
      toast.error(state.message ?? "Gagal menghapus data.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={deleteAction}>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={15} /> {pending ? "Menghapus..." : "Hapus"}
      </button>
    </form>
  );
}
