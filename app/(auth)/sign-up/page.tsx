'use client'; // Composant exécuté côté client (Next.js)

import { useForm } from "react-hook-form"; // Hook pour gérer les formulaires
import { Button } from "@/components/ui/button"; // Composant bouton stylisé
import InputField from "@/components/forms/InputField"; // Champ texte standard
import SelectField from "@/components/forms/SelectField"; // Champ select standard
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants"; // Options pour selects
import { CountrySelectField } from "@/components/forms/CountrySelectField"; // Select pour pays
import FooterLink from "@/components/forms/FooterLink";
import {signUpWithEmail} from "@/lib/actions/auth.actions";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {error} from "better-auth/api";
import {err} from "inngest/types"; // Lien vers une autre page

const SignUp = () => {
    // Initialisation du formulaire avec react-hook-form
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: { // Valeurs par défaut du formulaire
            fullName: '',
            email: '',
            password: '',
            country: 'FR',
            investmentGoals: 'Growth',
            riskTolerance: 'Moyenne',
            preferredIndustry: 'Technologie',
        },
        mode: 'onBlur' // Validation à la sortie du champ
    });

    // Fonction appelée à la soumission
    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if (result.success) router.push('/');
        } catch (e) {
            console.error(e);
            toast.error('Inscription échouée',{
                description: e instanceof Error ? e.message : 'La création de compte a échouée...'
            });
        }
    }

    return (
        <>
            <h1 className="form-title">S'inscrire & Personnalise</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Nom complet */}
                <InputField
                    name="fullName"
                    label="Nom Complet"
                    placeholder="Robin Poquin"
                    register={register}
                    error={errors.fullName}
                    validation={{ required: 'Nom complet est demandé', minLength: 2 }}
                />

                {/* Email */}
                <InputField
                    name="email"
                    label="Email"
                    placeholder="Rentrez votre adresse e-mail"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Adresse mail est demandée', pattern: /^\w+@\w+\.\w+$/, message: 'Adresse mail est demandé' }}
                />

                {/* Mot de passe */}
                <InputField
                    name="password"
                    label="Mot de passe"
                    placeholder="Choisissez votre mot de passe"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Mot de Passe est demandé', minLength: 8 }}
                />

                {/* Pays */}
                <CountrySelectField
                    name="country"
                    label="Pays"
                    control={control}
                    error={errors.country}
                    required
                />

                {/* Objectifs d'investissement */}
                <SelectField
                    name="investmentGoals"
                    label="Objectifs d'investissement"
                    placeholder="Choisissez votre Objectifs d'investissement"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />

                {/* Tolérance au risque */}
                <SelectField
                    name="riskTolerance"
                    label="Tolérance au Risque"
                    placeholder="Choisissez votre tolerance au risque"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                {/* Industrie privilégiée */}
                <SelectField
                    name="preferredIndustry"
                    label="Industrie Privilégié"
                    placeholder="Choisissez votre Industrie Privilégié"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                {/* Bouton de soumission */}
                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Création du Compte' : 'Commence à Investir maintenant'}
                </Button>

                {/* Lien vers page de connexion */}
                <FooterLink text="Vous avez déjà un compte ?" linkText="Se connecter" href="/sign-in"/>
            </form>
        </>
    );
}

export default SignUp;
