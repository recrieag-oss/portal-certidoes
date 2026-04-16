import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import {
  LogOut, FileText, ChevronRight,
  Clock, CheckCircle2, AlertCircle, Package,
} from "lucide-react";

const STATUS_STYLE: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  recebido:             { bg: "bg-slate-500/15",   text: "text-slate-300",   dot: "bg-slate-400" },
  em_analise:           { bg: "bg-blue-500/15",    text: "text-blue-300",    dot: "bg-blue-400" },
  aguardando_cartorio:  { bg: "bg-amber-500/15",   text: "text-amber-300",   dot: "bg-amber-400" },
  em_tramitacao:        { bg: "bg-purple-500/15",  text: "text-purple-300",  dot: "bg-purple-400" },
  pronto:               { bg: "bg-emerald-500/15", text: "text-emerald-300", dot: "bg-emerald-400" },
  finalizado:           { bg: "bg-green-500/15",   text: "text-green-300",   dot: "bg-green-400" },
};

const TIPO_LABEL: Record<string, string> = {
  nascimento: "Nascimento",
  casamento:  "Casamento",
  obito:      "Óbito",
};

export default async function AdminPage() {
  const raw     = cookies().get("admin-session-id")?.value;
  const session = raw ? await getSession(raw) : null;
  if (!session || session.role !== "admin") redirect("/admin/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { nome: true, email: true } } },
  });

  const total       = orders.length;
  const pendentes   = orders.filter((o) => o.status === "recebido").length;
  const emAndamento = orders.filter((o) => ["em_analise","aguardando_cartorio","em_tramitacao"].includes(o.status)).length;
  const finalizados = orders.filter((o) => o.status === "finalizado").length;

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Top nav */}
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl font-bold text-white sm:text-2xl">Gestão de Pedidos</h1>
          <p className="mt-1 text-sm text-slate-400">Gerencie, atualize e notifique clientes</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total",        value: total,       icon: FileText,     color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
            { label: "Pendentes",    value: pendentes,   icon: AlertCircle,  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
            { label: "Em andamento", value: emAndamento, icon: Clock,        color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20" },
            { label: "Finalizados",  value: finalizados, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`rounded-[20px] border ${s.border} ${s.bg} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* Orders table */}
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#111827]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-bold text-white">Todos os pedidos</h2>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <Package className="h-12 w-12 text-slate-600" />
              <p className="font-semibold text-slate-400">Nenhum pedido registrado</p>
            </div>
          ) : (
            <>
              {/* ── Mobile card list (< md) ─────────────────────── */}
              <ul className="divide-y divide-white/5 md:hidden">
                {orders.map((order) => {
                  const status = order.status as OrderStatus;
                  const st     = STATUS_STYLE[status];
                  const fd     = order.formData as Record<string, string>;
                  return (
                    <li key={order.id}>
                      <Link
                        href={`/admin/pedido/${order.id}`}
                        className="flex items-center gap-3 px-4 py-4 transition hover:bg-white/5 active:bg-white/10"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-blue-400">{order.id}</span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.bg} ${st.text}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                              {ORDER_STATUS_LABELS[status]}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-slate-300">
                            {fd.nomeSolicitante || "—"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {TIPO_LABEL[order.tipo] ?? order.tipo}
                            {" · "}
                            {fd.cidade}{fd.estado ? ` – ${fd.estado}` : ""}
                            {" · "}
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* ── Desktop table (≥ md) ────────────────────────── */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      {["Pedido","Tipo","Solicitante","Cidade","Data","Status",""].map((h) => (
                        <th key={h} className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => {
                      const status = order.status as OrderStatus;
                      const st     = STATUS_STYLE[status];
                      const fd     = order.formData as Record<string, string>;
                      return (
                        <tr key={order.id} className="group transition hover:bg-white/5">
                          <td className="px-6 py-4 font-bold text-blue-400">{order.id}</td>
                          <td className="px-6 py-4 text-slate-300 capitalize">{TIPO_LABEL[order.tipo] ?? order.tipo}</td>
                          <td className="px-6 py-4 text-slate-300">{fd.nomeSolicitante}</td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {fd.cidade}{fd.estado ? ` – ${fd.estado}` : ""}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${st.bg} ${st.text}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                              {ORDER_STATUS_LABELS[status]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/admin/pedido/${order.id}`}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10">
                              Gerenciar <ChevronRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
