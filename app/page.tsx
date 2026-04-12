"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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

/* ── Activity pool — 20+ entries cycling continuously ──────── */
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

/*
 * Positions calibradas ao contorno do Brasil no SVG (viewBox 500×520).
 * Mantidas longe das bordas para não cortar em mobile.
 *   - Nordeste:     ~x320, y115  →  left 64%, top 22%
 *   - Sudeste:      ~x260, y250  →  left 52%, top 48%
 *   - Centro-Oeste: ~x150, y185  →  left 30%, top 36%
 */
const BADGE_POSITIONS = [
  { top: "22%", left: "64%" },
  { top: "48%", left: "52%" },
  { top: "36%", left: "30%" },
];

const BADGE_OFFSETS = [0, 7, 14];
const CYCLE_MS = 4500;

function ActivityBadges() {
  const [indices, setIndices]   = useState(BADGE_OFFSETS);
  const [visible, setVisible]   = useState([true, true, true]);

  useEffect(() => {
    const timers = BADGE_POSITIONS.map((_, slot) =>
      setInterval(() => {
        /* fade out → swap → fade in */
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
            {/* Soft glow ring — gentler scale, longer duration */}
            <motion.div
              animate={{ scale: [1, 1.65, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: slot * 0.9 }}
              className="absolute rounded-full pointer-events-none"
              style={{ width: 44, height: 44, background: entry.color }}
            />

            {/* Avatar circle */}
            <AnimatePresence mode="wait">
              {visible[slot] && (
                <motion.div
                  key={entry.initials + slot}
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1,    opacity: 1 }}
                  exit={{    scale: 0.75, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.34, 1.26, 0.64, 1] }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white ring-2 ring-white/90"
                  style={{ background: entry.color, boxShadow: `0 2px 12px ${entry.color}55` }}
                >
                  {entry.initials}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Label bubble — largura limitada para não sair do mapa */}
            <AnimatePresence mode="wait">
              {visible[slot] && (
                <motion.div
                  key={entry.name + slot}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0, y: -4 }}
                  transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
                  className="mt-1.5 rounded-xl bg-white/95 px-2.5 py-1 shadow-md backdrop-blur-sm text-center"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.09)", maxWidth: 108, minWidth: 72 }}
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
    <svg viewBox="0 0 96 96" width="72" height="72" className="shrink-0 drop-shadow-[0_0_18px_rgba(180,100,255,0.5)]">
      <defs>
        <radialGradient id="ob" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#1e0e3a"/>
          <stop offset="55%" stopColor="#0e0620"/>
          <stop offset="100%" stopColor="#050210"/>
        </radialGradient>
        <radialGradient id="og" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        {/* Flame warm glow */}
        <radialGradient id="flameGlow" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="rgba(255,160,40,0.45)"/>
          <stop offset="100%" stopColor="rgba(255,100,0,0)"/>
        </radialGradient>
        {/* Flame gradient */}
        <radialGradient id="flameBody" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff7c0"/>
          <stop offset="30%" stopColor="#ffb020"/>
          <stop offset="70%" stopColor="#ff6000"/>
          <stop offset="100%" stopColor="#cc2200"/>
        </radialGradient>
        {/* Inner flame */}
        <radialGradient id="flameInner" cx="50%" cy="80%" r="55%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="50%" stopColor="#fff0a0"/>
          <stop offset="100%" stopColor="rgba(255,200,0,0)"/>
        </radialGradient>
        <clipPath id="oc"><circle cx="48" cy="48" r="44"/></clipPath>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#ob)"/>
      <g clipPath="url(#oc)">
        {/* Warm glow from candle */}
        <ellipse cx="48" cy="62" rx="28" ry="22" fill="url(#flameGlow)"/>
        {/* Candle body */}
        <rect x="41" y="52" width="14" height="26" rx="3" fill="rgba(220,210,240,0.82)"/>
        {/* Candle wax drip left */}
        <path d="M41 57 Q38 60 39 64 L41 64Z" fill="rgba(200,190,220,0.6)"/>
        {/* Candle wax drip right */}
        <path d="M55 59 Q58 63 57 67 L55 67Z" fill="rgba(200,190,220,0.6)"/>
        {/* Candle top rim */}
        <ellipse cx="48" cy="52" rx="7" ry="2.5" fill="rgba(180,170,210,0.9)"/>
        {/* Wick */}
        <line x1="48" y1="52" x2="48" y2="44" stroke="#2a1a0a" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Flame outer */}
        <path d="M48 22 C44 30 40 34 41 40 C42 46 44 48 48 48 C52 48 54 46 55 40 C56 34 52 30 48 22Z" fill="url(#flameBody)" opacity="0.95"/>
        {/* Flame inner glow */}
        <path d="M48 28 C46 33 44 36 45 40 C46 44 47 46 48 46 C49 46 50 44 51 40 C52 36 50 33 48 28Z" fill="url(#flameInner)" opacity="0.85"/>
        {/* Candle shine */}
        <rect x="43" y="55" width="2.5" height="14" rx="1.2" fill="rgba(255,255,255,0.22)"/>
      </g>
      {/* Gloss highlight */}
      <ellipse cx="36" cy="26" rx="13" ry="8" fill="url(#og)" opacity="0.65"/>
      <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(200,150,255,0.18)" strokeWidth="1.2"/>
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
            <div className="relative flex items-center justify-center bg-slate-50 p-6 sm:p-8">
              {/* Map + badges container — badges overlay the map on ALL screen sizes */}
              <div className="relative w-full max-w-sm">
                <Image
                  src="/MAPA BRASIL.svg"
                  alt="Mapa do Brasil"
                  width={500}
                  height={520}
                  className="w-full h-auto"
                />
                {/* Ping dots overlay */}
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

                {/* Cycling activity badges — visible on ALL screen sizes, overlaid on map */}
                <ActivityBadges />
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
