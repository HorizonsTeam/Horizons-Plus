import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client";
import { sendMail } from "./server/mailer";

const prisma = new PrismaClient()

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "mysql" }),
    emailAndPassword: {
        enabled: true,
        baseURL: process.env.AUTH_BASE_URL!,
        trustedOrigins: [process.env.FRONT_URL!],

        emailAndPassword: {
            enabled: true,
            minPasswordLength: 8,
            resetPasswordTokenExpiresIn: 60 * 60,

            // async sendResetPassword({ url, user }) {
            //     await sendMail({
            //         to: user.email,
            //         subject: "Réinitialisation de votre mot de passe",
            //         html: `
            //         <p>Bonjour${user.name ? " " + user.name : ""},</p>
            //         <p>Pour définir un nouveau mot de passe, cliquez ci-dessous :</p>
            //         <p><a href="${url}">Réinitialiser mon mot de passe</a></p>
            //         <p>Ce lien expirera dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
            //         `,
            //     });
            // },
        },
    },


    socialProviders: {

        google: {
            clientId: "",
            clientSecret: "",
        },
    },
});

export default auth;