import { z } from "zod";
import { cleanNumeric } from "./masks";

function isValidCPF(cpf: string) {
  const digits = cleanNumeric(cpf);
  if (digits.length !== 11 || /^([0-9])\1+$/.test(digits)) {
    return false;
  }

  const calcDigit = (factor: number) => {
    const total = digits
      .slice(0, factor - 1)
      .split("")
      .reduce((sum, char, index) => sum + Number(char) * (factor - index), 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const firstDigit = calcDigit(10);
  const secondDigit = calcDigit(11);

  return firstDigit === Number(digits[9]) && secondDigit === Number(digits[10]);
}

export const certidaoFormSchema = z
  .object({
    // ── Localização ──────────────────────────────────────────────
    estado: z.string().min(1, "Campo obrigatório"),
    cidade: z.string().min(1, "Campo obrigatório"),
    cartorio: z.string().optional(),
    naoSeiCartorio: z.boolean(),

    // ── Tipo (interno) ───────────────────────────────────────────
    tipo: z.enum(["nascimento", "casamento", "obito"]).optional(),

    // ── Nascimento ───────────────────────────────────────────────
    nomeCompleto: z.string().optional(),
    cpf: z.string().optional(),
    dataNascimento: z.string().optional(),
    nomeMae: z.string().optional(),
    nomePai: z.string().optional(),

    // ── Óbito ────────────────────────────────────────────────────
    nomeFalecido: z.string().optional(),
    nomeMaeFalecido: z.string().optional(),
    nomePaiFalecido: z.string().optional(),
    dataObito: z.string().optional(),

    // ── Casamento ────────────────────────────────────────────────
    nomeConjuge1: z.string().optional(),
    nomeConjuge2: z.string().optional(),
    dataCasamento: z.string().optional(),

    // ── Comum ────────────────────────────────────────────────────
    livro: z.string().optional(),
    pagina: z.string().optional(),
    termo: z.string().optional(),
    formato: z.enum(["fisica", "digital"]),
    servicos: z.array(z.string()).optional(),
    enderecoEntrega: z
      .object({
        cep: z.string().min(8, "CEP inválido"),
        rua: z.string().min(1, "Campo obrigatório"),
        numero: z.string().min(1, "Campo obrigatório"),
        complemento: z.string().optional(),
        bairro: z.string().min(1, "Campo obrigatório"),
        cidade: z.string().min(1, "Campo obrigatório"),
        estado: z.string().min(1, "Campo obrigatório"),
      })
      .optional(),

    // ── Solicitante ──────────────────────────────────────────────
    isAuthenticated: z.boolean().optional(),
    nomeSolicitante: z.string().min(1, "Campo obrigatório"),
    cpfSolicitante: z
      .string()
      .min(1, "Campo obrigatório")
      .refine(isValidCPF, "CPF inválido"),
    email: z.string().email("E-mail inválido"),
    whatsapp: z.string().min(1, "Campo obrigatório"),
    senha: z.string().optional(),
    confirmarSenha: z.string().optional(),
    aceitaTermos: z.boolean().refine((value) => value === true, {
      message: "Você precisa aceitar os termos",
    }),
  })
  .superRefine((data, ctx) => {
    // ── Senha (apenas para usuários não autenticados) ─────────────
    if (!data.isAuthenticated) {
      if (!data.senha || data.senha.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Senha deve ter pelo menos 8 caracteres",
          path: ["senha"],
        });
      }
      if (!data.confirmarSenha) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Confirme sua senha",
          path: ["confirmarSenha"],
        });
      }
      if (data.senha && data.confirmarSenha && data.senha !== data.confirmarSenha) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "As senhas não coincidem",
          path: ["confirmarSenha"],
        });
      }
    }

    const req = (field: string, path: string) => {
      if (!field?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Campo obrigatório",
          path: [path],
        });
      }
    };

    // ── Validação condicional por tipo ────────────────────────────
    if (!data.tipo || data.tipo === "nascimento") {
      req(data.nomeCompleto ?? "", "nomeCompleto");
      // CPF: required + valid
      if (!data.cpf?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Campo obrigatório", path: ["cpf"] });
      } else if (!isValidCPF(data.cpf)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CPF inválido", path: ["cpf"] });
      }
      req(data.dataNascimento ?? "", "dataNascimento");
      req(data.nomeMae ?? "", "nomeMae");
    } else if (data.tipo === "obito") {
      req(data.nomeFalecido ?? "", "nomeFalecido");
      req(data.nomeMaeFalecido ?? "", "nomeMaeFalecido");
      req(data.dataObito ?? "", "dataObito");
    } else if (data.tipo === "casamento") {
      req(data.nomeConjuge1 ?? "", "nomeConjuge1");
      req(data.nomeConjuge2 ?? "", "nomeConjuge2");
      req(data.dataCasamento ?? "", "dataCasamento");
    }
  });

export const checkoutSchema = z.object({
  email: z.string().email("E-mail inválido"),
  nome: z.string().min(1, "Campo obrigatório"),
  cpf: z.string().min(1, "Campo obrigatório"),
});
