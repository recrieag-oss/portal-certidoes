"use client";

import { useFormContext } from "react-hook-form";
import { CertidaoFormValues, CertidaoType } from "@/lib/types";
import { User, Users, Heart, Calendar, BookOpen, AlertCircle } from "lucide-react";

interface Props {
  tipo: CertidaoType;
}

/* ─── Small re-usable field wrapper ─────────────────────────── */
function Field({
  label,
  optional,
  children,
  error,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {label}
        {optional && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">
            opcional
          </span>
        )}
      </span>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Date input that forces dd/mm/yyyy entry ────────────────── */
function DateField({
  label,
  fieldName,
  optional,
}: {
  label: string;
  fieldName: keyof CertidaoFormValues;
  optional?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  const err = errors[fieldName]?.message as string | undefined;

  return (
    <Field label={label} optional={optional} error={err}>
      <div className="relative">
        <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="date"
          className="input-base pl-11"
          {...register(fieldName as never)}
        />
      </div>
    </Field>
  );
}

/* ─── Text input field ───────────────────────────────────────── */
function TextField({
  label,
  fieldName,
  placeholder,
  optional,
  icon: Icon,
}: {
  label: string;
  fieldName: keyof CertidaoFormValues;
  placeholder?: string;
  optional?: boolean;
  icon?: React.ElementType;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  const err = errors[fieldName]?.message as string | undefined;

  return (
    <Field label={label} optional={optional} error={err}>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          type="text"
          placeholder={placeholder}
          className={`input-base ${Icon ? "pl-11" : ""}`}
          {...register(fieldName as never)}
        />
      </div>
    </Field>
  );
}

/* ─── Formato section (shared by all types) ─────────────────── */
function FormatoSection() {
  const {
    register,
    watch,
  } = useFormContext<CertidaoFormValues>();

  const formato = watch("formato");

  return (
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
  );
}

/* ─── Dados complementares (livro / página / termo) ─────────── */
function DadosComplementares() {
  const { register } = useFormContext<CertidaoFormValues>();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-slate-400" />
        <p className="text-sm font-semibold text-slate-800">
          Dados complementares
          <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            opcional
          </span>
        </p>
      </div>
      <p className="mb-4 text-xs text-slate-500 leading-relaxed">
        Se você possui o livro, página e termo do registro, informe abaixo. Esses dados aceleram a localização da certidão.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <input className="input-base" placeholder="Livro" {...register("livro")} />
        <input className="input-base" placeholder="Página" {...register("pagina")} />
        <input className="input-base" placeholder="Termo" {...register("termo")} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NASCIMENTO
═══════════════════════════════════════════════════════════════ */
function DadosNascimento() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <User className="h-4 w-4 text-brand-500" /> Nome completo
          </span>
          <input
            className="input-base"
            placeholder="Nome do registrado na certidão"
            {...register("nomeCompleto")}
          />
          {errors.nomeCompleto && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" /> {errors.nomeCompleto.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            CPF
          </span>
          <input
            className="input-base"
            placeholder="000.000.000-00"
            maxLength={14}
            {...register("cpf")}
          />
          {errors.cpf && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" /> {errors.cpf.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Data de nascimento</span>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input-base pl-11" type="date" {...register("dataNascimento")} />
          </div>
          {errors.dataNascimento && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" /> {errors.dataNascimento.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Nome da mãe</span>
          <input className="input-base" placeholder="Nome da mãe" {...register("nomeMae")} />
          {errors.nomeMae && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" /> {errors.nomeMae.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            Nome do pai
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">
              opcional
            </span>
          </span>
          <input className="input-base" placeholder="Opcional" {...register("nomePai")} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ÓBITO
═══════════════════════════════════════════════════════════════ */
function DadosObito() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  return (
    <div className="space-y-6">
      {/* Context banner */}
      <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs leading-relaxed text-slate-500">
          Preencha os dados <strong className="text-slate-700">exatamente como constam na certidão</strong>, incluindo
          acentos e grafias originais. Essas informações são usadas para localizar o registro no cartório.
        </p>
      </div>

      {/* Nome do falecido */}
      <div className="space-y-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <User className="h-4 w-4 text-brand-500" />
          Nome completo do falecido(a) na certidão
        </span>
        <input
          className="input-base"
          placeholder="Nome completo conforme consta na certidão"
          {...register("nomeFalecido")}
        />
        {errors.nomeFalecido && (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3 shrink-0" /> {errors.nomeFalecido.message}
          </p>
        )}
      </div>

      {/* Mãe e Pai */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">
            Nome completo da mãe na certidão
          </span>
          <input
            className="input-base"
            placeholder="Nome da mãe conforme a certidão"
            {...register("nomeMaeFalecido")}
          />
          {errors.nomeMaeFalecido && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3 shrink-0" /> {errors.nomeMaeFalecido.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            Nome completo do pai na certidão
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">
              opcional
            </span>
          </span>
          <input
            className="input-base"
            placeholder="Caso conste no registro"
            {...register("nomePaiFalecido")}
          />
        </div>
      </div>

      {/* Data do óbito */}
      <div className="space-y-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Calendar className="h-4 w-4 text-brand-500" />
          Data do óbito
        </span>
        <div className="md:max-w-xs">
          <input
            type="date"
            className="input-base"
            {...register("dataObito")}
          />
        </div>
        {errors.dataObito && (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3 shrink-0" /> {errors.dataObito.message}
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CASAMENTO
═══════════════════════════════════════════════════════════════ */
function DadosCasamento() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CertidaoFormValues>();

  return (
    <div className="space-y-6">
      {/* Context banner */}
      <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs leading-relaxed text-slate-500">
          Preencha os nomes <strong className="text-slate-700">exatamente como constam na certidão</strong> — incluindo
          o nome de solteiro(a), se aplicável.
        </p>
      </div>

      {/* Dois cônjuges lado a lado */}
      <div className="relative">
        {/* Connector visual */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 items-center justify-center md:flex">
          <span
            className="z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-brand-50 shadow-sm"
            style={{ borderColor: "rgba(0,155,58,0.20)" }}
          >
            <Heart className="h-4 w-4 text-brand-500" strokeWidth={2} />
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Cônjuge 1 */}
          <div
            className="rounded-[24px] border border-slate-200 bg-white p-5 space-y-3"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                1
              </span>
              <p className="text-sm font-semibold text-slate-700">Cônjuge 1</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500">
                Nome completo na certidão
              </span>
              <input
                className="input-base text-sm"
                placeholder="Nome completo do(a) cônjuge 1"
                {...register("nomeConjuge1")}
              />
              {errors.nomeConjuge1 && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.nomeConjuge1.message}
                </p>
              )}
            </div>
          </div>

          {/* Cônjuge 2 */}
          <div
            className="rounded-[24px] border border-slate-200 bg-white p-5 space-y-3"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                2
              </span>
              <p className="text-sm font-semibold text-slate-700">Cônjuge 2</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-500">
                Nome completo na certidão
              </span>
              <input
                className="input-base text-sm"
                placeholder="Nome completo do(a) cônjuge 2"
                {...register("nomeConjuge2")}
              />
              {errors.nomeConjuge2 && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.nomeConjuge2.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data do casamento */}
      <div className="space-y-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Calendar className="h-4 w-4 text-brand-500" />
          Data de casamento
        </span>
        <div className="md:max-w-xs">
          <input
            type="date"
            className="input-base"
            {...register("dataCasamento")}
          />
        </div>
        {errors.dataCasamento && (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3 shrink-0" /> {errors.dataCasamento.message}
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export function StepDados({ tipo }: Props) {
  return (
    <div className="space-y-6">
      {/* Dados específicos por tipo */}
      {tipo === "nascimento" && <DadosNascimento />}
      {tipo === "obito"     && <DadosObito />}
      {tipo === "casamento" && <DadosCasamento />}

      {/* Dados complementares — comum a todos */}
      <DadosComplementares />

      {/* Formato — comum a todos */}
      <FormatoSection />
    </div>
  );
}
