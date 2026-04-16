"use client";

import { useFormContext } from "react-hook-form";
import { CertidaoFormValues } from "@/lib/types";
import { UserCircle2, CheckCircle2 } from "lucide-react";

export function StepContato() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  const isAuthenticated = watch("isAuthenticated");

  /* ── Authenticated: show read-only account card ─────────────── */
  if (isAuthenticated) {
    const nome      = watch("nomeSolicitante");
    const email     = watch("email");
    const whatsapp  = watch("whatsapp");

    return (
      <div className="space-y-5">
        {/* Logged-in account card */}
        <div className="overflow-hidden rounded-[24px] border border-[#009B3A]/25 bg-[#009B3A]/5">
          <div className="flex items-center gap-3 border-b border-[#009B3A]/15 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#009B3A]/15">
              <UserCircle2 className="h-5 w-5 text-[#009B3A]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Você está logado</p>
              <p className="text-xs text-slate-500">Este pedido será vinculado à sua conta</p>
            </div>
            <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-[#009B3A]" />
          </div>
          <div className="grid gap-x-8 gap-y-3 px-5 py-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Nome</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{nome || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">E-mail</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{email || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">WhatsApp</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{whatsapp || "—"}</p>
            </div>
          </div>
        </div>

        {/* Terms — still required per order */}
        <div className="space-y-2">
          <label className="inline-flex cursor-pointer items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600"
              {...register("aceitaTermos")}
            />
            <span>
              Li e aceito os{" "}
              <span className="font-semibold text-slate-900">Termos de Uso</span> e a{" "}
              <span className="font-semibold text-slate-900">Política de Privacidade</span> para
              este pedido.
            </span>
          </label>
          {errors.aceitaTermos && (
            <p className="text-sm text-danger-600">{errors.aceitaTermos.message}</p>
          )}
        </div>
      </div>
    );
  }

  /* ── Guest: full registration form ──────────────────────────── */
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Nome do solicitante</span>
          <input
            className="input-base"
            placeholder="Nome completo"
            {...register("nomeSolicitante")}
          />
          {errors.nomeSolicitante && (
            <p className="text-sm text-danger-600">{errors.nomeSolicitante.message}</p>
          )}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">CPF do solicitante</span>
          <input
            className="input-base"
            placeholder="000.000.000-00"
            maxLength={14}
            {...register("cpfSolicitante")}
          />
          {errors.cpfSolicitante && (
            <p className="text-sm text-danger-600">{errors.cpfSolicitante.message}</p>
          )}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">E-mail para notificações</span>
          <input
            className="input-base"
            placeholder="email@exemplo.com"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-danger-600">{errors.email.message}</p>
          )}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">WhatsApp para contato</span>
          <input
            className="input-base"
            placeholder="(00) 00000-0000"
            maxLength={15}
            {...register("whatsapp")}
          />
          {errors.whatsapp && (
            <p className="text-sm text-danger-600">{errors.whatsapp.message}</p>
          )}
        </label>
      </div>

      <div className="rounded-[20px] sm:rounded-[24px] border border-brand-100 bg-brand-50 p-4 sm:p-6">
        <p className="mb-4 text-sm font-semibold text-slate-800">
          Acesso ao portal de acompanhamento
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Senha</span>
            <input
              className="input-base"
              placeholder="Mínimo 8 caracteres"
              type="password"
              autoComplete="new-password"
              {...register("senha")}
            />
            {errors.senha && (
              <p className="text-sm text-danger-600">{errors.senha.message}</p>
            )}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Confirmar senha</span>
            <input
              className="input-base"
              placeholder="Repita a senha"
              type="password"
              autoComplete="new-password"
              {...register("confirmarSenha")}
            />
            {errors.confirmarSenha && (
              <p className="text-sm text-danger-600">{errors.confirmarSenha.message}</p>
            )}
          </label>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Use seu e-mail e esta senha para acessar o portal e acompanhar o pedido.
        </p>
      </div>

      <label className="inline-flex cursor-pointer items-start gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600"
          {...register("aceitaTermos")}
        />
        <span>
          Li e aceito os{" "}
          <span className="font-semibold text-slate-900">Termos de Uso</span> e a{" "}
          <span className="font-semibold text-slate-900">Política de Privacidade</span>.
        </span>
      </label>
      {errors.aceitaTermos && (
        <p className="text-sm text-danger-600">{errors.aceitaTermos.message}</p>
      )}
    </div>
  );
}
