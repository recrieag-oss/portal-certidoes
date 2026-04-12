"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Credenciais inválidas"); return; }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl bg-white px-5 py-2.5">
            <Image src="/logo.svg" alt="Portal Certidões" width={120} height={34} className="h-8 w-auto" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] bg-[#111827] border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="border-b border-white/10 px-8 py-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <ShieldAlert className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Painel Administrativo</h1>
              <p className="text-xs text-slate-400">Acesso restrito — apenas usuários autorizados</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">E-mail</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portal.com"
                className="w-full rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required value={senha} onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-[12px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-[14px] bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-50">
              {loading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : <Lock className="h-4 w-4" />}
              {loading ? "Autenticando..." : "Acessar painel"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Portal Certidões · Sistema de Gestão Interna
        </p>
      </div>
    </div>
  );
}
