'use client'; // Composant exécuté côté client (Next.js)

import { useForm } from 'react-hook-form'; // Gestion des formulaires
import { Button } from '@/components/ui/button'; // Bouton stylisé
import InputField from '@/components/forms/InputField'; // Champ texte standard
import FooterLink from '@/components/forms/FooterLink'; // Lien vers une autre page
import { useRouter } from "next/navigation"; // Pour naviguer après connexion

const SignIn = () => {
    const router = useRouter(); // Hook pour naviguer programmétiquement

    // Initialisation du formulaire
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: { email: '', password: '' }, // Valeurs par défaut
        mode: 'onBlur', // Validation à la sortie du champ
    });

    // Fonction appelée à la soumission
    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data); // Appel API connexion
            if (result.success) router.push('/'); // Redirection si succès
        } catch (e) {
            console.error(e);
            toast.error('Connexion à échouée', {
                description: e instanceof Error ? e.message : 'Echec de la connexion.'
            }); // Affichage message d'erreur
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Champ email */}
                <InputField
                    name="email"
                    label="Email"
                    placeholder="Rentrez votre adresse e-mail"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Adresse mail est demandée', pattern: /^\w+@\w+\.\w+$/ }}
                />

                {/* Champ mot de passe */}
                <InputField
                    name="password"
                    label="Mot de Passe"
                    placeholder="Entrez votre mot de passe"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Mot de Passe est demandé', minLength: 8 }}
                />

                {/* Bouton de soumission */}
                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                {/* Lien vers page d'inscription */}
                <FooterLink text="Vous n'avez pas de compte ?" linkText="Créez un compte" href="/sign-up" />
            </form>
        </>
    );
};

export default SignIn;
