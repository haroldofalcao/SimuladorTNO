import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Modern font matching the new design
import "./globals.css";
import { SimulatorProvider } from "@/context/SimulatorContext";
import { Suspense } from "react";
import LoginModal from "@/components/shared/LoginModal";
import { Toaster } from "sonner";

const outfit = Outfit({ subsets: ["latin"] });

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
      <body className={`${outfit.className} min-h-screen text-gray-800 antialiased`}>
        <SimulatorProvider>
          {children}
          <Suspense fallback={null}>
            <LoginModal />
          </Suspense>
          <Toaster position="top-center" richColors />
        </SimulatorProvider>
      </body>
    </html>
  );
}
