"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function PdfUploadForm({ orderId, hasPdf }: { orderId: string; hasPdf: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const [fileName, setFileName] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Selecione um arquivo PDF válido."); return; }

    setFileName(file.name);
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = new FormData();
    form.append("pdf", file);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/pdf`, { method: "POST", body: form });
      if (!res.ok) throw new Error();
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Erro ao fazer upload do PDF.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-[20px] border border-white/10 bg-[#1a2235] p-6">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-bold text-white">Upload do documento</h2>
      </div>

      {hasPdf && !success && (
        <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" /> PDF já enviado. Envie outro para substituir.
        </div>
      )}

      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />

      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="group w-full flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-white/15 bg-white/5 p-6 text-center transition hover:border-emerald-500/40 hover:bg-emerald-500/5 disabled:opacity-50"
      >
        {loading
          ? <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
          : <Upload className="h-8 w-8 text-slate-500 group-hover:text-emerald-400 transition" />}
        <div>
          <p className="text-sm font-semibold text-slate-300">
            {loading ? "Enviando..." : fileName || "Selecionar arquivo PDF"}
          </p>
          {!loading && <p className="mt-0.5 text-xs text-slate-500">Clique para selecionar · máx. 20MB</p>}
        </div>
      </button>

      {success && (
        <div className="mt-3 flex items-center gap-2 rounded-[12px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          PDF enviado! Status definido como <strong>Finalizado</strong>.
        </div>
      )}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-[12px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}
