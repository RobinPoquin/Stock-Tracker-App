'use client'; // Composant exécuté côté client (Next.js)

import { NAV_ITEMS } from "@/lib/constants"; // Liste des liens de navigation { href, label }
import Link from "next/link"; // Composant Link de Next.js pour navigation interne
import { usePathname } from "next/navigation"; // Hook pour récupérer le path actuel

const Navitems = () => {
    const pathname = usePathname(); // Récupère l'URL courante

    // Fonction qui détermine si un lien est actif (style différent)
    const isActive = (path: string) => {
        if (path === "/") return pathname === '/'; // Page d'accueil
        return pathname.startsWith(path); // Toutes les autres pages
    }

    return (
        // Liste horizontale sur desktop, verticale sur mobile
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {NAV_ITEMS.map(({ href, label }) => (
                <li key={href}>
                    {/* Lien avec style actif et hover */}
                    <Link
                        href={href}
                        className={`hover:text-yellow-500 transition-colors ${
                            isActive(href) ? 'text-gray-100' : '' // Couleur si actif
                        }`}
                    >
                        {label} {/* Texte du lien */}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default Navitems;
