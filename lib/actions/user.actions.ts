'use server'; // Indique que cette fonction s'exécute côté serveur (Server Action)

import { connectToDatabase } from "@/database/mongoose"; // Fonction de connexion à MongoDB via mongoose

// Récupère tous les utilisateurs ayant un email valide pour l'envoi des news
export const getAllUsersForNewsEmail = async () => {
    try {
        // Connexion à la base de données
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        // Vérifie que la connexion à la base est bien disponible
        if (!db) throw new Error('Connexion à MongoDB a échoué');

        // Recherche des utilisateurs ayant un email existant et non null
        const users = await db.collection("user").find(
            { email: { $exists: true, $ne: null } }, // Condition de filtre
            { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }, // Champs sélectionnés uniquement
        ).toArray();

        // Nettoie les résultats et normalise l'id
        return users
            .filter((user) => user.email && user.name) // Sécurité supplémentaire
            .map((user) => ({
                id: user.id || user._id?.toString() || '', // Fallback si id absent
                email: user.email,
                name: user.name,
            }));

    } catch (e) {
        // Gestion des erreurs
        console.error('Erreur dans la récupération des données', e);
        return []; // Retourne un tableau vide en cas d'erreur
    }
};