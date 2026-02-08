import React from 'react';
import { Label } from "@/components/ui/label"; // Label stylisé pour le champ
import { Input } from "@/components/ui/input"; // Input stylisé
import { cn } from "@/lib/utils"; // Fonction utilitaire pour concaténer conditionnellement des classes CSS

// Composant générique pour un champ input connecté à react-hook-form
const InputField = ({
                        name,        // Nom du champ (clé pour react-hook-form)
                        label,       // Label affiché au-dessus du champ
                        placeholder, // Texte affiché quand le champ est vide
                        type = "text", // Type d’input (text, password, email, etc.)
                        register,    // Fonction register de react-hook-form
                        error,       // Objet d’erreur de react-hook-form pour ce champ
                        validation,  // Règles de validation (required, minLength, pattern, etc.)
                        disabled,    // Si le champ est désactivé
                        value        // Valeur du champ (optionnel, utile pour contrôle externe)
                    }: FormInputProps) => {
    return (
        <div className="space-y-2">
            {/* Label du champ */}
            <Label htmlFor={name} className="form-label">
                {label}
            </Label>

            {/* Input stylisé connecté à react-hook-form */}
            <Input
                type={type} // Type du champ
                id={name}   // id lié au label
                placeholder={placeholder} // Texte placeholder
                disabled={disabled}       // Si le champ est désactivé
                value={value}             // Valeur contrôlée si passée
                className={cn(
                    'form-input',
                    { 'opacity-50 cursor-not-allowed': disabled } // Style si désactivé
                )}
                {...register(name, validation)} // Enregistrement et validation
            />

            {/* Affichage du message d'erreur si le champ est invalide */}
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    );
}

export default InputField;
