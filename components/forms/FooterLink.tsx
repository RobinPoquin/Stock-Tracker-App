import Link from "next/link"; // Composant Link de Next.js pour navigation interne

const FooterLink = ({ text, linkText, href }: FooterLinkProps) => {
    return (
        // Conteneur centré avec padding en haut
        <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
                {text}{` `} {/* Texte principal suivi d'un espace */}

                {/* Lien cliquable */}
                <Link href={href} className="footer-link">
                    {linkText}
                </Link>
            </p>
        </div>
    );
}

export default FooterLink;
