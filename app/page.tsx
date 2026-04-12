"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText,
  CreditCard,
  Search,
  Package,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
  Wallet,
  MapPin,
  Download,
} from "lucide-react";

/* ── Glassmorphism orb icons ───────────────────────────── */
function NascimentoOrb() {
  return (
    <svg viewBox="0 0 96 96" width="72" height="72" className="shrink-0 drop-shadow-[0_0_18px_rgba(0,180,100,0.55)]">
      <defs>
        <radialGradient id="nb" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#1a3f7a"/>
          <stop offset="55%" stopColor="#0a1840"/>
          <stop offset="100%" stopColor="#03081a"/>
        </radialGradient>
        <radialGradient id="ng" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <clipPath id="nc"><circle cx="48" cy="48" r="44"/></clipPath>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#nb)"/>
      <g clipPath="url(#nc)">
        <path d="M4 65 Q24 50 48 62 Q72 74 92 60 L92 78 Q72 92 48 80 Q24 68 4 83Z" fill="#009B3A" opacity="0.85"/>
        <path d="M4 73 Q24 58 48 70 Q72 82 92 68 L92 76 Q72 90 48 78 Q24 66 4 81Z" fill="#FEDF00" opacity="0.9"/>
        <ellipse cx="48" cy="34" rx="13" ry="14" fill="rgba(255,255,255,0.92)"/>
        <ellipse cx="48" cy="51" rx="9" ry="5" fill="rgba(255,255,255,0.65)"/>
      </g>
      <ellipse cx="36" cy="26" rx="13" ry="8" fill="url(#ng)" opacity="0.75"/>
      <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
    </svg>
  );
}

function CasamentoOrb() {
  return (
    <svg viewBox="0 0 96 96" width="72" height="72" className="shrink-0 drop-shadow-[0_0_18px_rgba(200,160,0,0.55)]">
      <defs>
        <radialGradient id="cb" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#3a2800"/>
          <stop offset="45%" stopColor="#1a1200"/>
          <stop offset="100%" stopColor="#080600"/>
        </radialGradient>
        <radialGradient id="cg" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stopColor="rgba(255,230,120,0.55)"/>
          <stop offset="100%" stopColor="rgba(255,230,0,0)"/>
        </radialGradient>
        <radialGradient id="gold1" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f5d060"/>
          <stop offset="40%" stopColor="#c9950c"/>
          <stop offset="100%" stopColor="#7a5800"/>
        </radialGradient>
        <radialGradient id="silver1" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#e8e8f0"/>
          <stop offset="40%" stopColor="#8090b0"/>
          <stop offset="100%" stopColor="#2a3050"/>
        </radialGradient>
        <clipPath id="cc"><circle cx="48" cy="48" r="44"/></clipPath>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#cb)"/>
      <g clipPath="url(#cc)">
        <ellipse cx="40" cy="52" rx="18" ry="18" fill="url(#gold1)" opacity="0.0"/>
        <circle cx="40" cy="50" r="17" fill="none" stroke="url(#gold1)" strokeWidth="8" opacity="0.95"/>
        <circle cx="56" cy="50" r="17" fill="none" stroke="url(#silver1)" strokeWidth="8" opacity="0.9"/>
        <circle cx="40" cy="50" r="17" fill="none" stroke="rgba(255,220,80,0.3)" strokeWidth="2"/>
        <circle cx="56" cy="50" r="17" fill="none" stroke="rgba(200,210,240,0.3)" strokeWidth="2"/>
      </g>
      <ellipse cx="36" cy="26" rx="13" ry="8" fill="url(#cg)" opacity="0.65"/>
      <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,210,60,0.2)" strokeWidth="1.2"/>
    </svg>
  );
}

