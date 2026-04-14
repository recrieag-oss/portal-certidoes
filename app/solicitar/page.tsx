"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ── Orbs (inline SVG — same as home) ────────────────────── */
function NascimentoOrb() {
  return (
    <svg viewBox="0 0 96 96" width="88" height="88" className="drop-shadow-[0_0_24px_rgba(0,180,100,0.6)]">
      <defs>
        <radialGradient id="nb2" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#1a3f7a"/>
          <stop offset="55%" stopColor="#0a1840"/>
          <stop offset="100%" stopColor="#03081a"/>
        </radialGradient>
        <radialGradient id="ng2" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <clipPath id="nc2"><circle cx="48" cy="48" r="44"/></clipPath>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#nb2)"/>
      <g clipPath="url(#nc2)">
        <path d="M4 65 Q24 50 48 62 Q72 74 92 60 L92 78 Q72 92 48 80 Q24 68 4 83Z" fill="#009B3A" opacity="0.85"/>
        <path d="M4 73 Q24 58 48 70 Q72 82 92 68 L92 76 Q72 90 48 78 Q24 66 4 81Z" fill="#FEDF00" opacity="0.9"/>
        <ellipse cx="48" cy="34" rx="13" ry="14" fill="rgba(255,255,255,0.92)"/>
        <ellipse cx="48" cy="51" rx="9" ry="5" fill="rgba(255,255,255,0.65)"/>
      </g>
      <ellipse cx="36" cy="26" rx="13" ry="8" fill="url(#ng2)" opacity="0.75"/>
      <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2"/>
    </svg>
  );
}

function CasamentoOrb() {
  return (
    <svg viewBox="0 0 96 96" width="88" height="88" className="drop-shadow-[0_0_24px_rgba(200,160,0,0.6)]">
      <defs>
        <radialGradient id="cb2" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#3a2800"/>
          <stop offset="45%" stopColor="#1a1200"/>
          <stop offset="100%" stopColor="#080600"/>
        </radialGradient>
        <radialGradient id="cg2" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stopColor="rgba(255,230,120,0.55)"/>
          <stop offset="100%" stopColor="rgba(255,230,0,0)"/>
        </radialGradient>
        <radialGradient id="gold2" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f5d060"/>
          <stop offset="40%" stopColor="#c9950c"/>
          <stop offset="100%" stopColor="#7a5800"/>
        </radialGradient>
        <radialGradient id="silver2" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#e8e8f0"/>
          <stop offset="40%" stopColor="#8090b0"/>
          <stop offset="100%" stopColor="#2a3050"/>
        </radialGradient>
        <clipPath id="cc2"><circle cx="48" cy="48" r="44"/></clipPath>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#cb2)"/>
      <g clipPath="url(#cc2)">
        <circle cx="40" cy="50" r="17" fill="none" stroke="url(#gold2)" strokeWidth="8" opacity="0.95"/>
        <circle cx="56" cy="50" r="17" fill="none" stroke="url(#silver2)" strokeWidth="8" opacity="0.9"/>
        <circle cx="40" cy="50" r="17" fill="none" stroke="rgba(255,220,80,0.3)" strokeWidth="2"/>
        <circle cx="56" cy="50" r="17" fill="none" stroke="rgba(200,210,240,0.3)" strokeWidth="2"/>
      </g>
      <ellipse cx="36" cy="26" rx="13" ry="8" fill="url(#cg2)" opacity="0.65"/>
      <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,210,60,0.2)" strokeWidth="1.2"/>
    </svg>
  );
}

