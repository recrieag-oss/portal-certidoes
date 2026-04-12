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

export const certidaoFormSchema = z.object({
  estado: z.string().min(1, "Campo obrigatório"),
  cidade: z.string().min(1, "Campo obrigatório"),
  cartorio: z.string().optional(),
  naoSeiCartorio: z.boolean(),
  nomeCompleto: z.string().min(1, "Campo obrigatório"),
  cpf: z
    .string()
    .min(1, "Campo obrigatório")
    .refine(isValidCPF, "CPF inválido"),
  dataNascimento: z.string().min(1, "Campo obrigatório"),
  nomeMae: z.string().min(1, "Campo obrigatório"),
  nomePai: z.string().optional(),
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
  nomeSolicitante: z.string().min(1, "Campo obrigatório"),
  cpfSolicitante: z
    .string()
    .min(1, "Campo obrigatório")
    .refine(isValidCPF, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(1, "Campo obrigatório"),
  senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme sua senha"),
  aceitaTermos: z.boolean().refine((value) => value === true, {
    message: "Você precisa aceitar os termos",
  }),
}).superRefine((data, ctx) => {
  if (data.senha && data.confirmarSenha && data.senha !== data.confirmarSenha) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    });
  }
});

export const checkoutSchema = z.object({
  email: z.string().email("E-mail inválido"),
  nome: z.string().min(1, "Campo obrigatório"),
  cpf: z.string().min(1, "Campo obrigatório"),
});
