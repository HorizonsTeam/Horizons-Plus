import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "./server/mailer.js";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "mysql" }),

    baseURL: "https://horizons-plus-production.up.railway.app/api/auth",

    trustedOrigins: [
        process.env.FRONT_URL || "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://horizons-plus-production.up.railway.app", 
    ],

    sessionCookies: {
        enabled: true,
        name: "better-auth-session",
        sameSite: "none",
        secure: true,
        path: "/",
        domain: "horizons-plus-production.up.railway.app",
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
