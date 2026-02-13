import { betterAuth } from "better-auth"; // Librairie d'authentification
import { mongodbAdapter } from "better-auth/adapters/mongodb"; // Adapter MongoDB
import { connectToDatabase } from "@/mongoose"; // Fonction de connexion MongoDB
import { nextCookies } from "better-auth/next-js"; // Plugin pour gérer les cookies avec Next.js

// Instance singleton pour éviter de recréer auth plusieurs fois
let authInstance: ReturnType<typeof betterAuth> | null = null;

// Fonction pour initialiser et récupérer l'instance d'authentification
export const getAuth = async () => {

    // Si déjà initialisée, on la retourne
    if (authInstance) return authInstance;

    // Connexion à MongoDB via mongoose
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    // Vérifie que la base est bien disponible
    if (!db) throw new Error("MongoDB connection not found!");

    // Création de l'instance better-auth
    authInstance = betterAuth({
        // Configuration de la base de données
        database: mongodbAdapter(db as any),

        // Clé secrète pour signer les tokens / sessions
        secret: process.env.BETER_AUTH_SECRET,

        // URL de base de l'application
        baseURL: process.env.BETER_AUTH_URL,

        // Configuration de l'authentification email + mot de passe
        emailAndPassword: {
            enabled: true,                 // Active l'auth par email/password
            disableSignUp: false,          // Autorise la création de compte
            requireEmailVerification: false, // Pas besoin de vérifier l’email
            minPasswordLength: 8,          // Longueur minimale du mot de passe
            maxPasswordLength: 128,        // Longueur maximale
            autoSignIn: true,              // Connecte automatiquement après inscription
        },

        // Plugin pour gérer les cookies dans Next.js
        plugins: [nextCookies()],
    });

    return authInstance;
}

// Export direct de l'instance (initialisation au chargement)
export const auth = await getAuth();
