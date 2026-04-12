import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function FalhaPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-8">
      <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-700">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h1 className="mt-8 text-4xl font-semibold text-slate-950">Pagamento recusado</h1>
      <p className="mt-4 text-lg text-slate-600">Não conseguimos processar seu pagamento. Verifique os dados e tente novamente.</p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/checkout" className="rounded-[28px] bg-brand-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-brand-700">
          Tentar novamente
        </Link>
        <Link href="/" className="rounded-[28px] border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
          Voltar à home
        </Link>
      </div>
    </main>
  );
}
