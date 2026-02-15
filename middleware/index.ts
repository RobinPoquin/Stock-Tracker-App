import { NextRequest, NextResponse } from 'next/server'; // Objets Next.js pour gérer les requêtes et réponses côté serveur
import { getSessionCookie } from "better-auth/cookies"; // Fonction pour récupérer la session depuis le cookie

// Middleware pour protéger certaines routes côté serveur
export async function middleware(request: NextRequest) {
    // Récupère le cookie de session de l'utilisateur
    const sessionCookie = getSessionCookie(request);

    // Si utilisateur non connecté, redirige vers la page d'accueil
    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Sinon, autorise la requête et continue
    return NextResponse.next();
}

// Configuration du middleware pour définir les routes à protéger
export const config = {
    matcher: [
        // Applique le middleware à toutes les routes sauf API, assets, pages de connexion et fichiers Next.js statiques
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
    ],
};
