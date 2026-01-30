'use client'; // Hook exécuté côté client

import { useEffect, useRef } from "react";

const useTradingViewWidget = (
    scriptUrl: string,
    config: Record<string, unknown>,
    height = 600
) => {

    // Référence vers le conteneur HTML du widget
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Stop si le conteneur n’existe pas
        if (!containerRef.current) return;

        // Empêche le rechargement multiple du widget
        if (containerRef.current.dataset.loaded) return;

        // Crée le conteneur interne utilisé par TradingView
        containerRef.current.innerHTML =
            `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;

        // Création du script TradingView
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.innerHTML = JSON.stringify(config);

        // Injection du script dans le DOM
        containerRef.current.appendChild(script);

        // Marque le widget comme chargé
        containerRef.current.dataset.loaded = 'true';

        // Nettoyage lors du démontage
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                delete containerRef.current.dataset.loaded;
            }
        };
    }, [scriptUrl, config, height]); // Relance si ces valeurs changent

    // Retourne la ref à attacher au composant
    return containerRef;
};

export default useTradingViewWidget;