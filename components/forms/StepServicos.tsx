"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { servicosAdicionais } from "@/lib/constants";
import { CertidaoFormValues } from "@/lib/types";

export function StepServicos() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  const formato = watch("formato");
  const servicos = watch("servicos") || [];

  useEffect(() => {
    if (formato === "digital") {
      // Keep the delivery section hidden for digital format.
    }
  }, [formato]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {servicosAdicionais.map((servico) => {
          const selected = servicos.includes(servico.id);
          return (
            <label
              key={servico.id}
              className={`group cursor-pointer rounded-[24px] border p-5 transition ${
                selected ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white"
              }`}
            >
              <input
                type="checkbox"
                value={servico.id}
                className="sr-only"
                {...register("servicos")}
              />
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">{servico.name}</span>
                  <span className="text-sm font-semibold text-brand-700">R$ {servico.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-slate-500">{servico.description}</p>
              </div>
            </label>
          );
        })}
      </div>

      {formato === "fisica" ? (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
          <p className="mb-4 text-sm font-semibold text-slate-800">Endereço de entrega</p>
          <div className="grid gap-4 md:grid-cols-3">
            <input className="input-base" placeholder="CEP" {...register("enderecoEntrega.cep")} />
            <input className="input-base" placeholder="Rua" {...register("enderecoEntrega.rua")} />
            <input className="input-base" placeholder="Número" {...register("enderecoEntrega.numero")} />
            <input className="input-base" placeholder="Complemento" {...register("enderecoEntrega.complemento")} />
            <input className="input-base" placeholder="Bairro" {...register("enderecoEntrega.bairro")} />
            <input className="input-base" placeholder="Cidade" {...register("enderecoEntrega.cidade")} />
            <input className="input-base" placeholder="Estado" {...register("enderecoEntrega.estado")} />
          </div>
        </div>
      ) : (
        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-slate-700">
          A certidão será enviada por e-mail e WhatsApp assim que estiver disponível.
        </div>
      )}
    </div>
  );
}
