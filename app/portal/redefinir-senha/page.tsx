"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, KeyRound, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

function RedefinirSenhaForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token") ?? "";

  const [senha, setSenha]         = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showP1, setShowP1]       = useState(false);
  const [showP2, setShowP2]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmar) { setError("As senhas não coincidem."); return; }
    if (senha.length < 6)    { setError("A senha deve ter pelo menos 6 caracteres."); return; }

    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, senha }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erro ao redefinir senha."); return; }
      setDone(true);
      setTimeout(() => router.push("/portal/login"), 3000);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-8 py-8">
      {!token ? (
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="font-semibold text-slate-800">Link inválido</p>
          <p className="text-sm text-slate-500">Este link de redefinição é inválido ou já foi utilizado.</p>
          <Link href="/portal/esqueci-senha"
            className="mt-2 inline-flex items-center gap-2 rounded-[16px] bg-[#002776] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900">
            Solicitar novo link
          </Link>
        </div>
      ) : done ? (
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Senha redefinida!</p>
            <p className="mt-1 text-sm text-slate-500">Redirecionando para o login em instantes...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Nova senha</label>
            <div className="relative">
              <input
                type={showP1 ? "text" : "password"} required value={senha}
                onChange={(e) => setSenha(e.target.value)} placeholder="mínimo 6 caracteres"
                className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm text-slate-900 outline-none focus:border-[#002776] focus:ring-2 focus:ring-blue-100 transition"
              />
              <button type="button" onClick={() => setShowP1(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showP1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Confirmar senha</label>
            <div className="relative">
              <input
                type={showP2 ? "text" : "password"} required value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)} placeholder="repita a senha"
                className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm text-slate-900 outline-none focus:border-[#002776] focus:ring-2 focus:ring-blue-100 transition"
              />
              <button type="button" onClick={() => setShowP2(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showP2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#002776] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1835] to-[#002776] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-2xl">
          <div className="bg-[#002776] px-8 py-8 text-center">
            <div className="mx-auto mb-4 w-fit rounded-2xl bg-white/10 px-5 py-2.5">
              <Image src="/logo.svg" alt="Portal Certidões" width={130} height={36} className="h-8 w-auto" />
            </div>
            <h1 className="text-xl font-bold text-white">Criar nova senha</h1>
            <p className="mt-1.5 text-sm text-blue-200">Escolha uma senha segura para sua conta</p>
          </div>
          <Suspense fallback={<div className="px-8 py-8 text-center text-sm text-slate-400">Carregando...</div>}>
            <RedefinirSenhaForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
