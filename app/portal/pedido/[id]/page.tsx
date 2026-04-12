import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, type OrderStatus, type StatusHistoryEntry } from "@/lib/types";
import {
  ArrowLeft, Download, CheckCircle2, Circle, LogOut,
  FileText, MapPin, User, Calendar, Package, CreditCard,
} from "lucide-react";

const STATUS_STYLE: Record<OrderStatus, { ring: string; bg: string; text: string }> = {
  recebido:             { ring: "border-slate-300",   bg: "bg-slate-100",   text: "text-slate-600" },
  em_analise:           { ring: "border-blue-400",    bg: "bg-blue-50",     text: "text-blue-700" },
  aguardando_cartorio:  { ring: "border-amber-400",   bg: "bg-amber-50",    text: "text-amber-700" },
  em_tramitacao:        { ring: "border-purple-400",  bg: "bg-purple-50",   text: "text-purple-700" },
  pronto:               { ring: "border-emerald-400", bg: "bg-emerald-50",  text: "text-emerald-700" },
  finalizado:           { ring: "border-green-500",   bg: "bg-green-50",    text: "text-green-700" },
};

const ALL_STATUSES: OrderStatus[] = [
  "recebido","em_analise","aguardando_cartorio","em_tramitacao","pronto","finalizado",
];

export default async function PortalPedidoPage({ params }: { params: { id: string } }) {
  const raw     = cookies().get("session-id")?.value;
  const session = raw ? await getSession(raw) : null;
  if (!session || session.role !== "client") redirect("/portal/login");

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order || order.userId !== session.userId) notFound();

  const user       = await prisma.user.findUnique({ where: { id: session.userId } });
  const status     = order.status as OrderStatus;
  const currentIdx = ALL_STATUSES.indexOf(status);
  const st         = STATUS_STYLE[status];
  const fd         = order.formData as Record<string, any>;
  const history    = (order.statusHistory as StatusHistoryEntry[]) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1835] to-[#002776]">
      {/* Nav */}
      <header className="border-b border-white/10 bg-[#002776]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="rounded-xl bg-[#002776] px-3 py-1.5">
            <Image src="/logo.svg" alt="Portal Certidões" width={110} height={30} className="h-7 w-auto" />
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20">
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <Link href="/portal" className="mb-6 inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Meus pedidos
        </Link>

        {/* Payment banner */}
        {status === "recebido" && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[20px] bg-amber-500 px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Pagamento pendente</p>
                <p className="text-sm text-amber-100">Confirme o pagamento para iniciarmos a busca.</p>
              </div>
            </div>
            <button disabled
              className="flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-amber-700 opacity-70">
              <CreditCard className="h-4 w-4" /> Pagar para confirmar
            </button>
          </div>
        )}

        {/* PDF download banner */}
        {status === "finalizado" && order.pdfPath && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-[20px] bg-emerald-500 px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Documento pronto!</p>
                <p className="text-sm text-emerald-100">Seu arquivo está disponível para download.</p>
              </div>
            </div>
            <a href={`/api/orders/${order.id}/download`}
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
              <Download className="h-4 w-4" /> Baixar PDF
            </a>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left */}
          <div className="space-y-5">
            {/* Header card */}
            <div className="rounded-[24px] bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#002776]">Pedido</p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900">{order.id}</h1>
                  <p className="mt-1 text-sm text-slate-400 capitalize">
                    Certidão de {order.tipo} &middot; {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${st.ring} ${st.bg} ${st.text}`}>
                  {ORDER_STATUS_LABELS[status]}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-[24px] bg-white p-6 shadow-xl">
              <h2 className="mb-6 font-bold text-slate-900">Andamento do pedido</h2>
              <ol className="relative space-y-0">
                {ALL_STATUSES.map((s, i) => {
                  const done   = i <= currentIdx;
                  const isCurr = i === currentIdx;
                  const hist   = history.filter((h) => h.status === s).at(-1);
                  const isLast = i === ALL_STATUSES.length - 1;
                  return (
                    <li key={s} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          done
                            ? isCurr
                              ? "border-[#002776] bg-[#002776]"
                              : "border-emerald-500 bg-emerald-500"
                            : "border-slate-200 bg-white"
                        }`}>
                          {done
                            ? <CheckCircle2 className="h-4 w-4 text-white" />
                            : <Circle className="h-3.5 w-3.5 text-slate-300" />}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 my-1 ${done && !isCurr ? "bg-emerald-400" : "bg-slate-200"}`} style={{ minHeight: 24 }} />
                        )}
                      </div>
                      <div className="pb-5">
                        <p className={`text-sm font-semibold ${done ? "text-slate-900" : "text-slate-400"}`}>
                          {ORDER_STATUS_LABELS[s]}
                          {isCurr && (
                            <span className="ml-2 inline-block rounded-full bg-[#002776] px-2 py-0.5 text-[10px] font-bold text-white">
                              Atual
                            </span>
                          )}
                        </p>
                        {hist && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {new Date(hist.date).toLocaleString("pt-BR")}
                            {hist.note && <span className="ml-1 italic">· {hist.note}</span>}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5 h-fit">
            <div className="rounded-[24px] bg-white p-6 shadow-xl">
              <h2 className="mb-5 font-bold text-slate-900">Detalhes do pedido</h2>
              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-[#002776]" />
                  <div>
                    <dt className="text-xs text-slate-400">Nome do registrado</dt>
                    <dd className="text-sm font-semibold text-slate-900">{fd.nomeCompleto}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#002776]" />
                  <div>
                    <dt className="text-xs text-slate-400">Cartório / Cidade</dt>
                    <dd className="text-sm font-semibold text-slate-900">
                      {fd.cartorio || "A localizar"}<br />
                      <span className="font-normal text-slate-500">{fd.cidade} – {fd.estado}</span>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-[#002776]" />
                  <div>
                    <dt className="text-xs text-slate-400">Formato</dt>
                    <dd className="text-sm font-semibold text-slate-900">
                      {fd.formato === "fisica" ? "Físico (Correios)" : "Digital (Download)"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#002776]" />
                  <div>
                    <dt className="text-xs text-slate-400">Data do pedido</dt>
                    <dd className="text-sm font-semibold text-slate-900">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {user && (
              <div className="rounded-[24px] bg-white p-6 shadow-xl">
                <h2 className="mb-4 font-bold text-slate-900">Solicitante</h2>
                <p className="text-sm font-semibold text-slate-900">{user.nome}</p>
                <p className="mt-0.5 text-xs text-slate-400">{user.email}</p>
                {user.whatsapp && (
                  <p className="mt-0.5 text-xs text-slate-400">{user.whatsapp}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
