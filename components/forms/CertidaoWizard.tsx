"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certidaoFormSchema } from "@/lib/validators";
import { CertidaoFormValues, CertidaoType } from "@/lib/types";
import { StepLocalizacao } from "./StepLocalizacao";
import { StepDados } from "./StepDados";
import { StepServicos } from "./StepServicos";
import { StepContato } from "./StepContato";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";

const stepTitles = ["Localização", "Dados do registrado", "Serviços e entrega", "Solicitante e conta"];

const defaultValues: CertidaoFormValues = {
  estado: "",
  cidade: "",
  cartorio: "",
  naoSeiCartorio: false,
  nomeCompleto: "",
  cpf: "",
  dataNascimento: "",
  nomeMae: "",
  nomePai: "",
  livro: "",
  pagina: "",
  termo: "",
  formato: "digital",
  servicos: [],
  enderecoEntrega: undefined,
  nomeSolicitante: "",
  cpfSolicitante: "",
  email: "",
  whatsapp: "",
  senha: "",
  confirmarSenha: "",
  aceitaTermos: false,
};

const stepFields = [
  ["estado", "cidade", "naoSeiCartorio", "cartorio"],
  ["nomeCompleto", "cpf", "dataNascimento", "nomeMae", "formato"],
  ["servicos"],
  ["nomeSolicitante", "cpfSolicitante", "email", "whatsapp", "senha", "confirmarSenha", "aceitaTermos"],
];

interface CertidaoWizardProps {
  tipo: CertidaoType;
}

export function CertidaoWizard({ tipo }: CertidaoWizardProps) {
  const router = useRouter();
  const form = useForm<CertidaoFormValues>({
    resolver: zodResolver(certidaoFormSchema),
    defaultValues,
    mode: "onTouched",
  });
  const { currentStep, nextStep, previousStep, isLastStep, isFirstStep } = useMultiStepForm(stepTitles);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(() => {
    if (tipo === "nascimento") return "Certidão de Nascimento";
    if (tipo === "casamento") return "Certidão de Casamento";
    return "Certidão de Óbito";
  }, [tipo]);

  const getStepFields = () => {
    if (currentStep !== 2) {
      return stepFields[currentStep];
    }

    const formato = form.getValues("formato");
    const fields = ["servicos"];

    if (formato === "fisica") {
      fields.push(
        "enderecoEntrega.cep",
        "enderecoEntrega.rua",
        "enderecoEntrega.numero",
        "enderecoEntrega.bairro",
        "enderecoEntrega.cidade",
        "enderecoEntrega.estado",
      );
    }

    return fields;
  };

  const onNext = async () => {
    const valid = await form.trigger(getStepFields() as any);
    if (valid) nextStep();
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      const pedidoId = `CERT-${Math.floor(Math.random() * 90000 + 10000)}`;
      const pedidoResumo = {
        id: pedidoId,
        tipo,
        nomeRegistrado: data.nomeCompleto,
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
      <form onSubmit={onSubmit} noValidate className="relative pb-32">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-600">Solicitação</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Preencha os dados com atenção para localizarmos o registro no cartório correto.
              </p>
            </div>
          </div>

          <Stepper steps={stepTitles} currentIndex={currentStep} />

          <div className="mt-8 space-y-8">
            {currentStep === 0 && <StepLocalizacao tipo={tipo} />}
            {currentStep === 1 && <StepDados />}
            {currentStep === 2 && <StepServicos />}
            {currentStep === 3 && <StepContato />}
          </div>
          {form.formState.errors.root && (
            <p className="mt-4 text-sm text-danger-600">{form.formState.errors.root.message}</p>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#002776] px-4 py-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={previousStep}
              disabled={isFirstStep}
              className="inline-flex items-center justify-center rounded-[28px] border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Voltar
            </button>
            <div className="flex items-center gap-3">
              {!isLastStep ? (
                <Button type="button" onClick={onNext}>
                  Continuar
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Ir para pagamento"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
