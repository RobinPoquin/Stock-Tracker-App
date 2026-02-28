'use client'; // Hook côté client

import { useCallback, useRef } from "react";

// Hook debounce : retarde l'exécution d'une fonction jusqu'à ce que l'utilisateur arrête d'appeler
export function useDebounce(callback: () => void, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Référence du timeout pour pouvoir le clear

    return useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // Annule le timeout précédent
        }

        timeoutRef.current = setTimeout(callback, delay);
        // Planifie la fonction après le délai
    }, [callback, delay]); // Recréé la fonction seulement si callback ou delay change
}