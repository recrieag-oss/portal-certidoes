"use client";

import { useFormContext } from "react-hook-form";
import { CertidaoFormValues } from "@/lib/types";

export function StepDados() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  const formato = watch("formato");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Nome completo</span>
          <input className="input-base" placeholder="Nome do registrado" {...register("nomeCompleto")} />
          {errors.nomeCompleto && <p className="text-sm text-danger-600">{errors.nomeCompleto.message}</p>}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">CPF</span>
          <input
            className="input-base"
            placeholder="000.000.000-00"
            maxLength={14}
            {...register("cpf")}
          />
          {errors.cpf && <p className="text-sm text-danger-600">{errors.cpf.message}</p>}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Data de nascimento</span>
          <input className="input-base" type="date" {...register("dataNascimento")} />
          {errors.dataNascimento && <p className="text-sm text-danger-600">{errors.dataNascimento.message}</p>}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Nome da mãe</span>
          <input className="input-base" placeholder="Nome da mãe" {...register("nomeMae")} />
          {errors.nomeMae && <p className="text-sm text-danger-600">{errors.nomeMae.message}</p>}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Nome do pai</span>
          <input className="input-base" placeholder="Opcional" {...register("nomePai")} />
        </label>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <p className="mb-4 text-sm font-semibold text-slate-800">Dados complementares</p>
        <div className="grid gap-4 md:grid-cols-3">
          <input className="input-base" placeholder="Livro" {...register("livro")} />
          <input className="input-base" placeholder="Página" {...register("pagina")} />
          <input className="input-base" placeholder="Termo" {...register("termo")} />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">Formato da certidão</p>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              value: "fisica",
              title: "Certidão Física",
              description: "Documento em papel oficial enviado pelos Correios",
            },
            {
              value: "digital",
              title: "Certidão Digital",
              description: "Cópia digital enviada por e-mail e WhatsApp",
            },
          ].map((option) => {
            const active = formato === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-[24px] border p-5 transition ${
                  active ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={formato === option.value}
                  className="sr-only"
                  {...register("formato")}
                />
                <div className="flex flex-col gap-2">
                  <p className="text-base font-semibold text-slate-900">{option.title}</p>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
