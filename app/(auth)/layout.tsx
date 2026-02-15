import Link from "next/link"; // Pour les liens Next.js
import Image from "next/image"; // Pour les images optimisées Next.js
import { headers } from "next/headers"; // Pour récupérer les headers côté serveur
import { redirect } from "next/navigation"; // Pour rediriger côté serveur
import { auth } from "@/lib/better-auth/auth"; // Instance Better Auth pour gérer la session

// Layout pour les pages d'authentification (sign-in / sign-up)
const Layout = async ({ children } : { children : React.ReactNode }) => {
    // Récupère la session actuelle depuis les cookies/headers
    const session = await auth.api.getSession({ headers: await headers() });

    // Si l'utilisateur est déjà connecté, redirige vers la page d'accueil
    if (session?.user) redirect('/');

    return (
        <main className="auth-layout">
            {/* Partie gauche : formulaire et logo */}
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo">
                    {/* Logo de l'application */}
                    <Image
                        src="/assets/icons/logo.svg"
                        alt="Stock Tracker Logo"
                        width={140}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                {/* Contenu injecté depuis les pages (sign-in/sign-up) */}
                <div className="pb-6 lg:pb-8 flex-1">{children}</div>
            </section>

            {/* Partie droite : visuels et témoignage */}
            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    {/* Citation ou texte marketing */}
                    <blockquote className="auth-blockquote">
                        Cette application de tracker d'investissement vous permettra de suivre quotidiennement les valeurs mondiales qui vous rendront riche !
                    </blockquote>

                    {/* Auteur et étoiles */}
                    <div className="flex items-center justify-between">
                        <div>
                            <cite className="auth-testimonial-author">- R Poquin</cite>
                            <p className="max-md:text-xs text-gray-500">Investisseur autonome</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                            {/* Affiche 5 étoiles */}
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Image
                                    src="/assets/icons/star.svg"
                                    alt="Star"
                                    key={star}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Aperçu visuel du dashboard */}
                <div className="flex-1 relative">
                    <Image
                        src="/assets/images/dashboard.png"
                        alt="Dashboard Preview"
                        width={1440}
                        height={1550}
                        className="auth-dashboard-preview absolute top-0"
                    />
                </div>
            </section>
        </main>
    );
}

export default Layout;
