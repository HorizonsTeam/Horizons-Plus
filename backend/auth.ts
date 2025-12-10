import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "./server/mailer.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
});


const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3005";
  }

  throw new Error("BETTER_AUTH_URL must be set in production");
};


export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),

    // BaseURL pointe vers la racine
    baseURL: getBaseURL(),
    secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",

    trustedOrigins: [
        process.env.FRONT_URL || "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://horizons-plus.vercel.app",
    ],

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 jours
        updateAge: 60 * 60 * 24, // Mis à jour tous les jours
    },
    
    // Configuration cookies adaptée dev/prod
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
        cookieName: "better-auth.session_token",
        crossSubDomainCookies: {
            enabled: false, // Désactivé car frontend/backend sur domaines différents
        },
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