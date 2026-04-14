"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { servicosAdicionais } from "@/lib/constants";
import type { CheckoutStoragePayload } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function MercadoPagoCheckout() {
  const router = useRouter();
  const [order, setOrder] = useState<CheckoutStoragePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isTestMode = !process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("portal-certidao-form");
    if (stored) {
      setOrder(JSON.parse(stored) as CheckoutStoragePayload);
    }
  }, []);

  const estimatedTotal = order
    ? 249.9 +
      (order.data.servicos || []).reduce((sum, id) => {
        const service = servicosAdicionais.find((item) => item.id === id);
        return sum + (service?.price ?? 0);
      }, 0)
    : 0;

  const handleCheckout = async () => {
    if (!order) {
      setError("Nenhum pedido encontrado. Complete a solicitação antes de pagar.");
      return;
    }

    setLoading(true);
    setError("");

    const additionalItems = (order.data.servicos || []).map((id: string) => {
      const service = servicosAdicionais.find((item) => item.id === id);
      return {
        title: `Serviço adicional: ${service?.name ?? id}` ,
        quantity: 1,
        unit_price: service?.price ?? 0,
      };
    });

    const items = [
      {
        title: `Certidão ${order.tipo}`,
        quantity: 1,
        unit_price: 249.9,
      },
      ...additionalItems,
    ];

    try {
      if (isTestMode) {
        router.push("/sucesso");
        return;
      }

      const response = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          payer: {
            name: order.data.nomeSolicitante,
            email: order.data.email,
            identification: {
              type: "CPF",
              number: order.data.cpfSolicitante,
            },
          },
          metadata: {
            tipo: order.tipo,
            cpfRegistrado: order.data.cpf,
          },
          external_reference: `CERT-${Date.now()}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Falha ao criar preferência");
      }

      window.location.href = data.init_point || data.sandbox_init_point || data.redirect_url;
    } catch {
      setError("Não foi possível iniciar o pagamento. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft lg:sticky lg:top-28">
      <h2 className="text-xl font-semibold text-slate-950">Pagamento Mercado Pago</h2>
      <p className="mt-3 text-sm text-slate-500">
        Você será redirecionado para a página segura do Mercado Pago para concluir o pagamento.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-semibold">Valor estimado</p>
          <p>{formatCurrency(estimatedTotal)}</p>
        </div>
        {isTestMode ? (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Mercado Pago não está configurado. Você pode simular o pagamento para prosseguir nos testes.
          </div>
        ) : null}
        <Button onClick={handleCheckout} disabled={loading} className="w-full">
          {loading ? "Aguarde..." : isTestMode ? "Simular pagamento" : "Pagar com Mercado Pago"}
        </Button>
        {error && <p className="text-sm text-danger-600">{error}</p>}
      </div>
    </div>
  );
}
