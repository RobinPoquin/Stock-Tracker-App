"use client" // Composant client React (Next.js)

import React, { useEffect, useState } from 'react'
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandList
} from "@/components/ui/command" // UI pour dialog de commande
import { Button } from "@/components/ui/button"; // Bouton personnalisé
import { Loader2, TrendingUp } from "lucide-react"; // Icônes
import Link from "next/link"; // Lien Next.js
import { searchStocks } from "@/lib/actions/finnhub.actions"; // Action fetch stocks
import { useDebounce } from "@/hooks/useDebounce"; // Hook debounce

export default function SearchCommand({ renderAs = 'button', label = 'Ajouter Stock', initialStocks }: SearchCommandProps) {
    const [open, setOpen] = useState(false) // Etat du dialog
    const [searchTerm, setSearchTerm] = useState('') // Texte recherché
    const [loading, setLoading] = useState(false) // Chargement
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks) // Liste des stocks affichés

    const isSearchMode = !!searchTerm.trim() // Mode recherche si input rempli
    const displayStock = isSearchMode ? stocks : stocks?.slice(0, 10) // Affiche tous si recherche, sinon top 10

    // Shortcut Cmd/Ctrl + K pour ouvrir le dialog
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setOpen(v => !v)
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    // Fonction de recherche stock
    const handleSearch = async () => {
        if (!isSearchMode) return setStocks(initialStocks) // Reset si vide

        setLoading(true)
        try {
            const result = await searchStocks(searchTerm.trim()) // Fetch API
            setStocks(result) // Update stocks
        } catch {
            setStocks([]) // En cas d'erreur
        } finally {
            setLoading(false)
        }
    }

    const debouncedSearch = useDebounce(handleSearch, 300) // Debounce pour limiter requêtes

    useEffect(() => {
        debouncedSearch() // Déclenche la recherche quand searchTerm change
    }, [searchTerm])

    // Reset après sélection
    const handleSelectStock = () => {
        setOpen(false)
        setSearchTerm('')
        setStocks(initialStocks)
    }

    return (
        <>
            {renderAs === 'text' ? (
                // Render en texte cliquable
                <span onClick={() => setOpen(true)} className="search-text">
                    {label}
                </span>
            ) : (
                // Render en bouton
                <Button onClick={() => setOpen(true)} className="search-btn">
                    {label}
                </Button>
            )}

            {/* Dialog de recherche */}
            <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
                <div className="search-field">
                    <CommandInput
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        placeholder="Rechercher action"
                        className="search-input"
                    />
                    {loading && <Loader2 className="search-loader" />} {/* Loader si recherche */}
                </div>

                <CommandList className="search-list">
                    {loading ? (
                        <CommandEmpty className="search-list--empty">Recherche...</CommandEmpty> // Texte pendant chargement
                    ) : displayStock?.length === 0 ? (
                        <div className="search-list-indicator">
                            {isSearchMode ? "Aucun résultat" : "Aucune action disponible"} {/* Message vide */}
                        </div>
                    ) : (
                        <ul>
                            <div className="search-count">
                                {isSearchMode ? 'Résultats' : 'Actions populaires'} ({displayStock?.length || 0}) {/* Count */}
                            </div>

                            {displayStock?.map((stock, i) => (
                                <li key={stock.symbol} className="search-item">
                                    <Link
                                        href={`/stock/${stock.symbol}`}
                                        onClick={handleSelectStock} // Reset search après clic
                                        className="search-item-link"
                                    >
                                        <TrendingUp className="h-4 w-4 text-gray-500" /> {/* Icône */}
                                        <div className="flex-1">
                                            <div className="search-item-name">{stock.name}</div> {/* Nom stock */}
                                            <div className="text-sm text-gray-500">
                                                {stock.symbol} | {stock.exchange} | {stock.type} {/* Info stock */}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}