function ObitoOrb() {
  return (
    <svg viewBox="0 0 96 96" width="88" height="88" className="drop-shadow-[0_0_24px_rgba(180,100,255,0.55)]">
      <defs>
        <radialGradient id="ob2" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#1e0e3a"/>
          <stop offset="55%" stopColor="#0e0620"/>
          <stop offset="100%" stopColor="#050210"/>
        </radialGradient>
        <radialGradient id="og2" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id="flameGlow2" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="rgba(255,160,40,0.45)"/>
          <stop offset="100%" stopColor="rgba(255,100,0,0)"/>
        </radialGradient>
        <radialGradient id="flameBody2" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff7c0"/>
          <stop offset="30%" stopColor="#ffb020"/>
          <stop offset="70%" stopColor="#ff6000"/>
          <stop offset="100%" stopColor="#cc2200"/>
        </radialGradient>
        <radialGradient id="flameInner2" cx="50%" cy="80%" r="55%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="50%" stopColor="#fff0a0"/>
          <stop offset="100%" stopColor="rgba(255,200,0,0)"/>
        </radialGradient>
        <clipPath id="oc2"><circle cx="48" cy="48" r="44"/></clipPath>
      </defs>
      <circle cx="48" cy="48" r="44" fill="url(#ob2)"/>
      <g clipPath="url(#oc2)">
        <ellipse cx="48" cy="62" rx="28" ry="22" fill="url(#flameGlow2)"/>
        <rect x="41" y="52" width="14" height="26" rx="3" fill="rgba(220,210,240,0.82)"/>
        <path d="M41 57 Q38 60 39 64 L41 64Z" fill="rgba(200,190,220,0.6)"/>
        <path d="M55 59 Q58 63 57 67 L55 67Z" fill="rgba(200,190,220,0.6)"/>
        <ellipse cx="48" cy="52" rx="7" ry="2.5" fill="rgba(180,170,210,0.9)"/>
        <line x1="48" y1="52" x2="48" y2="44" stroke="#2a1a0a" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M48 22 C44 30 40 34 41 40 C42 46 44 48 48 48 C52 48 54 46 55 40 C56 34 52 30 48 22Z" fill="url(#flameBody2)" opacity="0.95"/>
        <path d="M48 28 C46 33 44 36 45 40 C46 44 47 46 48 46 C49 46 50 44 51 40 C52 36 50 33 48 28Z" fill="url(#flameInner2)" opacity="0.85"/>
        <rect x="43" y="55" width="2.5" height="14" rx="1.2" fill="rgba(255,255,255,0.22)"/>
      </g>
      <ellipse cx="36" cy="26" rx="13" ry="8" fill="url(#og2)" opacity="0.65"/>
      <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(200,150,255,0.18)" strokeWidth="1.2"/>
    </svg>
  );
}

/* ── Card data ────────────────────────────────────────────── */
const options = [
  {
    Orb: NascimentoOrb,
    title: "Certidão de Nascimento",
    description: "2ª via de registro civil de nascimento em qualquer cartório do Brasil.",
    detail: "Necessária para documentos como CPF, passaporte, título eleitoral e muito mais.",
    href: "/certidao/nascimento",
    accent: "rgba(0,155,58,0.18)",
    border: "rgba(0,155,58,0.35)",
  },
  {
    Orb: CasamentoOrb,
    title: "Certidão de Casamento",
    description: "2ª via de certidão de casamento para qualquer finalidade legal.",
    detail: "Indispensável para inventários, divórcios, vistos e comprovação de estado civil.",
    href: "/certidao/casamento",
    accent: "rgba(201,149,12,0.18)",
    border: "rgba(201,149,12,0.35)",
  },
  {
    Orb: ObitoOrb,
    title: "Certidão de Óbito",
    description: "2ª via de certidão de óbito com processo seguro e ágil.",
    detail: "Essencial para inventários, pensões, seguros e regularização de bens.",
    href: "/certidao/obito",
    accent: "rgba(160,90,255,0.18)",
    border: "rgba(160,90,255,0.35)",
  },
];

export default function SolicitarPage() {
  return (
    <main
      className="min-h-screen px-4 py-16 sm:px-8"
      style={{
        background: "linear-gradient(160deg, #011130 0%, #002776 45%, #011a4a 100%)",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300/70">
          Solicitar certidão
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Qual certidão você precisa?
        </h1>
        <p className="mt-4 text-base leading-7 text-blue-200/70">
          Selecione o tipo de documento e preencha o formulário em minutos.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
        {options.map(({ Orb, title, description, detail, href, accent, border }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
          >
            <Link
              href={href}
              className="group flex h-full flex-col overflow-hidden rounded-[2rem] p-7 transition-all duration-500 hover:scale-[1.03]"
              style={{
                background: `linear-gradient(140deg, rgba(4,12,40,0.95) 0%, ${accent} 100%)`,
                border: `1px solid ${border}`,
                boxShadow: `0 8px 48px rgba(0,10,60,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
              }}
            >
              {/* Top gloss */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-[2rem]" />

              {/* Orb */}
              <div className="mb-6 flex justify-center">
                <Orb />
              </div>

              {/* Text */}
              <h2 className="text-lg font-black text-white leading-snug">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-blue-200/75">{description}</p>
              <p className="mt-3 text-xs leading-relaxed text-blue-300/50">{detail}</p>

              {/* CTA */}
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white/80 transition-all duration-300 group-hover:text-white group-hover:gap-3">
                Solicitar agora
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-10 text-center"
      >
        <Link
          href="/"
          className="text-sm text-blue-300/60 transition hover:text-blue-200"
        >
          ← Voltar ao início
        </Link>
      </motion.div>
    </main>
  );
}
