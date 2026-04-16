import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import type { StatusHistoryEntry } from "@/lib/types";
import {
  FileText, LogOut, ChevronRight, Clock, CheckCircle2,
  Download, Package, AlertCircle, Plus, CreditCard,
  UserCircle2, Heart, Ribbon,
} from "lucide-react";

const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; dot: string; icon: React.ElementType }> = {
  recebido:             { bg: "bg-slate-100",   text: "text-slate-600",   dot: "bg-slate-400",   icon: Clock        },
  em_analise:           { bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-500",    icon: AlertCircle  },
  aguardando_cartorio:  { bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500",   icon: Clock        },
  em_tramitacao:        { bg: "bg-purple-50",   text: "text-purple-700",  dot: "bg-purple-500",  icon: Package      },
  pronto:               { bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500", icon: CheckCircle2 },
  finalizado:           { bg: "bg-green-50",    text: "text-green-700",   dot: "bg-green-500",   icon: Download     },
};

const TIPO_LABEL: Record<string, string> = {
  nascimento: "Certidão de Nascimento",
  casamento:  "Certidão de Casamento",
  obito:      "Certidão de Óbito",
};

const SOLICITAR_LINKS = [
  { href: "/certidao/nascimento", label: "Nascimento", icon: FileText },
  { href: "/certidao/casamento",  label: "Casamento",  icon: Heart    },
  { href: "/certidao/obito",      label: "Óbito",      icon: Ribbon   },
];

/** Returns the most relevant registered name based on certificate type */
function nomeRegistrado(tipo: string, fd: Record<string, string>): string {
  if (tipo === "obito")    return fd.nomeFalecido   || "";
  if (tipo === "casamento") return fd.nomeConjuge1  || "";
  return fd.nomeCompleto || "";
}

export default async function PortalPage() {
  const raw     = cookies().get("session-id")?.value;
  const session = raw ? await getSession(raw) : null;
  if (!session || session.role !== "client") redirect("/portal/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/portal/login");

  const orders = await prisma.order.findMany({
    where:   { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  const totalPedidos = orders.length;
  const finalizados  = orders.filter((o) => o.status === "finalizado").length;
  const emAndamento  = orders.filter((o) => !["finalizado", "recebido"].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Portal top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#009B3A]/10">
              <UserCircle2 className="h-4 w-4 text-[#009B3A]" />
            </div>
            <div className="leading-none">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Meu painel</p>
              <p className="text-sm font-semibold text-slate-900">{user.nome}</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </form>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-7 sm:px-8 sm:py-10">

        {/* Welcome */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#009B3A]">Bem-vindo de volta</p>
          <h1 className="mt-1.5 text-2xl font-black text-slate-900 sm:text-3xl">{user.nome}</h1>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { label: "Total",        value: totalPedidos, color: "text-slate-900",  border: "border-slate-300" },
            { label: "Em andamento", value: emAndamento,  color: "text-amber-600",  border: "border-amber-400" },
            { label: "Finalizados",  value: finalizados,  color: "text-[#009B3A]",  border: "border-[#009B3A]" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-[16px] sm:rounded-[20px] border-t-[3px] bg-white px-2 py-4 text-center shadow-sm sm:px-4 sm:py-5 ${s.border}`}
            >
              <p className={`text-xl font-black sm:text-3xl ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-[10px] font-medium leading-tight text-slate-500 sm:text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-8 sm:py-5">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">Meus pedidos</h2>

            {/* Solicitar dropdown */}
            <div className="flex items-center gap-2">
              {SOLICITAR_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#009B3A]/40 hover:bg-[#009B3A]/5 hover:text-[#009B3A]"
                >
                  <Icon className="h-3 w-3" /> {label}
                </Link>
              ))}
              <Link
                href="/certidao/nascimento"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#009B3A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#007A2F] sm:px-4"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Novo pedido</span>
                <span className="sm:hidden">Novo</span>
              </Link>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <p className="font-semibold text-slate-700">Nenhum pedido ainda</p>
              <p className="text-sm text-slate-400">Solicite sua primeira certidão agora.</p>
              <Link
                href="/certidao/nascimento"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#009B3A] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#007A2F]"
              >
                <Plus className="h-4 w-4" /> Fazer pedido
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {orders.map((order) => {
                const status = order.status as OrderStatus;
                const st     = STATUS_STYLE[status];
                const Icon   = st.icon;
                const fd     = order.formData as Record<string, string>;
                const nome   = nomeRegistrado(order.tipo, fd);
                return (
                  <li key={order.id}>
                    <Link
                      href={`/portal/pedido/${order.id}`}
                      className="flex min-h-[64px] items-center gap-3 px-4 py-4 transition hover:bg-slate-50 active:bg-slate-100 sm:gap-4 sm:px-8 sm:py-5"
                    >
                      <div className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${st.bg}`}>
                        <Icon className={`h-5 w-5 ${st.text}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-900">{order.id}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                            {ORDER_STATUS_LABELS[status]}
                          </span>
                          {status === "recebido" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                              <CreditCard className="h-3 w-3" /> Aguardando pagamento
                            </span>
                          )}
                          {status === "finalizado" && order.pdfPath && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              <Download className="h-3 w-3" /> PDF disponível
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {TIPO_LABEL[order.tipo] ?? order.tipo}
                          {" · "}
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          {nome && ` · ${nome}`}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
