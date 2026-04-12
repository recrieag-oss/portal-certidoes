import Link from "next/link";
import { Zap, Shield, Globe, Smile } from "lucide-react";

const commitments = [
  {
    icon: Zap,
    title: "Agilidade",
    description: "Processos otimizados para entrega mais rápida.",
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Seus dados protegidos em todas as etapas.",
  },
  {
    icon: Globe,
    title: "Cobertura nacional",
    description: "Atendimento em cartórios de todo o Brasil.",
  },
  {
    icon: Smile,
    title: "Facilidade",
    description: "Tudo 100% online, sem complicação.",
  },
];

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-20 sm:px-8">
      <div className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">Quem somos</p>
        <h1 className="mt-4 text-5xl font-black text-white">Sobre Nós</h1>
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] bg-white p-10">
          <p className="text-lg leading-8 text-slate-700">
            No <strong>Portal Certidões</strong>, nossa missão é simplificar o acesso a documentos essenciais,
            conectando você diretamente aos cartórios de todo o Brasil com rapidez, segurança e praticidade.
          </p>
          <p className="mt-6 leading-8 text-slate-600">
            Somos uma empresa especializada na intermediação de serviços cartoriais, oferecendo soluções
            digitais para a emissão de certidões de nascimento, casamento e óbito, eliminando burocracias
            e reduzindo o tempo de espera.
          </p>
          <p className="mt-6 leading-8 text-slate-600">
            Através da nossa plataforma, você solicita seus documentos sem sair de casa. Nós cuidamos de
            todo o processo: desde a localização do cartório até a solicitação e acompanhamento da emissão,
            garantindo mais agilidade e comodidade para você.
          </p>
          <p className="mt-6 leading-8 text-slate-600">
            Trabalhamos com tecnologia e eficiência para transformar um processo tradicionalmente lento
            em uma experiência simples, rápida e confiável.
          </p>
        </div>

        <div className="rounded-[32px] bg-white p-10">
          <h2 className="text-2xl font-semibold text-slate-950">Nosso compromisso</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {commitments.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 rounded-[24px] bg-slate-50 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Mais do que intermediar documentos,{" "}
            <span className="text-[#002776]">facilitamos o seu acesso aos seus direitos.</span>
          </p>
          <Link
            href="/certidao/nascimento"
            className="mt-8 inline-flex items-center justify-center rounded-[28px] bg-[#002776] px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Solicitar minha certidão
          </Link>
        </div>
      </div>
    </main>
  );
}
