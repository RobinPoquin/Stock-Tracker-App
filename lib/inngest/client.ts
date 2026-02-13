import { Inngest } from "inngest"; // SDK Inngest pour créer des fonctions

// Création d'une instance Inngest
export const inngest = new Inngest({
    id: 'sotckTrackerApp', // Identifiant unique de l’application (sert à distinguer les apps Inngest)

    // Configuration des options AI intégrées
    ai: {
        gemini: {
            apiKey: process.env.GEMINI_API_KEY! // Clé API Gemini récupérée depuis les variables d’environnement
        }
    }
});
