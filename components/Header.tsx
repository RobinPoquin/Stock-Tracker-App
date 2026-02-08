import React from 'react';
import Link from "next/link";           // Pour les liens internes Next.js
import Image from "next/image";         // Optimisation des images Next.js
import Navitems from "@/components/Navitems"; // Menu de navigation
import UserDropdown from "@/components/UserDropdown"; // Dropdown utilisateur

const Header = () => {
    return (
        // Header sticky en haut de la page
        <header className="sticky top-0 header">

            {/* Conteneur principal pour logo, nav et user dropdown */}
            <div className="container header-wrapper">

                {/* Logo cliquable menant à la home */}
                <Link href="/">
                    <Image
                        src="assets/icons/logo.svg"
                        alt="Stock Tracker Logo"
                        width={140}
                        height={32}
                        className="h-8 w-auto cursor-pointer"
                    />
                </Link>

                {/* Menu de navigation affiché seulement sur écran sm et plus */}
                <nav className="hidden sm:block">
                    <Navitems/>
                </nav>

                {/* Dropdown pour l’utilisateur */}
                <UserDropdown/>
            </div>
        </header>
    );
}

export default Header;
