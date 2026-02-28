import TradingViewWidget from "@/components/TradingViewWidget"; // Composant pour intégrer les widgets TradingView
import WatchlistButton from "@/components/WatchlistButton"; // Bouton pour ajouter le stock à la watchlist
import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants"; // Configs des widgets TradingView

// Page détails d'un stock
export default async function StockDetails({ params }: StockDetailsPageProps) {
    const { symbol } = await params; // Récupère le symbole depuis les params
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`; // URL de base des widgets

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 w-full">
            <section className="grid w-full gap-8 home-section">

                {/* Colonne gauche : Widgets graphiques */}
                <div className="md:col-span-1 xl:col-span-2">
                    {/* Infos générales du symbole */}
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}symbol-info.js`}
                        config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                        height={170}
                    />

                    {/* Graphique chandelier avancé */}
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                        className="custom-chart"
                        height={600}
                    />

                    {/* Baseline / indicateurs supplémentaires */}
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={BASELINE_WIDGET_CONFIG(symbol)}
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* Colonne droite : Analyse et profil */}
                <div className="md:col-span-1 xl:col-span-1">

                    {/* Bouton pour ajouter à la watchlist */}
                    <div className="flex items-center justify-between">
                        <WatchlistButton
                            symbol={symbol.toUpperCase()}
                            company={symbol.toUpperCase()}
                            isInWatchlist={false}
                        />
                    </div>

                    {/* Analyse technique */}
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}technical-analysis.js`}
                        config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                        height={400}
                    />

                    {/* Profil de l'entreprise */}
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}company-profile.js`}
                        config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                        height={440}
                    />

                    {/* Informations financières */}
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}financials.js`}
                        config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                        height={464}
                    />
                </div>
            </section>
        </div>
    );
}