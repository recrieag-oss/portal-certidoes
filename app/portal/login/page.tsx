"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, LogIn, ArrowLeft, ShieldCheck } from "lucide-react";

export default function PortalLoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Credenciais inválidas"); return; }
      router.push("/portal");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>

        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm border border-slate-200">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 text-center border-b border-slate-100">
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[28px] bg-[#009B3A]" />
            <div className="mx-auto mb-4 w-fit">
              <Image src="/logo.svg" alt="Portal Certidões" width={300} height={68} className="h-9 w-auto" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Área do Cliente</h1>
            <p className="mt-1.5 text-sm text-slate-500">Acompanhe seus pedidos de certidões</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">E-mail</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-[#009B3A] focus:ring-2 focus:ring-[#009B3A]/10 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required value={senha} onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm text-slate-900 outline-none focus:border-[#009B3A] focus:ring-2 focus:ring-[#009B3A]/10 transition"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="mt-0.5 text-red-500">⚠</span> {error}
              </div>
            )}

            <div className="flex justify-end">
              <Link href="/portal/esqueci-senha" className="text-xs text-[#009B3A] font-medium hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#009B3A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#007A2F] disabled:opacity-60">
              {loading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : <LogIn className="h-4 w-4" />}
              {loading ? "Entrando..." : "Entrar na minha conta"}
            </button>

            <div className="flex items-center gap-2 rounded-[14px] bg-slate-50 px-4 py-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#009B3A]" />
              <p className="text-xs text-slate-500">
                Sua conta é criada automaticamente ao fazer o primeiro pedido.{" "}
                <Link href="/certidao/nascimento" className="text-[#009B3A] font-semibold hover:underline">Solicitar agora</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
