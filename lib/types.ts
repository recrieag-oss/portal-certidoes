export type CertidaoType = "nascimento" | "casamento" | "obito";

export type FormatOption = "fisica" | "digital";

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
};

export type LocalizacaoStep = {
  estado: string;
  cidade: string;
  cartorio?: string;
  naoSeiCartorio: boolean;
};

export type DadosRegistradoStep = {
  // Internal — set programmatically by wizard, drives conditional validation
  tipo?: CertidaoType;

  // ── Nascimento ─────────────────────────────────────────────────
  nomeCompleto?: string;
  cpf?: string;
  dataNascimento?: string;
  nomeMae?: string;
  nomePai?: string;

  // ── Óbito ──────────────────────────────────────────────────────
  nomeFalecido?: string;
  nomeMaeFalecido?: string;
  nomePaiFalecido?: string;
  dataObito?: string;

  // ── Casamento ──────────────────────────────────────────────────
  nomeConjuge1?: string;
  nomeConjuge2?: string;
  dataCasamento?: string;

  // ── Comum a todos ──────────────────────────────────────────────
  livro?: string;
  pagina?: string;
  termo?: string;
  formato: FormatOption;
};

export type ServicosStep = {
  servicos?: string[];
  enderecoEntrega?: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
};

export type ContatoStep = {
  nomeSolicitante: string;
  cpfSolicitante: string;
  email: string;
  whatsapp: string;
  senha: string;
  confirmarSenha: string;
  aceitaTermos: boolean;
};

export type CertidaoFormValues = LocalizacaoStep & DadosRegistradoStep & ServicosStep & ContatoStep;

export type PedidoResumo = {
  id: string;
  tipo: CertidaoType;
  titulo: string;
  estado: string;
  cidade: string;
  cartorio: string;
  formato: FormatOption;
  nomeRegistrado: string;
  servicos: ServiceItem[];
  subtotal: number;
  total: number;
};

export type CheckoutStoragePayload = {
  tipo: CertidaoType;
  data: CertidaoFormValues;
  pedido: Pick<
    PedidoResumo,
    "id" | "tipo" | "nomeRegistrado" | "cartorio" | "estado" | "cidade" | "formato"
  > & {
    servicos: Array<Pick<ServiceItem, "id">>;
  };
};

export type OrderStatus =
  | "recebido"
  | "em_analise"
  | "aguardando_cartorio"
  | "em_tramitacao"
  | "pronto"
  | "finalizado";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  recebido: "Recebido",
  em_analise: "Em análise",
  aguardando_cartorio: "Aguardando cartório",
  em_tramitacao: "Em tramitação",
  pronto: "Pronto para entrega",
  finalizado: "Finalizado",
};

export type StatusHistoryEntry = {
  status: OrderStatus;
  date: string;
  note?: string;
};

export type Order = {
  id: string;
  tipo: CertidaoType;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  pdfPath?: string;
  formData: Omit<CertidaoFormValues, "senha" | "confirmarSenha">;
  pedidoResumo: PedidoResumo;
  userId: string;
  paymentId?: string;
  paymentStatus?: string;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  nome: string;
  name?: string;
  cpf: string;
  whatsapp: string;
  createdAt: string;
  orderIds: string[];
  resetToken?: string;
  resetTokenExpiry?: string;
};

export type Session = {
  id: string;
  userId: string;
  role: "client" | "admin";
  createdAt: string;
  expiresAt: string;
};
