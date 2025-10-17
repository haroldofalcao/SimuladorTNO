"use client";

import { useSimulator } from "@/context/SimulatorContext";

export default function TermosDeUso() {
  const { setCurrentSection } = useSimulator();
  const dataAtualizacao = "outubro/2025";
  const versao = "1.0";

  return (
    <section id="termos-de-uso" className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Termos de Uso
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Aviso de Responsabilidade
          </p>
          {/* <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>Versão: {versao}</span>
            <span>•</span>
            <span>Última atualização: {dataAtualizacao}</span>
          </div> */}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          {/* Finalidade e Escopo */}
          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Finalidade e Escopo
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Este aplicativo é uma ferramenta de{" "}
                <strong>simulação nutrieconômica</strong> voltada a{" "}
                <strong>profissionais e estudantes da área da saúde</strong>,
                com{" "}
                <strong>propósito exclusivamente educacional e didático</strong>
                . Seu objetivo é demonstrar conceitos de economia aplicada à
                nutrição clínica por meio de{" "}
                <strong>
                  modelagens teóricas baseadas em referências nacionais e
                  internacionais
                </strong>
                .
              </p>
            </div>
          </article>

          <hr className="border-gray-200" />

          {/* Ausência de Dados Reais */}
          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ausência de Dados Reais e Limitações do Modelo
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                O simulador{" "}
                <strong>não utiliza dados de pacientes reais</strong> nem
                representa as condições operacionais, financeiras ou clínicas de
                qualquer hospital, serviço ou instituição específica.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Os resultados são gerados a partir de{" "}
                <strong>modelos hipotéticos</strong>, podendo divergir
                significativamente de cenários reais.
              </p>
            </div>
          </article>

          <hr className="border-gray-200" />

          {/* Uso e Responsabilidade */}
          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Uso e Responsabilidade
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Os cálculos, gráficos e estimativas apresentados{" "}
                <strong>
                  não constituem recomendações clínicas, financeiras ou
                  estratégicas
                </strong>
                , nem devem ser utilizados como base para decisões
                profissionais, de gestão ou políticas de saúde.
              </p>
              <div className="bg-red-50 border border-red-200 p-5 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  O uso deste aplicativo é de{" "}
                  <strong>inteira responsabilidade do usuário</strong>, que
                  reconhece seu caráter ilustrativo e aceita que{" "}
                  <strong>
                    nenhuma garantia de exatidão, aplicabilidade ou adequação
                  </strong>{" "}
                  é oferecida.
                </p>
              </div>
            </div>
          </article>

          <hr className="border-gray-200" />

          {/* Natureza Não Vinculante */}
          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Natureza Não Vinculante
            </h2>
            <p className="text-gray-700 leading-relaxed">
              O uso deste aplicativo{" "}
              <strong>não estabelece relação profissional-paciente</strong>, nem
              qualquer vínculo contratual ou de consultoria entre o usuário e os
              desenvolvedores, autores ou instituições associadas.
            </p>
          </article>

          <hr className="border-gray-200" />

          {/* Atualizações e Modificações */}
          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Atualizações e Modificações
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Os desenvolvedores reservam-se o direito de{" "}
              <strong>atualizar, modificar ou descontinuar</strong> o
              aplicativo, total ou parcialmente, sem aviso prévio.
            </p>
          </article>

          <hr className="border-gray-200" />

          {/* Legislação e Foro */}
          <article>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Legislação e Foro Competente
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Este aplicativo e seus termos são regidos pelas{" "}
              <strong>leis da República Federativa do Brasil</strong>, ficando
              eleito o foro da comarca do domicílio do desenvolvedor para
              dirimir eventuais controvérsias.
            </p>
          </article>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">
                Resumo para Divulgação
              </h3>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "Simulador didático baseado em modelos teóricos. Não
                  representa resultados reais nem substitui avaliação
                  profissional."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={() => {
              setCurrentSection(1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voltar ao Simulador
          </button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Voltar ao topo
          </button>
        </div>
      </div>
    </section>
  );
}
