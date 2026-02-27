import nodemailer from "nodemailer"; // Librairie pour envoyer des emails depuis Node.js

import {NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/template"; // Template HTML de l'email de bienvenue

// Création du transporteur SMTP pour l'envoi d'emails
export const transporter = nodemailer.createTransport({
    service: "gmail", // Service utilisé
    auth: {
        user: process.env.NODEMAILER_EMAIL!, // Adresse email envoyant les mails
        pass: process.env.NODEMAILER_PASSWORD!, // Mot de passe
    },
    tls: {
        // En production, on refuse les connexions non sécurisées
        rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
    }
});

// Fonction pour envoyer un email de bienvenue personnalisé
export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {

    // Remplace les placeholders dans le template par les données de l'utilisateur
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    // Configuration de l'email à envoyer
    const mailOptions = {
        from: `"Stock Tracker App" <robinpqn2@gmail.com>`, // Expéditeur
        to: email, // Destinataire
        subject: `Bienvenue sur votre application de suivi d'investissement`, // Objet
        text: 'Merci de nous avoir rejoint', // Texte alternatif si HTML non supporté
        html: htmlTemplate, // Contenu HTML
    };

    // Envoi de l'email via le transporteur configuré
    await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string}) : Promise<void> => {

    // Remplace les placeholders dans le template par les données du jour
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    // Configuration de l'email à envoyer
    const mailOptions = {
        from: `"Stock Tracker App" <robinpqn2@gmail.com>`, // Expéditeur
        to: email, // Destinataire
        subject: `Rapport et News du marché - ${date}`, // Objet
        text: 'Rapport et News du marché - ${date}', //Corp du mail
        html: htmlTemplate, // Contenu HTML
    };

    // Envoi de l'email via le transporteur configuré
    await transporter.sendMail(mailOptions);
};
