"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function EsqueciSenhaPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { setError("Erro ao enviar. Tente novamente."); return; }
      setSent(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1835] to-[#002776] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/portal/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar ao login
        </Link>

        <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl">
          <div className="bg-[#002776] px-8 py-8 text-center">
            <div className="mx-auto mb-4 w-fit rounded-2xl bg-white px-5 py-2.5">
              <Image src="/logo.svg" alt="Portal Certidões" width={130} height={36} className="h-8 w-auto" />
            </div>
            <h1 className="text-xl font-bold text-white">Esqueceu sua senha?</h1>
            <p className="mt-1.5 text-sm text-blue-200">Enviaremos um link de redefinição para o seu e-mail</p>
          </div>

          <div className="px-8 py-8">
            {sent ? (
              <div className="flex flex-col items-center gap-4 text-center py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">E-mail enviado!</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Se existe uma conta com <strong>{email}</strong>, você receberá um link em breve.
                  </p>
                  <p className="mt-2 text-xs text-slate-400">Verifique também a caixa de spam. O link expira em 1 hora.</p>
                </div>
                <Link href="/portal/login"
                  className="mt-2 inline-flex items-center gap-2 rounded-[16px] bg-[#002776] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900">
                  Voltar ao login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">E-mail da conta</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full rounded-[16px] border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-[#002776] focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#002776] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  {loading ? "Enviando..." : "Enviar link de redefinição"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
