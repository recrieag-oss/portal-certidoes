"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Package,
  ShieldCheck,
  ClipboardList,
  Wallet,
  MapPin,
  Download,
} from "lucide-react";

/* ── Activity pool ─────────────────────────────────────────── */
const ACTIVITY_POOL = [
  { initials: "MA", color: "#EF4444", name: "Marcos A.",    type: "Nascimento", state: "AM" },
  { initials: "BC", color: "#8B5CF6", name: "Beatriz C.",   type: "Casamento",  state: "CE" },
  { initials: "RS", color: "#14B8A6", name: "Rafael S.",    type: "Óbito",      state: "SP" },
  { initials: "JO", color: "#F59E0B", name: "Joana O.",     type: "Nascimento", state: "MG" },
  { initials: "LF", color: "#3B82F6", name: "Lucas F.",     type: "Casamento",  state: "RJ" },
  { initials: "AM", color: "#EC4899", name: "Ana M.",       type: "Nascimento", state: "BA" },
  { initials: "PL", color: "#10B981", name: "Paulo L.",     type: "Óbito",      state: "RS" },
  { initials: "CT", color: "#6366F1", name: "Carla T.",     type: "Casamento",  state: "PR" },
  { initials: "DE", color: "#F97316", name: "Diego E.",     type: "Nascimento", state: "PA" },
  { initials: "MR", color: "#0EA5E9", name: "Marina R.",    type: "Óbito",      state: "GO" },
  { initials: "TS", color: "#A855F7", name: "Thiago S.",    type: "Casamento",  state: "SC" },
  { initials: "FN", color: "#EF4444", name: "Fernanda N.",  type: "Nascimento", state: "PE" },
  { initials: "GB", color: "#22C55E", name: "Gustavo B.",   type: "Óbito",      state: "MA" },
  { initials: "RL", color: "#F59E0B", name: "Renata L.",    type: "Casamento",  state: "ES" },
  { initials: "VX", color: "#14B8A6", name: "Vitor X.",     type: "Nascimento", state: "MT" },
  { initials: "IS", color: "#8B5CF6", name: "Isabela S.",   type: "Casamento",  state: "PB" },
  { initials: "HM", color: "#3B82F6", name: "Henrique M.",  type: "Óbito",      state: "RN" },
  { initials: "KP", color: "#EC4899", name: "Kamila P.",    type: "Nascimento", state: "AL" },
  { initials: "NF", color: "#10B981", name: "Nicolas F.",   type: "Casamento",  state: "TO" },
  { initials: "EP", color: "#6366F1", name: "Elaine P.",    type: "Óbito",      state: "RO" },
];

const BADGE_POSITIONS = [
  { top: "22%", left: "64%" },
  { top: "48%", left: "52%" },
  { top: "36%", left: "30%" },
];

const BADGE_OFFSETS = [0, 7, 14];
const CYCLE_MS = 4500;

