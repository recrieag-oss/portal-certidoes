"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShieldCheck, Phone, UserCircle2, ChevronDown, FileText, Heart, Ribbon, Lock, CreditCard, Check } from "lucide-react";

function TrustBar() {
  const itemCls = "flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-wide text-slate-600";
  const sepCls  = "hidden h-3.5 w-px shrink-0 bg-slate-200 sm:block";
  return (
    <div className="w-full border-b border-slate-100 bg-white">
      {/* Horizontally scrollable on very small screens, centred on larger ones */}
      <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-x-4 overflow-x-auto px-4 py-2 sm:justify-center sm:gap-x-6 md:gap-x-8 md:px-8">
        <span className={itemCls}>
          <Lock className="h-3.5 w-3.5 shrink-0 text-[#009B3A]" strokeWidth={2.5} />
          Site Seguro
        </span>
        <span className={sepCls} aria-hidden="true" />
        <span className={itemCls}>
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#009B3A]" strokeWidth={2.5} />
          Dados Protegidos
        </span>
        <span className={sepCls} aria-hidden="true" />
        {/* PIX + Cartão hidden on narrowest phones, shown from 380 px */}
        <span className={`${itemCls} hidden min-[380px]:flex`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
            <path d="M9.5 4.5L4.5 9.5a3.536 3.536 0 0 0 0 5l5 5a3.536 3.536 0 0 0 5 0l5-5a3.536 3.536 0 0 0 0-5l-5-5a3.536 3.536 0 0 0-5 0Z" stroke="#009B3A" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 8v8M8 12h8" stroke="#009B3A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          PIX
        </span>
        <span className={`${sepCls} hidden min-[380px]:block`} aria-hidden="true" />
        <span className={`${itemCls} hidden min-[380px]:flex`}>
          <CreditCard className="h-3.5 w-3.5 shrink-0 text-[#002776]" strokeWidth={2.5} />
          Cartão
        </span>
        <span className={sepCls} aria-hidden="true" />
        <span className={`${itemCls} hidden sm:flex`}>
          <Check className="h-3.5 w-3.5 shrink-0 text-[#009B3A]" strokeWidth={2.5} />
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

interface HeaderProps {
  user?: { nome: string } | null;
}

export function Header({ user }: HeaderProps = {}) {
  const [open, setOpen]           = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const [mobileSOlicitar, setMobileSolicitar] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

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
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 md:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Portal Certidões"
              width={450}
              height={100}
              priority
              className="h-8 w-auto md:h-10"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-slate-700 transition hover:text-[#009B3A]">
              Home
            </Link>

            {/* Solicitar dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setDropOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-[#009B3A]"
              >
                Solicitar
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
              </button>

              {dropOpen && (
                <div className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <div className="px-3 py-3 space-y-1">
                    {certidoes.map((c) => {
                      const Icon = c.icon;
                      return (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-[#009B3A]/5"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#009B3A]/10">
                            <Icon className="h-4 w-4 text-[#009B3A]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{c.label}</p>
                            <p className="text-xs text-slate-500">{c.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2.5">
                    <p className="text-center text-[11px] text-slate-400">Selecione o tipo de certidão</p>
                  </div>
                </div>
              )}
            </div>

            {navItems.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-[#009B3A]">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#009B3A]/25 bg-[#009B3A]/8 px-4 py-2 text-sm font-medium text-[#009B3A]">
              <ShieldCheck className="h-4 w-4" /> Ambiente Seguro
            </div>
            <a href="tel:0800000000" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-[#009B3A]">
              <Phone className="h-4 w-4 text-[#009B3A]" /> 0800 000 000
            </a>
            {user ? (
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 rounded-full border border-[#009B3A] bg-[#009B3A]/5 px-4 py-2 text-sm font-semibold text-[#009B3A] transition hover:bg-[#009B3A]/10"
              >
                <UserCircle2 className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{user.nome.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/portal/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#002776] px-4 py-2 text-sm font-semibold text-[#002776] transition hover:bg-[#002776]/5"
              >
                <UserCircle2 className="h-4 w-4" /> Minha conta
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="border-t border-slate-100 bg-white px-4 pb-6 md:hidden">
            <div className="pt-4 space-y-1">
              <Link href="/" onClick={() => setOpen(false)}
                className="flex items-center rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                Home
              </Link>

              <button
                onClick={() => setMobileSolicitar((v) => !v)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Solicitar
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileSOlicitar ? "rotate-180" : ""}`} />
              </button>
              {mobileSOlicitar && (
                <div className="mx-2 rounded-2xl bg-slate-50 px-2 py-2 space-y-1">
                  {certidoes.map((c) => {
                    const Icon = c.icon;
                    return (
                      <Link key={c.href} href={c.href} onClick={() => { setOpen(false); setMobileSolicitar(false); }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-[#009B3A]/5 transition">
                        <Icon className="h-4 w-4 text-[#009B3A] shrink-0" />
                        {c.label}
                      </Link>
                    );
                  })}
                </div>
              )}

              {navItems.slice(1).map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="flex items-center rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="my-4 border-t border-slate-100" />

            {user ? (
              <Link
                href="/portal"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#009B3A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#007A2F]"
              >
                <UserCircle2 className="h-4 w-4" /> Meu painel
              </Link>
            ) : (
              <Link
                href="/portal/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#009B3A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#007A2F]"
              >
                <UserCircle2 className="h-4 w-4" /> Minha conta
              </Link>
            )}

            <div className="mt-3 flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-[#009B3A]/20 bg-[#009B3A]/8 px-4 py-3 text-xs font-medium text-[#009B3A]">
                <ShieldCheck className="h-4 w-4 shrink-0" /> Ambiente Seguro
              </div>
              <a href="tel:0800000000"
                className="flex flex-1 items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
                <Phone className="h-4 w-4 shrink-0 text-[#009B3A]" /> 0800 000 000
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
