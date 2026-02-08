import { Label } from "@/components/ui/label"; // Label stylisé pour les champs
import { Controller } from "react-hook-form"; // Pour connecter le champ au formulaire
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Composants Select custom

// Composant générique pour un champ select avec react-hook-form
const SelectField = ({
                         name,        // Nom du champ
                         label,       // Label affiché
                         placeholder, // Texte affiché quand rien n’est sélectionné
                         options,     // Liste d’options {value, label}
                         control,     // Control de react-hook-form
                         error,       // Erreur éventuelle
                         required = false, // Si le champ est obligatoire
                     }: SelectFieldProps) => {
    return (
        <div className="space-y-2">
            {/* Label du champ */}
            <Label htmlFor={name} className="form-label">{label}</Label>

            {/* Contrôleur react-hook-form */}
            <Controller
                name={name}
                control={control}
                rules={{
                    required: required ? `Choisissez votre ${label.toLowerCase()}` : false
                }}
                render={({ field }) => (
                    // Composant Select connecté au formulaire
                    <Select value={field.value} onValueChange={field.onChange}>

                        {/* Bouton affichant la valeur sélectionnée ou le placeholder */}
                        <SelectTrigger className="select-trigger">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>

                        {/* Contenu du menu déroulant */}
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                            {options.map((option) => (
                                // Chaque option du select
                                <SelectItem
                                    value={option.value}
                                    key={option.value}
                                    className="focus:bg-gray-600 focus:text-white"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>

                        {/* Affiche l’erreur si le champ est invalide */}
                        {error && <p className="text-sm text-red-500">{error.message}</p>}
                    </Select>
                )}
            />
        </div>
    );
}

export default SelectField;
