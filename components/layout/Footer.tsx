import Link from "next/link";
import { Mail, Smartphone } from "lucide-react";

const links = {
  institucional: [
    { label: "Sobre nós", href: "/" },
    { label: "Como funciona", href: "/#como-funciona" },
    { label: "Política de Privacidade", href: "/" },
  ],
  servicos: [
    { label: "Certidão de Nascimento", href: "/certidao/nascimento" },
    { label: "Certidão de Casamento", href: "/certidao/casamento" },
    { label: "Certidão de Óbito", href: "/certidao/obito" },
  ],
  suporte: [
    { label: "Central de Ajuda", href: "/" },
    { label: "Acompanhar Pedido", href: "/acompanhar" },
    { label: "Fale Conosco", href: "/" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      {/* Brand row — full width on mobile, above the grid */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 md:hidden">
        <p className="text-lg font-semibold text-white">PortalCertidões</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Solicitamos certidões com segurança, rapidez e apoio especializado em todo o Brasil.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-0 grid-cols-2 md:grid-cols-4 md:gap-10 md:px-8 md:py-16">
        {/* Brand col — hidden on mobile (shown above) */}
        <div className="hidden md:block">
          <p className="text-lg font-semibold text-white">PortalCertidões</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Solicitamos certidões com segurança, rapidez e apoio especializado em todo o Brasil.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 sm:mb-4 sm:text-sm">Institucional</p>
          <ul className="space-y-2.5 text-sm sm:space-y-3">
            {links.institucional.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 sm:mb-4 sm:text-sm">Serviços</p>
          <ul className="space-y-2.5 text-sm sm:space-y-3">
            {links.servicos.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 sm:mb-4 sm:text-sm">Contato</p>
          <div className="space-y-2.5 text-sm sm:space-y-3">
            <p className="flex items-center gap-2 text-slate-300">
              <Mail className="h-4 w-4 shrink-0 text-[#009B3A]" />
              <span className="break-all">contato@portalcertidoes.com</span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Smartphone className="h-4 w-4 shrink-0 text-[#009B3A]" /> 0800 000 000
            </p>
            <p className="text-slate-500 text-xs">Segunda a sexta, 09h às 18h</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-900 px-4 py-5 text-xs text-slate-500 sm:py-6 sm:text-sm md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
          <p>© 2026 PortalCertidões. CNPJ 00.000.000/0000-00</p>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-2.5 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-400 sm:px-3 sm:py-2">
              Visa
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-2.5 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-400 sm:px-3 sm:py-2">
              Mastercard
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-2.5 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-400 sm:px-3 sm:py-2">
              Pix
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
