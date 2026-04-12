"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SucessoPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("portal-certidao-form");
    if (stored) {
      const payload = JSON.parse(stored);
      setOrderId(payload?.pedido?.id ?? null);
      window.localStorage.removeItem("portal-certidao-form");
    }
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-8">
      <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle className="h-12 w-12" />
      </div>
      <h1 className="mt-8 text-4xl font-semibold text-slate-950">Pedido realizado com sucesso!</h1>
      {orderId && (
        <p className="mt-4 text-lg text-slate-600">
          Seu código de acompanhamento é <strong className="text-slate-900">{orderId}</strong>.
        </p>
      )}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[32px] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold text-slate-700">O que acontece agora?</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Nossa equipe começa a localizar o documento no cartório informado. Você receberá atualizações por e-mail e WhatsApp.
          </p>
        </div>
        <div className="rounded-[32px] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold text-slate-700">Acesse seu portal</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Entre no portal com seu e-mail e senha para acompanhar o status do pedido e fazer o download quando estiver pronto.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/portal" className="rounded-[28px] bg-brand-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-brand-700">
          Acessar meu portal
        </Link>
        <Link href="/" className="rounded-[28px] border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
          Fazer novo pedido
        </Link>
      </div>
    </main>
  );
}
