'use client';

import { useSimulator } from '@/context/SimulatorContext';
import { Header } from '@/components/Header';
import { Introducao } from '@/components/sections/Introducao';
import { Solucao } from '@/components/sections/Solucao';
import { ConfiguracaoHospital } from '@/components/sections/ConfiguracaoHospital';
import { ParametrosPersonalizaveis } from '@/components/sections/ParametrosPersonalizaveis';
import { Simulacao } from '@/components/sections/Simulacao';
import { Referencias } from '@/components/sections/Referencias';

export default function Home() {
  const { currentSection } = useSimulator();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-5">
        {currentSection === 1 && <Introducao />}
        {currentSection === 2 && <Solucao />}
        {currentSection === 3 && <ConfiguracaoHospital />}
        {currentSection === 4 && <ParametrosPersonalizaveis />}
        {currentSection === 5 && <Simulacao />}
        {currentSection === 6 && <Referencias />}
      </main>
    </>
  );
}
