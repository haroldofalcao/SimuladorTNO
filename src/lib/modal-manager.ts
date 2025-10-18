/**
 * Sistema de gerenciamento de modais para prevenir conflitos de overflow
 * Mantém um contador de quantos modais estão ativos
 */

let activeModals = 0;

export const modalManager = {
  /**
   * Registra que um modal foi aberto
   * Bloqueia o scroll apenas se for o primeiro modal
   */
  open: () => {
    activeModals++;
    if (activeModals === 1) {
      document.body.style.overflow = "hidden";
    }
  },

  /**
   * Registra que um modal foi fechado
   * Restaura o scroll apenas se não houver mais modais ativos
   */
  close: () => {
    activeModals = Math.max(0, activeModals - 1);
    if (activeModals === 0) {
      document.body.style.overflow = "unset";
    }
  },

  /**
   * Retorna o número de modais ativos
   */
  getActiveCount: () => activeModals,
};
