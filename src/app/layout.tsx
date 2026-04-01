import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
        url: "https://quijotelabs.com/assets/logo.png",
        type: "image/png",
        width: 512,
        height: 512,
        alt: "Quijote Labs logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quijote Labs",
    description: "Tu desorden no es creatividad. Es falta de procesos.",
    images: ["https://quijotelabs.com/assets/logo.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
