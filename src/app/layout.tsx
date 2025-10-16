import type { Metadata } from "next";
import "./globals.css";
import { SimulatorProvider } from "@/context/SimulatorContext";

export const metadata: Metadata = {
  title: "Economics - Guia Didático para Profissionais de Saúde",
  description:
    "Simulador de Terapia Nutricional Oral para profissionais de saúde",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <SimulatorProvider>{children}</SimulatorProvider>
      </body>
    </html>
  );
}
