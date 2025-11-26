import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "./server/mailer.js";

const prisma = new PrismaClient();

const getBaseURL = () => {
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    // En dev, utilise localhost
    return process.env.NODE_ENV === "production"
        ? "https://horizons-plus-production.up.railway.app"
        : "http://localhost:3005";
};


export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "mysql" }),

    // BaseURL pointe vers la racine
    baseURL: getBaseURL(),
    // Ajouter le secret (CRITIQUE pour la sécurité)
    secret: process.env.BETTER_AUTH_SECRET || "BETTER_AUTH_SECRET",

    trustedOrigins: [
    "https://horizons-plus.vercel.app",
  ],

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 jours
        updateAge: 60 * 60 * 24, // Mis à jour tous les jours
    },
    
    cookies: {
    sessionToken: {
      name: "__Secure-better-auth.session_token",
      sameSite: "none",
      secure: true,
      httpOnly: true,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? "horizons-plus-production.up.railway.app"
          : "localhost",
    },
  },

    // Configuration cookies adaptée dev/prod
    advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },

    

    emailAndPassword: {
        enabled: true,
        resetPasswordTokenExpiresIn: 3600,
        async sendResetPassword({ url, user }) {
            console.log("[reset-link]", url, "→", user.email);

            await sendMail({
                to: user.email,
                subject: "Réinitialisation de votre mot de passe",
                html: `
        <p>Bonjour${user.name ? " " + user.name : ""},</p>
        <p>Pour définir un nouveau mot de passe, cliquez&nbsp;:</p>
        <p><a href="${url}" target="_blank" rel="noopener">Réinitialiser mon mot de passe</a></p>
        <p>Si le bouton ne fonctionne pas, copiez-collez ce lien :</p>
        <p style="word-break: break-all;">${url}</p>
        <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
      `,
            });
        },
    },

    // socialProviders: {
    //   google: {
    //     clientId: "",
    //     clientSecret: "",
    //   },
    // },
});

export default auth;