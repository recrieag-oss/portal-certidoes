"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ── Card data ────────────────────────────────────────────── */
const options = [
  {
    iconSrc: "/icons/cert-nascimento.svg",
    iconAlt: "Certidão de Nascimento",
    title: "Certidão de Nascimento",
    description: "2ª via de registro civil de nascimento em qualquer cartório do Brasil.",
    detail: "Necessária para documentos como CPF, passaporte, título eleitoral e muito mais.",
    href: "/certidao/nascimento",
    accentColor: "#009B3A",
    accentLight: "rgba(0,155,58,0.08)",
    accentBorder: "rgba(0,155,58,0.22)",
    tag: "Mais solicitada",
  },
  {
    iconSrc: "/icons/cert-casamento.svg",
    iconAlt: "Certidão de Casamento",
    title: "Certidão de Casamento",
    description: "2ª via de certidão de casamento para qualquer finalidade legal.",
    detail: "Indispensável para inventários, divórcios, vistos e comprovação de estado civil.",
    href: "/certidao/casamento",
    accentColor: "#C9950C",
    accentLight: "rgba(201,149,12,0.08)",
    accentBorder: "rgba(201,149,12,0.22)",
    tag: null,
  },
  {
    iconSrc: "/icons/cert-obito.svg",
    iconAlt: "Certidão de Óbito",
    title: "Certidão de Óbito",
    description: "2ª via de certidão de óbito com processo seguro e ágil.",
    detail: "Essencial para inventários, pensões, seguros e regularização de bens.",
    href: "/certidao/obito",
    accentColor: "#7C3AED",
    accentLight: "rgba(124,58,237,0.08)",
    accentBorder: "rgba(124,58,237,0.22)",
    tag: null,
  },
];

export default function SolicitarPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-8 sm:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-8 max-w-2xl text-center sm:mb-12"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#009B3A]">
          Solicitar certidão
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Qual certidão você precisa?
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:mt-4 sm:text-base sm:leading-7">
          Selecione o tipo de documento e preencha o formulário em minutos.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="mx-auto grid max-w-5xl gap-4 sm:gap-5 sm:grid-cols-3">
        {options.map(({ iconSrc, iconAlt, title, description, detail, href, accentColor, accentLight, accentBorder, tag }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
          >
            <Link
              href={href}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border bg-white p-5 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                borderColor: accentBorder,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-[1.5rem] sm:rounded-t-[2rem]"
                style={{ background: accentColor }}
              />

              {/* Icon — smaller on mobile */}
              <div className="mb-4 flex h-28 w-full items-center justify-center sm:mb-6 sm:h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconSrc}
                  alt={iconAlt}
                  className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <h2 className="text-base font-black leading-snug text-slate-900 sm:text-lg">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 sm:mt-2">{description}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:mt-3">{detail}</p>

              {/* CTA */}
              <div
                className="mt-4 flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-3 sm:mt-6"
                style={{ color: accentColor }}
              >
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
        <Link href="/" className="text-sm text-slate-400 transition hover:text-slate-600">
          ← Voltar ao início
        </Link>
      </motion.div>
    </main>
  );
}
