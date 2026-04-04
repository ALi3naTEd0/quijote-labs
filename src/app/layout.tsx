import type { Metadata } from "next";
import { Geist_Mono, Barlow, Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const barlow = Barlow({
  weight: ["300", "400", "700"],
  variable: "--font-barlow",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quijote Labs | Tu desorden no es creatividad.",
  description:
    "Arquitectura de procesos e IA para negocios que ya crecieron pero siguen operando como puesto de mercado.",
  keywords: [
    "procesos de negocio",
    "inteligencia artificial",
    "arquitectura operativa",
    "SANCHO",
    "Quijote Labs",
  ],
  openGraph: {
    title: "Quijote Labs",
    description:
      "Tu desorden no es creatividad. Es falta de procesos.",
    type: "website",
    url: "https://quijotelabs.com",
    images: [
      {
        url: "https://quijotelabs.com/opengraph-image",
        type: "image/png",
        width: 1200,
        height: 630,
        alt: "Quijote Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quijote Labs",
    description: "Tu desorden no es creatividad. Es falta de procesos.",
    images: ["https://quijotelabs.com/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${bebasNeue.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
