"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShieldCheck, Phone, UserCircle2, ChevronDown, FileText, Heart, Ribbon, Lock, CreditCard, Check } from "lucide-react";

function TrustBar() {
  return (
    <div className="w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 overflow-x-auto px-4 py-2 sm:gap-8 md:px-8">
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-wide text-slate-600">
          <Lock className="h-3.5 w-3.5 shrink-0 text-green-600" strokeWidth={2.5} />
          Site 100% Seguro
        </span>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-wide text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-600" strokeWidth={2.5} />
          Dados Protegidos
        </span>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-wide text-slate-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
            <path d="M9.5 4.5L4.5 9.5a3.536 3.536 0 0 0 0 5l5 5a3.536 3.536 0 0 0 5 0l5-5a3.536 3.536 0 0 0 0-5l-5-5a3.536 3.536 0 0 0-5 0Z" stroke="#00BDAE" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 8v8M8 12h8" stroke="#00BDAE" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          PIX
        </span>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-wide text-slate-600">
          <CreditCard className="h-3.5 w-3.5 shrink-0 text-blue-600" strokeWidth={2.5} />
          Cartão de Crédito
        </span>
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-wide text-slate-600">
          <Check className="h-3.5 w-3.5 shrink-0 text-green-600" strokeWidth={2.5} />
          Boleto Bancário
        </span>
      </div>
    </div>
  );
}

const certidoes = [
  { label: "Certidão de Nascimento", href: "/certidao/nascimento", icon: FileText,  desc: "Registro civil de nascimento" },
  { label: "Certidão de Casamento",  href: "/certidao/casamento",  icon: Heart,     desc: "União civil em qualquer cartório" },
  { label: "Certidão de Óbito",      href: "/certidao/obito",      icon: Ribbon,    desc: "Processo seguro e ágil" },
];

const navItems = [
  { label: "Home",        href: "/" },
  { label: "Acompanhar", href: "/acompanhar" },
  { label: "Suporte",    href: "#suporte" },
];

export function Header() {
  const [open, setOpen]           = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const [mobileSOlicitar, setMobileSolicitar] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <TrustBar />
      <div className="border-b border-white/10 bg-[#002776]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center rounded-2xl bg-[#002776] px-4 py-2.5">
          <Image
            src="/logo.svg"
            alt="Portal Certidões"
            width={450}
            height={100}
            priority
            className="h-8 w-auto md:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-white/80 transition hover:text-white">Home</Link>

          {/* Solicitar dropdown */}
          <div ref={dropRef} className="relative">
            <button
              onClick={() => setDropOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-sm text-white/80 transition hover:text-white"
            >
              Solicitar
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
            </button>

            {dropOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#001850]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="px-3 py-3 space-y-1">
                  {certidoes.map((c) => {
                    const Icon = c.icon;
                    return (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/10"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                          <Icon className="h-4 w-4 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{c.label}</p>
                          <p className="text-xs text-blue-200/60">{c.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {/* Bottom accent */}
                <div className="border-t border-white/5 px-4 py-2.5">
                  <p className="text-[11px] text-blue-300/50 text-center">Selecione o tipo de certidão</p>
                </div>
              </div>
            )}
          </div>

          {navItems.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-white/80 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            <ShieldCheck className="h-4 w-4" /> Ambiente Seguro
          </div>
          <a href="tel:0800000000" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            <Phone className="h-4 w-4 text-blue-200" /> 0800 000 000
          </a>
          <Link
            href="/portal/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <UserCircle2 className="h-4 w-4" /> Minha conta
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#002776] px-4 pb-6 md:hidden">
          {/* Nav links */}
          <div className="pt-4 space-y-1">
            <Link href="/" onClick={() => setOpen(false)}
              className="flex items-center rounded-2xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition">
              Home
            </Link>

            {/* Solicitar accordion */}
            <button
              onClick={() => setMobileSolicitar((v) => !v)}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              Solicitar
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileSOlicitar ? "rotate-180" : ""}`} />
            </button>
            {mobileSOlicitar && (
              <div className="mx-2 rounded-2xl bg-white/5 px-2 py-2 space-y-1">
                {certidoes.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link key={c.href} href={c.href} onClick={() => { setOpen(false); setMobileSolicitar(false); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white hover:bg-white/10 transition">
                      <Icon className="h-4 w-4 text-blue-300 shrink-0" />
                      {c.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {navItems.slice(1).map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="flex items-center rounded-2xl px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* Minha conta CTA */}
          <Link href="/portal/login" onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-[#002776] transition hover:bg-blue-50">
            <UserCircle2 className="h-4 w-4" /> Minha conta
          </Link>

          {/* Utility row */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs font-medium text-white">
              <ShieldCheck className="h-4 w-4 shrink-0" /> Ambiente Seguro
            </div>
            <a href="tel:0800000000"
              className="flex flex-1 items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/20">
              <Phone className="h-4 w-4 shrink-0 text-blue-200" /> 0800 000 000
            </a>
          </div>
        </div>
      )}
      </div>
    </header>
  );
}
