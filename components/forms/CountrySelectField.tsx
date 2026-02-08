/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Flag from 'react-country-flag'; // Composant pour afficher les drapeaux des pays
import { useState } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form'; // Pour gérer le formulaire
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Popover custom
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'; // Menu avec recherche et sélection
import { Button } from '@/components/ui/button'; // Bouton stylisé
import { Label } from '@/components/ui/label'; // Label pour les champs de formulaire
import { Check, ChevronsUpDown } from 'lucide-react'; // Icônes
import { cn } from '@/lib/utils'; // Fonction utilitaire pour concaténer classes CSS
import countryList from 'react-select-country-list'; // Liste des pays avec code et nom

// Définition des props du champ formulaire
type CountrySelectProps = {
    name: string; // Nom du champ
    label: string; // Label affiché
    control: Control<any>; // Control de react-hook-form
    error?: FieldError; // Erreur liée au champ
    required?: boolean; // Si le champ est obligatoire
};

// Composant principal du select de pays
const CountrySelect = ({
                           value,
                           onChange,
                       }: {
    value: string; // Code du pays sélectionné
    onChange: (value: string) => void; // Fonction pour mettre à jour la valeur
}) => {
    const [open, setOpen] = useState(false); // État du popover (ouvert/fermé)

    // Récupération de tous les pays avec leur code et leur nom
    const countries = countryList().getData();

    // Fonction utilitaire pour transformer un code pays en emoji drapeau
    const getFlagEmoji = (countryCode: string) => {
        const codePoints = countryCode
            .toUpperCase()
            .split('') // Sépare chaque lettre du code
            .map((char) => 127397 + char.charCodeAt(0)); // Transforme en code emoji
        return String.fromCodePoint(...codePoints); // Retourne l’emoji
    };

    return (
        // Popover pour le menu déroulant
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {/* Bouton qui déclenche le popover */}
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='country-select-trigger'
                >
                    {value ? (
                        // Affiche le drapeau et le nom du pays sélectionné
                        <span className='flex items-center gap-2'>
                            <span>{getFlagEmoji(value)}</span>
                            <span>{countries.find((c) => c.value === value)?.label}</span>
                        </span>
                    ) : (
                        // Texte par défaut si aucun pays sélectionné
                        'Choisissez votre pays...'
                    )}
                    {/* Icône pour indiquer un dropdown */}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>

            {/* Contenu du popover */}
            <PopoverContent className='w-full p-0 bg-gray-800 border-gray-600' align='start'>
                <Command className='bg-gray-800 border-gray-600'>
                    {/* Input pour rechercher un pays */}
                    <CommandInput placeholder='Recherche pays...' className='country-select-input' />
                    {/* Message si aucun pays trouvé */}
                    <CommandEmpty className='country-select-empty'>No country found.</CommandEmpty>
                    {/* Liste déroulante des pays */}
                    <CommandList className='max-h-60 bg-gray-800 scrollbar-hide-default'>
                        <CommandGroup className='bg-gray-800'>
                            {countries.map((country) => (
                                <CommandItem
                                    key={country.value}
                                    value={`${country.label} ${country.value}`}
                                    onSelect={() => {
                                        onChange(country.value); // Met à jour la valeur sélectionnée
                                        setOpen(false); // Ferme le popover après sélection
                                    }}
                                    className='country-select-item'
                                >
                                    {/* Icône de check si ce pays est sélectionné */}
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4 text-yellow-500',
                                            value === country.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {/* Affiche le drapeau SVG et le nom du pays */}
                                    <span className='flex items-center gap-2'>
                                        <Flag
                                            svg
                                            countryCode={country.value}
                                            style={{ width: '1.25em', height: '1.25em' }}
                                        />
                                        <span>{country.label}</span>
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

// Wrapper pour intégrer le CountrySelect dans react-hook-form
export const CountrySelectField = ({
                                       name,
                                       label,
                                       control,
                                       error,
                                       required = false,
                                   }: CountrySelectProps) => {
    return (
        <div className='space-y-2'>
            {/* Label du champ */}
            <Label htmlFor={name} className='form-label'>{label}</Label>

            {/* Contrôleur react-hook-form */}
            <Controller
                name={name}
                control={control}
                rules={{ required: required ? `Please select ${label.toLowerCase()}` : false }}
                render={({ field }) => <CountrySelect value={field.value} onChange={field.onChange} />}
            />

            {/* Affichage de l’erreur si le champ est invalide */}
            {error && <p className='text-sm text-red-500'>{error.message}</p>}

            {/* Description supplémentaire */}
            <p className='text-xs text-gray-500'>
                Aidez nous à vous présenter des données de marché et des actualités pertinentes pour vous.
            </p>
        </div>
    );
};