function ObitoOrb() {
  return (
    <svg viewBox="0 0 96 96" width="72" height="72" className="shrink-0 drop-shadow-[0_0_18px_rgba(0,80,200,0.55)]">
      <defs>
        <radialGradient id="ob" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#0d2560"/>
          <stop offset="55%" stopColor="#061228"/>
          <stop offset="100%" stopColor="#020612"/>
        </radialGradient>
        <radialGradient id="og" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <clipPath id="oc"><circle cx="48" cy="48" r="44"/></clipPath>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#ob)"/>
      <g clipPath="url(#oc)">
        {/* Flag shield */}
        <path d="M48 18 L70 28 L70 54 Q70 70 48 78 Q26 70 26 54 L26 28Z" fill="#009B3A"/>
        <path d="M48 24 L65 33 L65 53 Q65 67 48 74 Q31 67 31 53 L31 33Z" fill="#FEDF00"/>
        <ellipse cx="48" cy="50" rx="12" ry="12" fill="#002776"/>
        {/* Stars hint */}
        <circle cx="48" cy="50" r="8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
        <circle cx="48" cy="50" r="2" fill="white" opacity="0.9"/>
        <circle cx="55" cy="47" r="1.2" fill="white" opacity="0.7"/>
        <circle cx="41" cy="47" r="1.2" fill="white" opacity="0.7"/>
        <circle cx="44" cy="55" r="1.2" fill="white" opacity="0.7"/>
        <circle cx="52" cy="55" r="1.2" fill="white" opacity="0.7"/>
      </g>
      <ellipse cx="36" cy="26" rx="13" ry="8" fill="url(#og)" opacity="0.7"/>
      <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2"/>
    </svg>
  );
}

const certificateOrbs = [NascimentoOrb, CasamentoOrb, ObitoOrb];

const certificateTypes = [
  {
    href: "/certidao/nascimento",
    title: "Nascimento",
    description: "Registro civil de nascimento com entrega rápida.",
    icon: FileText,
  },
  {
    href: "/certidao/casamento",
    title: "Casamento",
    description: "Solicite a certidão de casamento em qualquer cartório.",
    icon: CreditCard,
  },
  {
    href: "/certidao/obito",
    title: "Óbito",
    description: "Processo seguro para certidão de óbito.",
    icon: Package,
  },
];

const steps = [
  { label: "Preencha o formulário", icon: FileText },
  { label: "Realize o pagamento", icon: CreditCard },
  { label: "Localizamos no cartório", icon: Search },
  { label: "Receba sua certidão", icon: Package },
];

