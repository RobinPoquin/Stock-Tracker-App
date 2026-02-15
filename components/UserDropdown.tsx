'use client';

import { Button } from "@/components/ui/button" // Bouton UI
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Composants UI pour le menu déroulant
import { useRouter } from "next/navigation"; // Hook Next.js pour naviguer côté client
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Composants Avatar pour afficher la photo/utilisateur
import { LogOut } from "lucide-react"; // Icône de déconnexion
import Navitems from "@/components/Navitems"; // Liste de navigation à afficher sur mobile

// Composant dropdown pour l'utilisateur connecté
const UserDropdown = ({ user }: { user: User }) => {

    const router = useRouter(); // Hook pour gérer la navigation

    // Fonction appelée lors de la déconnexion
    const handleSignOut = async () => {
        router.push("/sign-in"); // Redirection vers la page de connexion
    }

    return (
        <DropdownMenu>
            {/* Déclencheur du menu : bouton avec avatar et nom */}
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:yellow-500">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" /> {/* Image avatar */}
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {user.name[0]} {/* Initiale de l'utilisateur si pas d'image */}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-base font-medium text-gray-400">
                            {user.name} {/* Nom utilisateur affiché sur écran md+ */}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            {/* Contenu du menu déroulant */}
            <DropdownMenuContent className="text-gray-400">
                {/* Label du menu : avatar + nom + email */}
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-base font-medium text-gray-400">
                                {user.name} {/* Nom complet */}
                            </span>
                            <span className="text-sm text-gray-500">
                                {user.email} {/* Email utilisateur */}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-600"/> {/* Ligne de séparation */}

                {/* Item de menu pour la déconnexion */}
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer"
                >
                    <LogOut className="h-4 w-4 mr-2 hidden sm:block" /> {/* Icône déconnexion */}
                    Déconnexion
                </DropdownMenuItem>

                <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/> {/* Séparation sur desktop */}

                {/* Menu de navigation pour mobile */}
                <nav className="sm:hidden">
                    <Navitems /> {/* Liens de navigation */}
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
