"use client";

import { useEffect, useMemo, useState } from "react";
import { servicosAdicionais } from "@/lib/constants";
import type { CheckoutStoragePayload } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

function getItemPrice(id: string) {
  return servicosAdicionais.find((item) => item.id === id)?.price ?? 0;
}

export function OrderSummary() {
  const [payload, setPayload] = useState<CheckoutStoragePayload | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const item = window.localStorage.getItem("portal-certidao-form");
    if (item) {
      setPayload(JSON.parse(item) as CheckoutStoragePayload);
    }
  }, []);

  const summary = useMemo(() => {
    if (!payload) return null;

    const services = payload.data.servicos || [];
    const serviceTotal = services.reduce((sum: number, id: string) => sum + getItemPrice(id), 0);
    const baseFee = 249.9;
    const total = baseFee + serviceTotal;

    return {
      title: payload.tipo,
      nome: payload.data.nomeCompleto,
      cartorio: payload.data.cartorio || "Não informado",
      cidade: payload.data.cidade,
      estado: payload.data.estado,
      formato: payload.data.formato,
      services,
      baseFee,
      serviceTotal,
      total,
    };
  }, [payload]);

  if (!summary) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft sm:rounded-[32px] sm:p-8">
        <p className="text-sm text-slate-500">
          Nenhum pedido encontrado. Complete um formulário de solicitação antes de continuar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft sm:rounded-[32px] sm:p-8 lg:min-h-full">
      <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">Resumo do pedido</h2>
      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <div className="grid gap-2">
          <span className="font-semibold text-slate-700">Tipo de certidão</span>
          <p>{summary.title}</p>
        </div>
        <div className="grid gap-2">
          <span className="font-semibold text-slate-700">Nome do registrado</span>
          <p>{summary.nome}</p>
        </div>
        <div className="grid gap-2">
          <span className="font-semibold text-slate-700">Cartório / Cidade / Estado</span>
          <p>{summary.cartorio} ? {summary.cidade} ? {summary.estado}</p>
        </div>
        <div className="grid gap-2">
          <span className="font-semibold text-slate-700">Formato</span>
          <p>{summary.formato === "fisica" ? "Física" : "Digital"}</p>
        </div>
      </div>

      <div className="mt-8 rounded-[24px] bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-700">Serviços adicionais</p>
        <div className="mt-4 space-y-3">
          {summary.services.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum serviço adicional selecionado.</p>
          ) : (
            summary.services.map((id: string) => {
              const service = servicosAdicionais.find((item) => item.id === id);
              return (
                <div key={id} className="flex items-center justify-between text-sm text-slate-700">
                  <span>{service?.name}</span>
                  <span>{formatCurrency(service?.price ?? 0)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Taxa do serviço base</span>
          <span>{formatCurrency(summary.baseFee)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Serviços adicionais</span>
          <span>{formatCurrency(summary.serviceTotal)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-lg font-semibold text-slate-950">
          <span>Total do pedido</span>
          <span>{formatCurrency(summary.total)}</span>
        </div>
      </div>
    </div>
  );
}
