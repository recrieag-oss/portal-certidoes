import Link from "next/link";
import { Mail, Smartphone, ShieldCheck } from "lucide-react";

const links = {
  institucional: [
    { label: "Sobre nós",               href: "/"              },
    { label: "Como funciona",            href: "/#como-funciona"},
    { label: "Política de Privacidade",  href: "/"              },
  ],
  servicos: [
    { label: "Certidão de Nascimento", href: "/certidao/nascimento" },
    { label: "Certidão de Casamento",  href: "/certidao/casamento"  },
    { label: "Certidão de Óbito",      href: "/certidao/obito"      },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 md:py-16">

        {/* Brand + tagline — always full-width on mobile */}
        <div className="mb-8 md:hidden">
          <p className="text-base font-bold text-white">PortalCertidões</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            Solicitamos certidões com segurança, rapidez e apoio especializado em todo o Brasil.
          </p>
        </div>

        {/* Link columns grid:
            mobile  → 2 cols (Institucional | Serviços) + Contato below
            desktop → 4 cols (brand | institucional | serviços | contato)  */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 md:grid-cols-4 md:gap-10">

          {/* Brand col — desktop only */}
          <div className="hidden md:block">
            <p className="text-base font-bold text-white">PortalCertidões</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Solicitamos certidões com segurança, rapidez e apoio especializado em todo o Brasil.
            </p>
          </div>

          {/* Institucional */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-xs">
              Institucional
            </p>
            <ul className="space-y-3">
              {links.institucional.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm leading-snug text-slate-400 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-xs">
              Serviços
            </p>
            <ul className="space-y-3">
              {links.servicos.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm leading-snug text-slate-400 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato — spans full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-xs">
              Contato
            </p>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-[#009B3A]" />
                <span className="break-all">contato@portalcertidoes.com</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <Smartphone className="h-4 w-4 shrink-0 text-[#009B3A]" />
                0800 000 000
              </p>
              <p className="text-xs text-slate-600">Segunda a sexta, 09h às 18h</p>
            </div>

            {/* Trust badge — visible below contact on mobile */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 md:hidden">
              <ShieldCheck className="h-3.5 w-3.5 text-[#009B3A]" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Ambiente Seguro
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 bg-slate-900 px-4 py-4 md:px-8 md:py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-xs text-slate-500 md:flex-row md:justify-between">
          <p>© 2026 PortalCertidões · CNPJ 00.000.000/0000-00</p>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "Pix", "Boleto"].map((m) => (
              <span
                key={m}
                className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-500"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
