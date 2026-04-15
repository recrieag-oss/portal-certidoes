import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { TrustStamp } from "@/components/ui/TrustStamp";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal Certidões | Solicite sua certidão online",
  description: "Portal de solicitação de certidões de nascimento, casamento e óbito com pagamento seguro e entrega em todo o Brasil.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Portal Certidões",
    description: "Solicite sua certidão sem sair de casa com pagamento seguro e suporte especializado.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} h-full`}>
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <SplashScreen />
        <TrustStamp />
        <Header />
        <div className="min-h-[calc(100vh-8rem)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
