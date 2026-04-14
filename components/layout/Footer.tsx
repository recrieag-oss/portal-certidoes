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
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-8">
        <div>
          <p className="text-lg font-semibold text-white">PortalCertidões</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Solicitamos certidões com segurança, rapidez e apoio especializado em todo o Brasil.
          </p>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Institucional</p>
          <ul className="space-y-3 text-sm">
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
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Serviços</p>
          <ul className="space-y-3 text-sm">
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
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Contato</p>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-slate-300">
              <Mail className="h-4 w-4 text-[#009B3A]" /> contato@portalcertidoes.com
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Smartphone className="h-4 w-4 text-[#009B3A]" /> 0800 000 000
            </p>
            <p className="text-slate-500">Segunda a sexta, 09h às 18h</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-500 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p>© 2026 PortalCertidões. CNPJ 00.000.000/0000-00</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Visa
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Mastercard
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              Pix
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
