import { inngest } from "@/lib/inngest/client"; // Instance Inngest configurée
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompts"; // Template du prompt utilisé pour générer l’introduction personnalisée

// Création d’une fonction Inngest déclenchée lors de l’événement "app/user.created"
export const sendSignUpEmail = inngest.createFunction(
    { id: 'sign-up-email' }, // Identifiant unique de la fonction
    { event: 'app/user.created' }, // Événement qui déclenche la fonction
    async ({ event, step }) => {

        // Construction du profil utilisateur à injecter dans le prompt
        const userProfile = `
            - Pays: ${event.data.country}
            - Objectif d'investissement: ${event.data.investmentGoals}
            - Tolerance au risque: ${event.data.riskTolerance}
            - Industrie favorite: ${event.data.preferredIndustry}
        `;

        // Injection du profil dans le template du prompt
        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

        // Appel au modèle Gemini via l’API AI d’Inngest
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }
        });

        // Étape séparée pour l’envoi de l’email
        await step.run('send-welcome-email', async () => {

            // Extraction sécurisée du texte généré par le modèle
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText =
                (part && 'text' in part ? part.text : null) ||
                "Merci d'avoir rejoint !";

            // Ici la logique d’envoi d’email
        });

        return {
            success: true,
            message: 'Email envoyé avec succès'
        };
    }
);
