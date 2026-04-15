"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certidaoFormSchema } from "@/lib/validators";
import { CertidaoFormValues, CertidaoType } from "@/lib/types";
import { StepLocalizacao } from "./StepLocalizacao";
import { StepDados } from "./StepDados";
import { StepServicos } from "./StepServicos";
import { StepContato } from "./StepContato";
import { Button } from "@/components/ui/Button";
import { MapPin, FileText, Package, User } from "lucide-react";

const sections = [
  { number: "1", label: "Localização do Cartório",    icon: MapPin    },
  { number: "2", label: "Dados do Registrado",        icon: FileText  },
  { number: "3", label: "Serviços e Formato",         icon: Package   },
  { number: "4", label: "Dados do Solicitante",       icon: User      },
];

function buildDefaultValues(tipo: CertidaoType, user?: AuthUser): CertidaoFormValues {
  return {
    // Localização
    estado: "",
    cidade: "",
    cartorio: "",
    naoSeiCartorio: false,

    // Interno
    tipo,

    // Nascimento
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    nomeMae: "",
    nomePai: "",

    // Óbito
    nomeFalecido: "",
    nomeMaeFalecido: "",
    nomePaiFalecido: "",
    dataObito: "",

    // Casamento
    nomeConjuge1: "",
    nomeConjuge2: "",
    dataCasamento: "",

    // Comum
    livro: "",
    pagina: "",
    termo: "",
    formato: "digital",
    servicos: [],
    enderecoEntrega: undefined,

    // Solicitante — pre-filled when logged in
    isAuthenticated: !!user,
    nomeSolicitante: user?.nome     ?? "",
    cpfSolicitante:  user?.cpf      ?? "",
    email:           user?.email    ?? "",
    whatsapp:        user?.whatsapp ?? "",
    senha:           "",
    confirmarSenha:  "",
    aceitaTermos:    false,
  };
}

/** Derive a human-readable "registered name" for the order summary */
function deriveNomeRegistrado(tipo: CertidaoType, data: CertidaoFormValues): string {
  if (tipo === "obito")    return data.nomeFalecido   || "Não informado";
  if (tipo === "casamento") {
    const c1 = data.nomeConjuge1 || "";
    const c2 = data.nomeConjuge2 || "";
    return c1 && c2 ? `${c1} & ${c2}` : c1 || c2 || "Não informado";
  }
  return data.nomeCompleto || "Não informado";
}

interface AuthUser {
  nome: string;
  cpf: string;
  email: string;
  whatsapp: string;
}

interface CertidaoWizardProps {
  tipo: CertidaoType;
  /** Pre-populated when the requester is already logged in */
  user?: AuthUser;
}

export function CertidaoWizard({ tipo, user }: CertidaoWizardProps) {
  const router = useRouter();
  const form = useForm<CertidaoFormValues>({
    resolver: zodResolver(certidaoFormSchema),
    defaultValues: buildDefaultValues(tipo, user),
    mode: "onTouched",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep hidden fields in sync (guards against future hot-reloads)
  useEffect(() => {
    form.setValue("tipo", tipo, { shouldValidate: false });
    form.setValue("isAuthenticated", !!user, { shouldValidate: false });
  }, [tipo, user, form]);

  const title = useMemo(() => {
    if (tipo === "nascimento") return "Certidão de Nascimento";
    if (tipo === "casamento")  return "Certidão de Casamento";
    return "Certidão de Óbito";
  }, [tipo]);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      const pedidoId = `CERT-${Math.floor(Math.random() * 90000 + 10000)}`;
      const pedidoResumo = {
        id: pedidoId,
        tipo,
        nomeRegistrado: deriveNomeRegistrado(tipo, data),
        cartorio: data.cartorio || "Não informado",
        estado: data.estado,
        cidade: data.cidade,
        formato: data.formato,
        servicos: data.servicos?.map((id) => ({ id })) || [],
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, formData: data, pedidoResumo }),
      });

      if (!res.ok) throw new Error("Falha ao registrar pedido");
      const { orderId } = await res.json();

      window.localStorage.setItem(
        "portal-certidao-form",
        JSON.stringify({ tipo, data, pedido: { ...pedidoResumo, id: orderId } }),
      );
      router.push("/checkout");
    } catch {
      form.setError("root", { message: "Erro ao registrar pedido. Tente novamente." });
      setIsSubmitting(false);
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate>

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#009B3A]">Solicitação</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Preencha as informações abaixo. Você pode rolar a página e preencher no seu ritmo.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map(({ number, label, icon: Icon }, idx) => (
            <div
              key={number}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
                  {number}
                </span>
                <Icon className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-semibold text-slate-800">{label}</span>
              </div>

              {/* Section body */}
              <div className="p-6">
                {idx === 0 && <StepLocalizacao tipo={tipo} />}
                {idx === 1 && <StepDados tipo={tipo} />}
                {idx === 2 && <StepServicos />}
                {idx === 3 && <StepContato />}
              </div>
            </div>
          ))}
        </div>

        {/* Root error */}
        {form.formState.errors.root && (
          <p className="mt-4 text-sm text-danger-600">{form.formState.errors.root.message}</p>
        )}

        {/* Submit */}
        <div className="mt-8">
          <Button type="submit" disabled={isSubmitting} className="w-full py-5 text-base">
            {isSubmitting ? "Enviando..." : "Ir para pagamento →"}
          </Button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Seus dados são protegidos com criptografia SSL
          </p>
        </div>

      </form>
    </FormProvider>
  );
}