function ActivityBadges() {
  const [indices, setIndices] = useState(BADGE_OFFSETS);
  const [visible, setVisible] = useState([true, true, true]);

  useEffect(() => {
    const timers = BADGE_POSITIONS.map((_, slot) =>
      setInterval(() => {
        setVisible((v) => { const n = [...v]; n[slot] = false; return n; });
        setTimeout(() => {
          setIndices((prev) => {
            const next = [...prev];
            next[slot] = (next[slot] + 1) % ACTIVITY_POOL.length;
            return next;
          });
          setVisible((v) => { const n = [...v]; n[slot] = true; return n; });
        }, 450);
      }, CYCLE_MS + slot * 900)
    );
    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <>
      {BADGE_POSITIONS.map((pos, slot) => {
        const entry = ACTIVITY_POOL[indices[slot]];
        return (
          <div
            key={slot}
            className="absolute z-10 flex flex-col items-center"
            style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              animate={{ scale: [1, 1.65, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: slot * 0.9 }}
              className="absolute rounded-full pointer-events-none"
              style={{ width: 44, height: 44, background: entry.color }}
            />
            <AnimatePresence mode="wait">
              {visible[slot] && (
                <motion.div
                  key={entry.initials + slot}
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.75, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.34, 1.26, 0.64, 1] }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white ring-2 ring-white"
                  style={{ background: entry.color, boxShadow: `0 2px 12px ${entry.color}55` }}
                >
                  {entry.initials}
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {visible[slot] && (
                <motion.div
                  key={entry.name + slot}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
                  className="mt-1.5 rounded-xl bg-white px-2.5 py-1 text-center"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.10)", maxWidth: 108, minWidth: 72 }}
                >
                  <p className="text-[10px] font-bold text-slate-800 leading-tight truncate">{entry.name}</p>
                  <p className="text-[9px] text-slate-400 leading-tight">{entry.type} · {entry.state}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}

const faqs = [
  { question: "Quanto tempo demora?", answer: "A entrega depende do cartório e do formato escolhido, mas normalmente entre 5 e 15 dias úteis." },
  { question: "Quais documentos preciso?", answer: "CPF, dados do registrado e informações do cartório se já souber o nome." },
  { question: "Posso acompanhar o pedido?", answer: "Sim, use o código fornecido na página de sucesso para acompanhar em tempo real." },
  { question: "O serviço é válido no Brasil todo?", answer: "Sim, atuamos com cartórios de todos os estados brasileiros." },
  { question: "Como recebo a certidão digital?", answer: "Enviamos por e-mail e WhatsApp assim que o documento estiver pronto." },
  { question: "O pagamento é seguro?", answer: "Sim, todas as transações passam pelo Mercado Pago com SSL e proteção de dados." },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">

          {/* Left — copy */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#009B3A]/25 bg-[#009B3A]/8 px-4 py-2 text-sm font-semibold text-[#009B3A]">
              <ShieldCheck className="h-4 w-4" /> Ambiente seguro e confiável
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:mt-8 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Precisando de 2ª via de Certidão?
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Peça sua certidão de forma simples e receba seu documento sem sair de casa.
              Conectamos você a qualquer cartório do Brasil.
            </p>
            <div className="mt-10">
              <Link
                href="/solicitar"
                className="inline-flex items-center justify-center rounded-[28px] bg-[#009B3A] px-8 py-4 text-base font-bold text-white shadow-green-glow transition hover:bg-[#007A2F] hover:shadow-lg"
              >
                Pedir Certidão Agora
              </Link>
            </div>
          </motion.div>

          {/* Right — mapa + stats */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-full overflow-hidden rounded-[32px] bg-white p-4 sm:p-6"
              style={{
                border: "1px solid #DFE5EE",
                boxShadow: "0 8px 40px rgba(0,39,118,0.08)",
              }}
            >
              <div className="relative w-full max-w-sm mx-auto">
                <Image
                  src="/MAPA BRASIL.svg"
                  alt="Mapa do Brasil"
                  width={500}
                  height={520}
                  className="w-full h-auto"
                />
                <svg viewBox="0 0 500 520" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                  {[
                    { cx: 148, cy: 195, delay: 0 },
                    { cx: 326, cy: 108, delay: 0.5 },
                    { cx: 355, cy: 162, delay: 1.0 },
                    { cx: 312, cy: 232, delay: 0.3 },
                    { cx: 256, cy: 268, delay: 0.8 },
                    { cx: 246, cy: 342, delay: 1.3 },
                    { cx: 226, cy: 418, delay: 0.6 },
                  ].map((dot, i) => (
                    <g key={i}>
                      <circle cx={dot.cx} cy={dot.cy} r="5" fill="#009B3A" opacity="0.9" />
                      <circle cx={dot.cx} cy={dot.cy} r="5" fill="none" stroke="#009B3A" strokeWidth="1.5">
                        <animate attributeName="r" values="5;18;5" dur="2.4s" begin={`${dot.delay}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" begin={`${dot.delay}s`} repeatCount="indefinite" />
                      </circle>
                    </g>
                  ))}
                </svg>
                <ActivityBadges />
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: FileText, value: "15.000+", label: "Cartórios no Brasil" },
                  { icon: Search,   value: "27",      label: "Estados Cobertos" },
                  { icon: Package,  value: "5.570+",  label: "Municípios Alcançados" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex flex-col items-center rounded-[16px] bg-[#F5F7FA] py-3 px-2">
                      <Icon className="mb-1 h-4 w-4 text-[#009B3A]" />
                      <p className="text-lg font-black text-slate-900">{stat.value}</p>
                      <p className="mt-0.5 text-center text-[9px] leading-tight text-slate-500">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────────────────── */}
      <section id="como-funciona" className="bg-[#F5F7FA] px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#009B3A]">Processo simples</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Como funciona</h2>
            </div>
            <p className="text-sm text-slate-500 sm:text-right">Do pedido à entrega,<br className="hidden sm:block" /> tudo em poucos passos.</p>
          </div>

          <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
            {/* Connecting line */}
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[2.2rem] hidden h-px bg-slate-200 md:block" />

            {[
              { label: "Preencha o formulário",   icon: ClipboardList, color: "#002776", glow: "rgba(0,39,118,0.20)"  },
              { label: "Realize o pagamento",      icon: Wallet,        color: "#FEDF00", glow: "rgba(254,223,0,0.30)" },
              { label: "Localizamos no cartório",  icon: MapPin,        color: "#009B3A", glow: "rgba(0,155,58,0.25)" },
              { label: "Receba sua certidão",      icon: Download,      color: "#002776", glow: "rgba(0,39,118,0.20)" },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center gap-4 text-center">
                  <div
                    className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-white"
                    style={{
                      border: `2px solid ${step.color}`,
                      boxShadow: `0 4px 20px ${step.glow}`,
                    }}
                  >
                    <span
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                      style={{ background: step.color }}
                    >
                      {index + 1}
                    </span>
                    <Icon className="h-6 w-6" style={{ color: step.color }} />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-slate-700">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONFIANÇA ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid gap-4 md:grid-cols-5">

          {/* Left — institutional blue panel */}
          <div className="md:col-span-2 rounded-[32px] bg-[#002776] p-8 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FEDF00] animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-100">Selos de Confiança</p>
              </div>
              <h2 className="mt-6 text-3xl font-bold leading-tight text-white">
                Segurança, validade jurídica e proteção de dados
              </h2>
              <p className="mt-4 text-sm leading-6 text-blue-200/80">
                Atendemos todo o Brasil com suporte especializado e transações seguras.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <Image
                src="/CERTIFICADO.svg"
                alt="Certificado de qualidade"
                width={80}
                height={80}
                className="drop-shadow-[0_0_12px_rgba(254,223,0,0.3)]"
              />
              <div>
                <p className="text-xs font-semibold text-white">Empresa Certificada</p>
                <p className="mt-0.5 text-[11px] text-blue-200/70">Conformidade legal e segurança garantidas</p>
              </div>
            </div>
          </div>

          {/* Right — trust items */}
          <div className="space-y-3 md:col-span-3">
            {[
              { label: "Documentos oficiais com validade jurídica", desc: "Certidões extraídas diretamente dos cartórios competentes." },
              { label: "Entrega para todo o Brasil",                desc: "Cobertura nacional em todos os estados e municípios." },
              { label: "Dados protegidos (LGPD)",                   desc: "Seus dados são tratados em conformidade com a Lei Geral de Proteção de Dados." },
              { label: "Suporte especializado",                     desc: "Equipe dedicada para acompanhar cada etapa do processo." },
              { label: "Pagamento seguro (SSL)",                    desc: "Transações criptografadas com certificado SSL de ponta a ponta." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white px-6 py-5 transition hover:border-[#009B3A]/30 hover:shadow-sm">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#009B3A]/10">
                  <svg className="h-4 w-4 text-[#009B3A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="rounded-[32px] bg-[#009B3A] px-8 py-12 text-white shadow-green-glow">
          <div className="grid gap-6 md:grid-cols-[1.5fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-100/80">Comece agora</p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Solicite sua certidão com tranquilidade</h2>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <Link
                href="/solicitar"
                className="inline-flex items-center justify-center rounded-[28px] bg-white px-6 py-4 text-sm font-bold text-[#009B3A] transition hover:bg-green-50"
              >
                Solicitar certidão agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#009B3A]">FAQ</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Perguntas frequentes</h2>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-[20px] border border-slate-200 p-6 transition hover:border-[#009B3A]/30 hover:shadow-sm">
                <summary className="cursor-pointer text-base font-semibold text-slate-900">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
