import mongoose from "mongoose";

// Récupération de l'URI MongoDB depuis les variables d'environnement
const MONGODB_URI = process.env.MONGODB_URI;

// Déclaration globale pour éviter de recréer une connexion à chaque reload en dev
declare global {
    // Cache global pour stocker la connexion et la promesse de connexion
    var mongooseCache: {
        conn: typeof mongoose | null;                 // Connexion active
        promise: Promise<typeof mongoose> | null;     // Promesse de connexion en cours
    }
}

// Récupération du cache global s’il existe
let cached = global.mongooseCache;

// Initialisation du cache s’il n’existe pas encore
if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

// Fonction de connexion à la base de données
export const connectToDatabase = async () => {

    // Vérifie que l'URI est bien définie dans le .env
    if (!MONGODB_URI) throw new Error("MongoDB URI doit etre initialise dans .env");

    // Si une connexion existe déjà, on la retourne
    if (cached.conn) return cached.conn;

    // Si aucune promesse de connexion n'existe, on en crée une
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false // Désactive le buffering des commandes si pas connecté
        });
    }

    try {
        // On attend la résolution de la promesse et on stocke la connexion
        cached.conn = await cached.promise;
    } catch (err) {
        // En cas d'erreur, on reset la promesse pour permettre une nouvelle tentative
        cached.promise = null;
        throw err;
    }

    // Log de confirmation
    console.log(`Connecte a la base de donnees ${process.env.NODE_ENV} - ${MONGODB_URI}`);
};
