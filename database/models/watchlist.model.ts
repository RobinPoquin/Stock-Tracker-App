import { Schema, model, models, type Document, type Model } from 'mongoose'; // Import des outils mongoose pour créer un modèle typé

// Interface TypeScript représentant un document Watchlist
export interface WatchlistItem extends Document {
    userId: string;   // ID de l'utilisateur propriétaire
    symbol: string;   // Symbole boursier (ex: AAPL)
    company: string;  // Nom de l'entreprise
    addedAt: Date;    // Date d'ajout à la watchlist
}

// Définition du schéma MongoDB
const WatchlistSchema = new Schema<WatchlistItem>(
    {
        userId: {
            type: String,
            required: true,
            index: true // Index pour accélérer les recherches par utilisateur
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true, // Force le symbole en majuscules
            trim: true       // Supprime les espaces inutiles
        },
        company: {
            type: String,
            required: true,
            trim: true // Nettoyage des espaces
        },
        addedAt: {
            type: Date,
            default: Date.now // Date automatique lors de la création
        },
    },
    {
        timestamps: false // Pas de createdAt / updatedAt automatiques
    }
);

// Empêche les doublons : un utilisateur ne peut pas ajouter 2x le même symbole
WatchlistSchema.index(
    { userId: 1, symbol: 1 },
    { unique: true }
);

// Export du modèle en évitant la recréation en environnement hot-reload (Next.js)
export const Watchlist: Model<WatchlistItem> =
    (models?.Watchlist as Model<WatchlistItem>) || model<WatchlistItem>('Watchlist', WatchlistSchema);