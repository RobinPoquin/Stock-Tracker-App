'use client'; // Composant exécuté côté client (Next.js)

import React, { memo } from 'react';
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";

interface TradingViewWidgetProps {
    title?: string;           // Titre optionnel
    scriptUrl: string;        // URL du script TradingView
    config: Record<string, unknown>; // Configuration du widget
    height?: number;          // Hauteur du widget
    className?: string;       // Classes CSS additionnelles
}

const TradingViewWidget = ({
                               title,
                               scriptUrl,
                               config,
                               height = 600,
                               className
                           }: TradingViewWidgetProps) => {

    // Initialise le widget TradingView et récupère la ref du conteneur
    const containerRef = useTradingViewWidget(scriptUrl, config, height);

    return (
        <div className="w-full">
            {/* Affiche le titre s’il existe */}
            {title && <h3 className="font-semibold text-2xl text-gray-100 mb-5">{title}</h3>}

            {/* Conteneur du widget TradingView */}
            <div
                className={cn('tradingview-widget-container', className)}
                ref={containerRef}
            >
                {/* Zone où TradingView injecte le widget */}
                <div
                    className="tradingview-widget-container__widget"
                    style={{ height, width: "100%" }}
                />
            </div>
        </div>
    );
}

// Évite les re-renders inutiles si les props ne changent pas
export default memo(TradingViewWidget);