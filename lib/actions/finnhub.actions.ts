'use server'; // Exécuté uniquement côté serveur

import { getDateRange, validateArticle, formatArticle } from '@/lib/utils';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';
import { cache } from 'react';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'; // URL de base de l'API Finnhub
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? ''; // Clé API publique

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
    // Options de cache (ISR si revalidateSeconds existe)
    const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
        ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } } // Cache + revalidation
        : { cache: 'no-store' }; // Pas de cache

    const res = await fetch(url, options); // Requête HTTP

    if (!res.ok) {
        const text = await res.text().catch(() => ''); // Récupère message d’erreur si possible
        throw new Error(`Erreur ${res.status}: ${text}`); // Erreur explicite
    }

    return (await res.json()) as T; // Parse JSON typé
}

export { fetchJSON }; // Export utilitaire

export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
    try {
        const range = getDateRange(5); // Plage sur 5 jours

        // Priorité à la clé serveur
        const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;

        if (!token) {
            throw new Error("FINNHUB API key n'est pas configuré"); // Sécurité si clé absente
        }

        // Nettoyage des symboles
        const cleanSymbols = (symbols || [])
            .map((s) => s?.trim().toUpperCase()) // Trim + majuscules
            .filter((s): s is string => Boolean(s)); // Supprime valeurs invalides

        const maxArticles = 6; // Limite d’articles

        // Si symboles fournis
        if (cleanSymbols.length > 0) {

            const perSymbolArticles: Record<string, RawNewsArticle[]> = {}; // Articles par symbole

            // Fetch en parallèle pour chaque symbole
            await Promise.all(
                cleanSymbols.map(async (sym) => {
                    try {
                        const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${range.from}&to=${range.to}&token=${token}`; // URL entreprise
                        const articles = await fetchJSON<RawNewsArticle[]>(url, 300); // Cache 5 min
                        perSymbolArticles[sym] = (articles || []).filter(validateArticle); // Filtre articles valides
                    } catch (e) {
                        console.error('Erreur lors de la récupération des donénes pour', sym, e); // Log erreur
                        perSymbolArticles[sym] = []; // Évite undefined
                    }
                })
            );

            const collected: MarketNewsArticle[] = []; // Articles sélectionnés

            // Sélection round-robin
            for (let round = 0; round < maxArticles; round++) {
                for (let i = 0; i < cleanSymbols.length; i++) {

                    const sym = cleanSymbols[i]; // Symbole courant
                    const list = perSymbolArticles[sym] || []; // Liste associée

                    if (list.length === 0) continue; // Skip si vide

                    const article = list.shift(); // Retire premier article
                    if (!article || !validateArticle(article)) continue; // Vérification

                    collected.push(formatArticle(article, true, sym, round)); // Formate et ajoute

                    if (collected.length >= maxArticles) break; // Stop si limite atteinte
                }

                if (collected.length >= maxArticles) break; // Sortie boucle externe
            }

            if (collected.length > 0) {
                collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0)); // Tri par date desc
                return collected.slice(0, maxArticles); // Retour limité
            }
        }

        // Fallback news générales
        const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
        const general = await fetchJSON<RawNewsArticle[]>(generalUrl, 300); // Cache 5 min

        const seen = new Set<string>(); // Set anti-doublons
        const unique: RawNewsArticle[] = [];

        for (const art of general || []) {

            if (!validateArticle(art)) continue; // Filtre validité

            const key = `${art.id}-${art.url}-${art.headline}`; // Clé unique
            if (seen.has(key)) continue; // Ignore doublon

            seen.add(key); // Marque comme vu
            unique.push(art); // Ajoute à la liste

            if (unique.length >= 20) break; // Limite interne
        }

        const formatted = unique
            .slice(0, maxArticles) // Coupe à 6
            .map((a, idx) => formatArticle(a, false, undefined, idx)); // Formate

        return formatted; // Retour final

    } catch (err) {
        console.error('getNews error:', err); // Log global
        throw new Error('Failed to fetch news'); // Erreur générique
    }
}

// Recherche de stocks avec cache côté serveur
export const searchStocks = cache(async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
        const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!token) {
            console.error('Erreur lors de la recherche:', new Error('FINNHUB API key n\'est pas configuré'));
            return [];
        }

        const trimmed = typeof query === 'string' ? query.trim() : '';
        let results: FinnhubSearchResult[] = [];

        if (!trimmed) {
            // Retourne les 10 symbols populaires
            const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
            const profiles = await Promise.all(
                top.map(async (sym) => {
                    try {
                        const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
                        const profile = await fetchJSON<any>(url, 3600); // Cache 1h
                        return { sym, profile };
                    } catch (e) {
                        console.error('Error fetching profile2 for', sym, e);
                        return { sym, profile: null };
                    }
                })
            );

            results = profiles
                .map(({ sym, profile }) => {
                    const symbol = sym.toUpperCase();
                    const name: string | undefined = profile?.name || profile?.ticker;
                    if (!name) return undefined;
                    const r: FinnhubSearchResult = {
                        symbol,
                        description: name,
                        displaySymbol: symbol,
                        type: 'Common Stock',
                    };
                    (r as any).__exchange = profile?.exchange;
                    return r;
                })
                .filter((x): x is FinnhubSearchResult => Boolean(x));
        } else {
            const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
            const data = await fetchJSON<FinnhubSearchResponse>(url, 1800); // Cache 30 min
            results = Array.isArray(data?.result) ? data.result : [];
        }

        // Mappe les résultats vers StockWithWatchlistStatus
        const mapped: StockWithWatchlistStatus[] = results
            .map((r) => {
                const upper = (r.symbol || '').toUpperCase();
                const name = r.description || upper;
                const exchange = (r.displaySymbol as string) || (r as any).__exchange || 'US';
                const type = r.type || 'Stock';
                return { symbol: upper, name, exchange, type, isInWatchlist: false };
            })
            .slice(0, 15); // Limite 15 résultats

        return mapped;
    } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        return [];
    }
});