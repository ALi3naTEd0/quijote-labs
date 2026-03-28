import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      </body>
    </html>
  );
}
