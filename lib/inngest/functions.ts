import { inngest } from "@/lib/inngest/client"; // Instance Inngest configurée
import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendNewsSummaryEmail, sendWelcomeEmail} from "@/lib/nodemailer";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
import {getWatchlistSymbolsByEmail} from "@/lib/actions/watchlist.actions";
import {getNews} from "@/lib/actions/finnhub.actions";
import {formatDateToday, getFormattedTodayDate} from "@/lib/utils"; // Template du prompt utilisé pour générer l’introduction personnalisée

/* =========================
   EMAIL DE BIENVENUE
========================= */


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

            const { data: { email, name}} = event;

            return await sendWelcomeEmail({
                email, name, intro: introText
            })
        });

        return {
            success: true,
            message: 'Email envoyé avec succès'
        };
    }
);

/* =========================
   EMAIL QUOTIDIEN
========================= */

export const sendDailyNewsSummary = inngest.createFunction(
    { id: 'daily-news-summary' },
    [ { event: 'app/send.daily.news' }, { cron: '0 12 * * * '} ], // Déclenchement manuel ou tous les jours à 12h
    //[ { event: 'app/send.daily.news' }, { cron: '* * * * * '} ], //cron de test

    async ({ step }) => {
        // Étape 1 : Récupérer tous les utilisateurs concernés
        const users = await step.run('get-all-users', getAllUsersForNewsEmail)

        if (!users || users.length === 0) return { success: false, message: 'Aucun utilisateur trouvé' };
        // Étape 2 : Récupérer les news personnalisées pour chaque utilisateur
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    articles = (articles || []).slice(0, 6 );

                    // Si aucune news spécifique, fallback sur news générales
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles= (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles})
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] })
                }
            }
            return perUser;
        })
        // Étape 3 : Résumer les news via IA
        const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

        for (const {user, articles} of results){
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                    body: {
                        contents: [{ role: 'user', parts: [{text:prompt}]}]
                    }
                });

                const part = response.candidates?.[0]?.content?.parts?.[0];
                const newsContent = (part && 'text' in part ? part.text : null) || 'Aucune news trouvée.'

                userNewsSummaries.push({ user, newsContent });
            } catch (e) {
                console.error('Echec de la préparation des news', user.email);
                userNewsSummaries.push({ user, newsContent: null});
            }
        }
        //Etape 4 : Envoyer Mails
        await step.run('send-news-emails', async () => {
            await Promise.all(
                userNewsSummaries.map(async ({ user, newsContent }) => {
                    if (!newsContent) return false;

                    return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent})
                })
            )
        })

        return { success: true, message: 'Email envoyé avec succès'} as const;
    }
)