const faqs = [
  {
    question: "Quanto tempo demora?",
    answer: "A entrega depende do cartório e do formato escolhido, mas normalmente entre 5 e 15 dias úteis.",
  },
  {
    question: "Quais documentos preciso?",
    answer: "CPF, dados do registrado e informações do cartório se já souber o nome.",
  },
  {
    question: "Posso acompanhar o pedido?",
    answer: "Sim, use o código fornecido na página de sucesso para acompanhar em tempo real.",
  },
  {
    question: "O serviço é válido no Brasil todo?",
    answer: "Sim, atuamos com cartórios de todos os estados brasileiros.",
  },
  {
    question: "Como recebo a certidão digital?",
    answer: "Enviamos por e-mail e WhatsApp assim que o documento estiver pronto.",
  },
  {
    question: "O pagamento é seguro?",
    answer: "Sim, todas as transações passam pelo Mercado Pago com SSL e proteção de dados.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4" /> Ambiente seguro e confiável
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight text-white sm:mt-8 sm:text-5xl lg:text-6xl">
              Solicite sua Certidão sem sair de casa
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Certidões de Nascimento, Casamento e Óbito de qualquer cartório do Brasil,
              com entrega rápida e segura.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/sobre" className="inline-flex items-center justify-center rounded-[28px] bg-white px-6 py-4 text-sm font-semibold text-[#002776] transition hover:bg-blue-50">
                Sobre Nós
              </Link>
              <Link href="/acompanhar" className="inline-flex items-center justify-center rounded-[28px] border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/20">
                Acompanhar pedido
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col gap-4">
            {certificateTypes.map((card, i) => {
              const Orb = certificateOrbs[i];
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
                >
                  <Link
                    href={card.href}
                    className="group relative flex items-center gap-6 overflow-hidden rounded-[2rem] px-6 py-5 transition-all duration-500 hover:scale-[1.025]"
                    style={{
                      background: "linear-gradient(105deg, rgba(4,10,36,0.92) 0%, rgba(10,22,65,0.75) 45%, rgba(255,255,255,0.08) 100%)",
                      backdropFilter: "blur(22px)",
                      WebkitBackdropFilter: "blur(22px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px rgba(0,20,80,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
                    }}
                  >
                    {/* Inner gloss top highlight */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[2rem]"
                      style={{ boxShadow: "inset 0 0 60px rgba(0,80,200,0.18)" }} />

                    <Orb />

                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white tracking-tight">{card.title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-blue-200/80">{card.description}</p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/70" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="relative overflow-hidden rounded-[36px] px-8 py-12 sm:px-12"
          style={{
            background: "linear-gradient(135deg, rgba(4,10,36,0.97) 0%, rgba(0,20,80,0.92) 60%, rgba(0,30,90,0.85) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 80px rgba(0,10,60,0.6)",
          }}>
          {/* Background mesh glow */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #002776 0%, transparent 70%)" }} />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #009B3A 0%, transparent 70%)" }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <div className="relative mb-12 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400/80">Processo simples</p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Como funciona</h2>
            </div>
            <p className="text-sm text-blue-200/60 sm:text-right">Do pedido à entrega, <br className="hidden sm:block"/>tudo em poucos passos.</p>
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* Connecting line (desktop) */}
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[2.2rem] hidden h-px md:block"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 15%, rgba(0,100,255,0.35) 50%, rgba(255,255,255,0.12) 85%, transparent)" }} />

            {[
              { label: "Preencha o formulário", icon: ClipboardList, color: "#3b82f6", glow: "rgba(59,130,246,0.5)" },
              { label: "Realize o pagamento",   icon: Wallet,        color: "#FEDF00", glow: "rgba(254,223,0,0.4)"  },
              { label: "Localizamos no cartório", icon: MapPin,      color: "#009B3A", glow: "rgba(0,155,58,0.45)"  },
              { label: "Receba sua certidão",   icon: Download,      color: "#a78bfa", glow: "rgba(167,139,250,0.4)"},
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center gap-4 text-center">
                  {/* Step bubble */}
                  <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full"
                    style={{
                      background: `radial-gradient(circle at 38% 32%, rgba(255,255,255,0.08), rgba(0,10,40,0.9))`,
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow: `0 0 24px ${step.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    }}>
                    {/* Number badge */}
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                      style={{ background: step.color, boxShadow: `0 0 8px ${step.glow}` }}>
                      {index + 1}
                    </span>
                    <Icon className="h-6 w-6" style={{ color: step.color }} />
                    {/* Inner gloss */}
                    <div className="absolute left-1/4 top-[18%] h-1/3 w-2/5 rounded-full opacity-50"
                      style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.45) 0%, transparent 80%)" }} />
                  </div>
                  <p className="text-sm font-medium leading-snug text-blue-100/90">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="grid gap-4 md:grid-cols-5">
          {/* Left panel – certificate badge + title */}
          <div className="md:col-span-2 rounded-[32px] bg-slate-950 p-8 text-white flex flex-col justify-between">
            <div>
              {/* Badge label */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">Selos de Confiança</p>
              </div>

              <h2 className="mt-6 text-3xl font-bold leading-tight">
                Segurança, validade jurídica e proteção de dados
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Atendemos todo o Brasil com suporte especializado e transações seguras.
              </p>
            </div>

            {/* Certificate badge image */}
            <div className="mt-8 flex items-center gap-4">
              <Image
                src="/CERTIFICADO.svg"
                alt="Certificado de qualidade"
                width={80}
                height={80}
                className="drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
              />
              <div>
                <p className="text-xs font-semibold text-white">Empresa Certificada</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Conformidade legal e segurança garantidas</p>
              </div>
            </div>
          </div>

          {/* Right panel – trust items */}
          <div className="space-y-3 md:col-span-3">
            {[
              { label: "Documentos oficiais com validade jurídica", desc: "Certidões extraídas diretamente dos cartórios competentes." },
              { label: "Entrega para todo o Brasil", desc: "Cobertura nacional em todos os estados e municípios." },
              { label: "Dados protegidos (LGPD)", desc: "Seus dados são tratados em conformidade com a Lei Geral de Proteção de Dados." },
              { label: "Suporte especializado", desc: "Equipe dedicada para acompanhar cada etapa do processo." },
              { label: "Pagamento seguro (SSL)", desc: "Transações criptografadas com certificado SSL de ponta a ponta." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white px-6 py-5 transition hover:border-[#002776]/30 hover:shadow-sm">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#002776]/10">
                  <svg className="h-4 w-4 text-[#002776]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="rounded-[32px] bg-white p-8 shadow-soft">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Perguntas frequentes</h2>
            </div>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-[24px] border border-slate-200 p-6 transition hover:border-brand-300">
                <summary className="cursor-pointer text-base font-semibold text-slate-900">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cobertura Nacional ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="overflow-hidden rounded-[40px] bg-white shadow-soft">
          <div className="grid lg:grid-cols-2">
            {/* Map side */}
            <div className="relative flex flex-col items-center justify-center gap-4 bg-slate-50 p-6 sm:p-8">
              <div className="relative w-full max-w-sm">
                <Image
                  src="/MAPA BRASIL.svg"
                  alt="Mapa do Brasil"
                  width={500}
                  height={520}
                  className="w-full h-auto"
                />
                {/* Ping dots overlay – Manaus, Fortaleza, Recife, Salvador, Brasília, São Paulo, Porto Alegre */}
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
                      <circle cx={dot.cx} cy={dot.cy} r="5" fill="#002776" opacity="0.9" />
                      <circle cx={dot.cx} cy={dot.cy} r="5" fill="none" stroke="#002776" strokeWidth="1.5">
                        <animate attributeName="r" values="5;18;5" dur="2.4s" begin={`${dot.delay}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" begin={`${dot.delay}s`} repeatCount="indefinite" />
                      </circle>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Floating activity cards — desktop only (overlaid on map) */}
              {[
                { initials: "MA", color: "#EF4444", name: "Marcos A.", activity: "Certidão de Nasc.", state: "AM", time: "há 5min", top: "10%", left: "52%" },
                { initials: "BC", color: "#8B5CF6", name: "Beatriz C.", activity: "Certidão de Casa.", state: "CE", time: "há 23min", top: "58%", left: "56%" },
                { initials: "RS", color: "#14B8A6", name: "Rafael S.", activity: "Certidão de Óbito", state: "SP", time: "há 1h", top: "32%", left: "6%" },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: [0, -6, 0] }}
                  transition={{ delay: 0.4 + i * 0.3, duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                  className="absolute hidden lg:flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg"
                  style={{ top: card.top, left: card.left }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: card.color }}>
                    {card.initials}
                  </span>
                  <div className="whitespace-nowrap">
                    <p className="text-xs font-semibold text-slate-900">{card.name}</p>
                    <p className="text-[10px] text-slate-500">{card.activity} · {card.state} · {card.time}</p>
                  </div>
                </motion.div>
              ))}

              {/* Activity cards — mobile only (below map, animated row) */}
              <div className="flex lg:hidden flex-col gap-2 mt-4 w-full">
                {[
                  { initials: "MA", color: "#EF4444", name: "Marcos A.", activity: "Certidão de Nasc.", state: "AM", time: "há 5min" },
                  { initials: "BC", color: "#8B5CF6", name: "Beatriz C.", activity: "Certidão de Casa.", state: "CE", time: "há 23min" },
                  { initials: "RS", color: "#14B8A6", name: "Rafael S.", activity: "Certidão de Óbito", state: "SP", time: "há 1h" },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, y: [0, -4, 0] }}
                    transition={{ delay: 0.3 + i * 0.25, duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-md"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: card.color }}>
                      {card.initials}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{card.name}</p>
                      <p className="text-[10px] text-slate-500">{card.activity} · {card.state} · {card.time}</p>
                    </div>
                    <span className="ml-auto flex h-2 w-2 shrink-0 rounded-full bg-green-400 animate-pulse" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Text side */}
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#002776]">Cobertura Nacional</p>
              <h2 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
                Você não precisa se preocupar com distância ou burocracia
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                Nossa empresa conecta você a qualquer cartório do Brasil, atuando em todas as regiões do
                país para localizar, solicitar e agilizar a emissão do seu documento com máxima eficiência.
                Onde estiver o registro, nós chegamos até ele.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { icon: FileText, value: "15.000+", label: "Cartórios no Brasil" },
                  { icon: Search,   value: "27",      label: "Estados Cobertos" },
                  { icon: Package,  value: "5.570+",  label: "Municípios Alcançados" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-[20px] bg-slate-50 p-3 sm:p-4 text-center">
                      <Icon className="mx-auto mb-1.5 h-4 w-4 sm:h-5 sm:w-5 text-[#002776]" />
                      <p className="text-lg font-black text-slate-950 sm:text-2xl">{stat.value}</p>
                      <p className="mt-0.5 text-[10px] leading-tight text-slate-500 sm:text-xs">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/certidao/nascimento"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-[28px] bg-[#002776] px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-900"
              >
                Solicite sua certidão →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="rounded-[32px] bg-brand-600 px-8 py-12 text-white shadow-soft">
          <div className="grid gap-6 md:grid-cols-[1.5fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Comece agora</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Solicite sua certidão com tranquilidade</h2>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <Link href="/certidao/nascimento" className="inline-flex items-center justify-center rounded-[28px] bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Solicitar certidão agora
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
