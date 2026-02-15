'use server'; // Indique que cette fonction s'exécute côté serveur

import { auth } from "@/lib/better-auth/auth"; // Instance Better Auth pour gérer l'inscription
import { inngest } from "@/lib/inngest/client";
import {headers} from "next/headers"; // Client Inngest pour envoyer des événements côté serveur

// Fonction pour inscrire un utilisateur avec email et mot de passe
export const signUpWithEmail = async ({
                                          email,
                                          password,
                                          fullName,
                                          country,
                                          investmentGoals,
                                          riskTolerance,
                                          preferredIndustry
                                      } : SignUpFormData) => {
    try {
        // Appel à l'API Better Auth pour créer l'utilisateur
        const response = await auth.api.signUpEmail({
            body: { email, password, name: fullName }
        });

        // Si l'inscription a réussi, on envoie un événement à Inngest
        if (response) {
            await inngest.send({
                name: 'app/user.created', // Nom de l'événement
                data: { // Données personnalisées de l'utilisateur pour l'email ou autre traitement
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            });
        }

        // Retourne un objet succès avec la réponse de Better Auth
        return { success: true, data: response };

    } catch (e) {
        // Gestion des erreurs
        console.log('Inscription échouée', e);
        return { success: false, error: 'Inscription échouée' };
    }
}

export const signInWithEmail = async ({
                                          email,
                                          password,
                                      } : SignInFormData) => {
    try {
        // Appel à l'API Better Auth pour conencter  l'utilisateur
        const response = await auth.api.signInEmail({
            body: { email, password }
        });

        // Retourne un objet succès avec la réponse de Better Auth
        return { success: true, data: response };

    } catch (e) {
        // Gestion des erreurs
        console.log('Connexion échouée', e);
        return { success: false, error: 'Connexion échouée' };
    }
}

// Fonction pour déconnecter un utilisateur
export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (e) {
        // Gestion des erreurs
        console.log('Déconnexion échouée', e);
        return { success: false, error: 'Déconnexion a échouée' };
    }
}

