import Header from "@/components/Header"; // Composant de l'en-tête de l'application
import { headers } from "next/headers"; // Fonction Next.js pour récupérer les headers HTTP côté serveur
import { auth } from "@/lib/better-auth/auth"; // Instance Better Auth configurée pour gérer l'authentification
import { redirect } from "next/navigation"; // Fonction Next.js pour rediriger côté serveur

// Composant Layout qui encapsule les pages nécessitant une session
const Layout = async ({ children } : { children : React.ReactNode }) => {

    // Récupération de la session utilisateur depuis Better Auth
    const session = await auth.api.getSession({ headers: await headers() });

    // Si pas de session ou utilisateur non connecté, redirection vers la page de connexion
    if (!session?.user) redirect('/sign-in');

    // Construction d'un objet utilisateur simplifié pour passer au Header
    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    };

    return (
        // Conteneur principal du layout
        <main className="min-h-screen text-gray-400">
            {/* En-tête avec les informations utilisateur */}
            <Header user={user}/>

            {/* Contenu principal injecté depuis les pages */}
            <div className="container py-10">
                {children}
            </div>
        </main>
    );
};

export default Layout;
