import { useCallback } from "react";
import { logEvent } from "firebase/analytics";
import { firebaseAnalytics } from "./firebase";

export const useAnalytics = () => {
    const trackEvent = useCallback(
        (eventName: string, eventParams?: Record<string, unknown>) => {
            if (firebaseAnalytics) {
                try {
                    logEvent(firebaseAnalytics, eventName, eventParams);
                } catch (error) {
                    console.debug("Analytics event failed:", error);
                }
            }
        },
        [],
    );

    const trackPageView = useCallback((pageName: string) => {
        if (firebaseAnalytics) {
            try {
                logEvent(firebaseAnalytics, "page_view", {
                    page_title: pageName,
                    page_location: window.location.href,
                    page_path: window.location.pathname,
                });
            } catch (error) {
                console.debug("Analytics page view failed:", error);
            }
        }
    }, []);

    const trackSectionChange = useCallback(
        (sectionNumber: number, sectionName: string) => {
            trackEvent("section_changed", {
                section_number: sectionNumber,
                section_name: sectionName,
            });
        },
        [trackEvent],
    );

    const trackConfigChange = useCallback(
        (configKey: string, value: string | number) => {
            trackEvent("config_changed", {
                config_key: configKey,
                config_value: value,
            });
        },
        [trackEvent],
    );

    const trackSimulationRun = useCallback(
        (config: Record<string, unknown>) => {
            trackEvent("simulation_run", {
                hospital_type: config.hospitalType,
                patient_type: config.patientType,
                populacao: config.populacao,
                eficacia_tno: config.eficaciaTNO,
                adesao: config.adesao,
                custo_tno_diario: config.custoTNODiario,
            });
        },
        [trackEvent],
    );

    const trackSimulationResults = useCallback(
        (results: {
            roi: number;
            economiaTotal: number;
            diasHospitalizacao: number;
            custoTNO: number;
        }) => {
            trackEvent("simulation_completed", {
                roi: results.roi,
                economia_total: results.economiaTotal,
                dias_hospitalizacao: results.diasHospitalizacao,
                custo_tno: results.custoTNO,
            });
        },
        [trackEvent],
    );

    const trackChartInteraction = useCallback(
        (chartType: string, action: string) => {
            trackEvent("chart_interaction", {
                chart_type: chartType,
                action: action,
            });
        },
        [trackEvent],
    );

    return {
        trackEvent,
        trackPageView,
        trackSectionChange,
        trackConfigChange,
        trackSimulationRun,
        trackSimulationResults,
        trackChartInteraction,
    };
};
