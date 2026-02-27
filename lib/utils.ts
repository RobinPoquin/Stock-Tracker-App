import { clsx, type ClassValue } from 'clsx'; // Utilitaire pour composer des classes conditionnelles
import { twMerge } from 'tailwind-merge'; // Fusionne les classes Tailwind en évitant les conflits

// Combine clsx + tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // Génère une string de classes optimisée
}

// Formate un timestamp en "il y a X..."
export const formatTimeAgo = (timestamp: number) => {
  const now = Date.now(); // Temps actuel en ms
  const diffInMs = now - timestamp * 1000; // Différence (timestamp en secondes → ms)
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Différence en heures
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Différence en minutes

  if (diffInHours > 24) {
    const days = Math.floor(diffInHours / 24); // Convertit en jours
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else if (diffInHours >= 1) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  } else {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }
};

// Crée une pause async
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms)); // Timeout promisifié
}

// Formate une market cap en T / Md / M / €
export function formatMarketCapValue(marketCapEuro: number): string {
  if (!Number.isFinite(marketCapEuro) || marketCapEuro <= 0) return 'N/A'; // Sécurité

  if (marketCapEuro >= 1e12) return `${(marketCapEuro / 1e12).toFixed(2)} T €`; // Trillions
  if (marketCapEuro >= 1e9) return `${(marketCapEuro / 1e9).toFixed(2)} Md €`; // Milliards
  if (marketCapEuro >= 1e6) return `${(marketCapEuro / 1e6).toFixed(2)} M €`; // Millions
  return `${marketCapEuro.toFixed(2)} €`; // Valeur brute
}

// Retourne une plage de dates sur X jours
export const getDateRange = (days: number) => {
  const toDate = new Date(); // Date actuelle
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days); // Soustrait X jours

  return {
    to: toDate.toISOString().split('T')[0], // Format YYYY-MM-DD
    from: fromDate.toISOString().split('T')[0],
  };
};

// Plage de dates pour aujourd’hui uniquement
export const getTodayDateRange = () => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD

  return {
    to: todayString,
    from: todayString,
  };
};

// Détermine combien de news par symbole
export const calculateNewsDistribution = (symbolsCount: number) => {
  let itemsPerSymbol: number;
  let targetNewsCount = 6; // Maximum global

  if (symbolsCount < 3) {
    itemsPerSymbol = 3; // Peu de symboles → plus de news chacun
  } else if (symbolsCount === 3) {
    itemsPerSymbol = 2; // 3 symboles → 2 chacun = 6
  } else {
    itemsPerSymbol = 1; // Beaucoup de symboles → 1 chacun
    targetNewsCount = 6;
  }

  return { itemsPerSymbol, targetNewsCount };
};

// Vérifie que les champs essentiels existent
export const validateArticle = (article: RawNewsArticle) =>
    article.headline && article.summary && article.url && article.datetime;

// Retourne la date du jour en YYYY-MM-DD
export const getTodayString = () =>
    new Date().toISOString().split('T')[0];

// Formate un article brut
export const formatArticle = (
    article: RawNewsArticle,
    isCompanyNews: boolean,
    symbol?: string,
    index: number = 0
) => ({
  // ID unique (fallback si news entreprise)
  id: isCompanyNews ? Date.now() + Math.random() : article.id + index,

  headline: article.headline!.trim(), // Nettoie le titre

  // Résumé tronqué selon type
  summary:
      article.summary!.trim().substring(0, isCompanyNews ? 200 : 150) + '...',

  // Source par défaut si absente
  source: article.source || (isCompanyNews ? 'Company News' : 'Market News'),

  url: article.url!, // Lien article
  datetime: article.datetime!, // Timestamp
  image: article.image || '', // Image fallback vide

  // Catégorie adaptée
  category: isCompanyNews ? 'company' : article.category || 'general',

  // Champ related adapté
  related: isCompanyNews ? symbol! : article.related || '',
});

// Formate un pourcentage avec signe
export const formatChangePercent = (changePercent?: number) => {
  if (!changePercent) return ''; // Si null / undefined / 0
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

// Retourne classe couleur selon variation
export const getChangeColorClass = (changePercent?: number) => {
  if (!changePercent) return 'text-gray-400'; // Neutre
  return changePercent > 0 ? 'text-green-500' : 'text-red-500';
};

// Formate un prix en €
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
};

// Date du jour formatée en français
export const formatDateToday = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

// Génère texte d’alerte
export const getAlertText = (alert: Alert) => {
  const condition = alert.alertType === 'upper' ? '>' : '<'; // Condition seuil
  return `Prix ${condition} ${formatPrice(alert.threshold)}`;
};

// Retourne date du jour formatée (fonction)
export const getFormattedTodayDate = () =>
    new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });