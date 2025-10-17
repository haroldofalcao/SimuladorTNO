"use client";

import { useSearchParams } from "next/navigation";
import DisclaimerPopup from "@/components/DisclaimerPopup";
import { Header } from "@/components/Header";
import { ConfiguracaoHospital } from "@/components/sections/ConfiguracaoHospital";
import { Introducao } from "@/components/sections/Introducao";
import { ParametrosPersonalizaveis } from "@/components/sections/ParametrosPersonalizaveis";
import { Referencias } from "@/components/sections/Referencias";
import { Simulacao } from "@/components/sections/Simulacao";
import { Solucao } from "@/components/sections/Solucao";
import TermosDeUso from "@/components/sections/TermosDeUso";
import { useSimulator } from "@/context/SimulatorContext";

export default function Home() {
  const { currentSection } = useSimulator();
  const searchParams = useSearchParams();
  const showDisclaimer = searchParams.get("disclaimer") === "true";

  return (
    <>
      {showDisclaimer && <DisclaimerPopup />}
      <Header />
      <main className="max-w-7xl mx-auto px-5">
        {currentSection === 1 && <Introducao />}
        {currentSection === 2 && <Solucao />}
        {currentSection === 3 && <ConfiguracaoHospital />}
        {currentSection === 4 && <ParametrosPersonalizaveis />}
        {currentSection === 5 && <Simulacao />}
        {currentSection === 6 && <Referencias />}
        {currentSection === 7 && <TermosDeUso />}
      </main>
    </>
  );
}
