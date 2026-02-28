"use client";
import React, { useMemo, useState } from "react";

// Bouton pour ajouter/retirer un stock à la watchlist
const WatchlistButton = ({
                             symbol,
                             company,
                             isInWatchlist,
                             showTrashIcon = false,
                             type = "button",
                             onWatchlistChange,
                         }: WatchlistButtonProps) => {
    const [added, setAdded] = useState<boolean>(!!isInWatchlist); // État local si le stock est ajouté

    // Label du bouton selon l'état et le type
    const label = useMemo(() => {
        if (type === "icon") return ""; // Pas de texte pour le mode icône
        return added ? "Retirer de la Watchlist" : "Ajouter à la Watchlist";
    }, [added, type]);

    // Gestion du clic : toggle et callback externe
    const handleClick = () => {
        const next = !added;
        setAdded(next);
        onWatchlistChange?.(symbol, next); // Prévient le parent
    };

    // Mode icône (étoile)
    if (type === "icon") {
        return (
            <button
                title={added ? `Retirer ${symbol} de la watchlist` : `Ajouter ${symbol} à la watchlist`}
                aria-label={added ? `Retirer ${symbol} de la watchlist` : `Ajouter ${symbol} à la watchlist`}
                className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
                onClick={handleClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={added ? "#FACC15" : "none"} // Couleur remplissage si ajouté
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    className="watchlist-star"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
            </button>
        );
    }

    // Mode bouton classique avec texte
    return (
        <button className={`watchlist-btn ${added ? "watchlist-remove" : ""}`} onClick={handleClick}>
            {/* Optionnel : icône poubelle si ajouté */}
            {showTrashIcon && added ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
                </svg>
            ) : null}
            <span>{label}</span> {/* Texte dynamique */}
        </button>
    );
};

export default WatchlistButton;