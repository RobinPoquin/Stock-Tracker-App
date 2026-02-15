import type { Metadata } from "next"; // Type pour la métadonnée de la page Next.js
import { Geist, Geist_Mono } from "next/font/google"; // Import des polices Google via Next.js font
import "./globals.css"; // Styles globaux de l'application
import { Toaster } from "@/components/ui/sonner" // Composant pour afficher les notifications toast

// Configuration de la police Geist Sans
const geistSans = Geist({
    variable: "--font-geist-sans", // Nom de la variable CSS à utiliser
    subsets: ["latin"], // Subset de caractères à charger
});

// Configuration de la police Geist Mono
const geistMono = Geist_Mono({
    variable: "--font-geist-mono", // Variable CSS pour Geist Mono
    subsets: ["latin"],
});

// Métadonnées de l'application (titre et description)
export const metadata: Metadata = {
    title: "Stock Tracker",
    description: "Stock Tracker application",
};

// Layout racine de l'application Next.js
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode; // Contenu injecté depuis les pages
}>) {
    return (
        <html lang="en" className="dark"> {/* Mode sombre activé par défaut */}
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Application des polices et lissage des textes
        >
        {children} {/* Contenu des pages */}
        <Toaster /> {/* Affichage global des notifications toast */}
        </body>
        </html>
    );
}
