import { serve } from "inngest/next"; // Fonction utilitaire pour exposer les handlers HTTP Inngest dans Next.js
import { inngest } from "@/lib/inngest/client"; // Instance Inngest configurée (client principal)
import { sendSignUpEmail } from "@/lib/inngest/functions"; // Fonction Inngest personnalisée (ex: envoi d’email après inscription)

// Création des handlers HTTP pour Next.js (App Router)
export const { GET, POST, PUT } = serve({
    client: inngest,               // Client Inngest configuré
    functions: [sendSignUpEmail],  // Liste des fonctions Inngest exposées
});
