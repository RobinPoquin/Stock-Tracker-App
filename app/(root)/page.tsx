import TradingViewWidget from "@/components/TradingViewWidget";
// Composant générique qui encapsule un widget TradingView

import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
// Configurations prédéfinies pour chaque type de widget TradingView

const Home = () => {

    // Base URL commune à tous les scripts TradingView
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        // Conteneur principal en flex occupant toute la hauteur de l’écran
        <div className="flex min-h-screen home-wrapper">

            {/* Section : widgets principaux du marché */}
            <section className="grid w-full gap-8 home-section">

                {/* Widget : vue globale du marché */}
                <div className="md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title="Vue du Marché"
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* Widget : heatmap des actions */}
                <div className="md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        title="Stock HeatMap"
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>

            {/* Section : actualités et données de marché */}
            <section className="grid w-full gap-8 home-section">

                {/* Widget : fil d’actualités */}
                <div className="h-full md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* Widget : cotations et données marché */}
                <div className="h-full md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>
        </div>
    );
};

export default Home;