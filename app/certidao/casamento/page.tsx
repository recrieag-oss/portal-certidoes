import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CertidaoWizard } from "@/components/forms/CertidaoWizard";

export default async function CasamentoPage() {
  const raw     = cookies().get("session-id")?.value;
  const session = raw ? await getSession(raw) : null;
  const user    = session?.role === "client"
    ? await prisma.user.findUnique({ where: { id: session.userId } })
    : null;

  const authUser = user
    ? { nome: user.nome, cpf: user.cpf, email: user.email, whatsapp: user.whatsapp }
    : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-14">
      <CertidaoWizard tipo="casamento" user={authUser} />
    </main>
  );
}
