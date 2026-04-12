import { CertidaoWizard } from "@/components/forms/CertidaoWizard";

export default function NascimentoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
      <CertidaoWizard tipo="nascimento" />
    </main>
  );
}
