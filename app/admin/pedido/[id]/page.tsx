import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, type OrderStatus, type StatusHistoryEntry } from "@/lib/types";
import {
  ArrowLeft, LogOut, User, Mail, Phone,
  MapPin, Package, FileText, Clock,
} from "lucide-react";
import { StatusUpdateForm } from "./StatusUpdateForm";
import { PdfUploadForm } from "./PdfUploadForm";

const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  recebido:             { bg: "bg-slate-500/15",   text: "text-slate-300",   border: "border-slate-500/30" },
  em_analise:           { bg: "bg-blue-500/15",    text: "text-blue-300",    border: "border-blue-500/30" },
  aguardando_cartorio:  { bg: "bg-amber-500/15",   text: "text-amber-300",   border: "border-amber-500/30" },
  em_tramitacao:        { bg: "bg-purple-500/15",  text: "text-purple-300",  border: "border-purple-500/30" },
  pronto:               { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
  finalizado:           { bg: "bg-green-500/15",   text: "text-green-300",   border: "border-green-500/30" },
};

const ALL_STATUSES: OrderStatus[] = [
  "recebido","em_analise","aguardando_cartorio","em_tramitacao","pronto","finalizado",
];

export default async function AdminPedidoPage({ params }: { params: { id: string } }) {
  const raw     = cookies().get("admin-session-id")?.value;
  const session = raw ? await getSession(raw) : null;
  if (!session || session.role !== "admin") redirect("/admin/login");

  const order = await prisma.order.findUnique({
    where:   { id: params.id },
    include: { user: true },
  });
  if (!order) notFound();

  const user       = order.user;
  const status     = order.status as OrderStatus;
  const st         = STATUS_STYLE[status];
  const currentIdx = ALL_STATUSES.indexOf(status);
  const fd         = order.formData as Record<string, any>;
  const history    = (order.statusHistory as StatusHistoryEntry[]) ?? [];

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Nav */}
      <header className="border-b border-white/10 bg-[#111827]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#002776] px-3 py-1.5">
              <Image src="/logo.svg" alt="Portal Certidões" width={100} height={28} className="h-6 w-auto" />
            </div>
            <div className="hidden sm:block border-l border-white/10 pl-4">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Painel Admin</p>
            </div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10">
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Link href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Todos os pedidos
        </Link>

        {/* Order header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-[24px] border border-white/10 bg-[#111827] px-7 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Pedido</p>
            <h1 className="mt-1 text-2xl font-bold text-white">{order.id}</h1>
            <p className="mt-1 text-sm capitalize text-slate-400">
              Certidão de {order.tipo} &middot; {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-bold ${st.bg} ${st.text} ${st.border}`}>
            {ORDER_STATUS_LABELS[status]}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-5">
            {/* Registered person data */}
            <div className="rounded-[24px] border border-white/10 bg-[#111827] p-6">
              <div className="mb-5 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                <h2 className="font-bold text-white">Dados do registro</h2>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
                {[
                  { label: "Nome do registrado", val: fd.nomeCompleto },
                  { label: "CPF",                val: fd.cpf },
                  { label: "Data de nascimento", val: fd.dataNascimento },
                  { label: "Nome da mãe",        val: fd.nomeMae },
                  { label: "Nome do pai",        val: fd.nomePai || "—" },
                  { label: "Formato",            val: fd.formato === "fisica" ? "Físico" : "Digital" },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-200">{val || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Cartório */}
            <div className="rounded-[24px] border border-white/10 bg-[#111827] p-6">
              <div className="mb-5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <h2 className="font-bold text-white">Localização do registro</h2>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Cartório</dt>
                  <dd className="mt-0.5 font-semibold text-slate-200">{fd.cartorio || "A localizar pela equipe"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Cidade / Estado</dt>
                  <dd className="mt-0.5 font-semibold text-slate-200">{fd.cidade} – {fd.estado}</dd>
                </div>
                {fd.livro && (
                  <div>
                    <dt className="text-xs text-slate-500">Livro / Página / Termo</dt>
                    <dd className="mt-0.5 font-semibold text-slate-200">{fd.livro} / {fd.pagina} / {fd.termo}</dd>
                  </div>
                )}
              </dl>
              {fd.enderecoEntrega && (
                <div className="mt-4 rounded-[14px] border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Endereço de entrega</p>
                  <p className="text-sm text-slate-300">
                    {fd.enderecoEntrega.rua}, {fd.enderecoEntrega.numero}
                    {fd.enderecoEntrega.complemento && ` – ${fd.enderecoEntrega.complemento}`}
                  </p>
                  <p className="text-sm text-slate-400">
                    {fd.enderecoEntrega.bairro} · {fd.enderecoEntrega.cidade} – {fd.enderecoEntrega.estado} · CEP {fd.enderecoEntrega.cep}
                  </p>
                </div>
              )}
            </div>

            {/* Status history */}
            <div className="rounded-[24px] border border-white/10 bg-[#111827] p-6">
              <div className="mb-5 flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <h2 className="font-bold text-white">Histórico de status</h2>
              </div>
              <ol className="space-y-0">
                {ALL_STATUSES.map((s, i) => {
                  const done    = i <= currentIdx;
                  const isCurr  = i === currentIdx;
                  const entries = history.filter((h) => h.status === s);
                  const last    = entries[entries.length - 1];
                  const isLast  = i === ALL_STATUSES.length - 1;
                  return (
                    <li key={s} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                          done
                            ? isCurr
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
                            : "border-white/10 bg-white/5 text-slate-600"
                        }`}>
                          {i + 1}
                        </div>
                        {!isLast && <div className={`w-px flex-1 my-1 ${done && !isCurr ? "bg-emerald-500/30" : "bg-white/5"}`} style={{ minHeight: 20 }} />}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-semibold ${done ? "text-white" : "text-slate-600"}`}>
                          {ORDER_STATUS_LABELS[s]}
                          {isCurr && <span className="ml-2 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-300">Atual</span>}
                        </p>
                        {last && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {new Date(last.date).toLocaleString("pt-BR")}
                            {last.note && <span className="ml-1 text-slate-400 italic">· {last.note}</span>}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Right column – actions */}
          <div className="space-y-5 h-fit">
            {/* Client info */}
            <div className="rounded-[24px] border border-white/10 bg-[#111827] p-6">
              <div className="mb-5 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <h2 className="font-bold text-white">Solicitante</h2>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <div>
                    <dt className="text-xs text-slate-500">Nome</dt>
                    <dd className="font-semibold text-slate-200">{fd.nomeSolicitante}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <div>
                    <dt className="text-xs text-slate-500">E-mail</dt>
                    <dd className="font-semibold text-slate-200 break-all">{fd.email}</dd>
                  </div>
                </div>
                {fd.whatsapp && (
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                    <div>
                      <dt className="text-xs text-slate-500">WhatsApp</dt>
                      <dd className="font-semibold text-slate-200">{fd.whatsapp}</dd>
                    </div>
                  </div>
                )}
                {fd.cpfSolicitante && (
                  <div className="flex items-start gap-2">
                    <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                    <div>
                      <dt className="text-xs text-slate-500">CPF Solicitante</dt>
                      <dd className="font-semibold text-slate-200">{fd.cpfSolicitante}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            {/* Status update with notifications */}
            <StatusUpdateForm
              orderId={order.id}
              currentStatus={status}
              hasEmail={!!fd.email}
              hasWhatsapp={!!fd.whatsapp}
            />

            {/* PDF upload */}
            <PdfUploadForm orderId={order.id} hasPdf={!!order.pdfPath} />
          </div>
        </div>
      </main>
    </div>
  );
}
