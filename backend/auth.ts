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

export const prisma = new PrismaClient({
  adapter,
});

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  //
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  //  sur localhost
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3005";
  }

  throw new Error("BETTER_AUTH_URL must be set in production");
};

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  // BaseURL pointe vers la racine
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",

  user: {
    hardDelete: true,
    deleteUser: { // Avec ça on ppermet la suppresion de l'utilisateur
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {

        await sendMail({
          to: user.email,
          subject: "Confirmez la supression de votre compte",
          html: `
          <h2>Suppression de votre compte</h2>
          <p>Bonjour ${user.name || ''},</p>
          <p>Vous avez demandé la <strong>suppression définitive</strong> de votre compte.</p>
          <p>Cette action est <strong>irréversible</strong>.</p>
          <p><a href="${url}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Confirmer la suppression</a></p>
          <p><small>Ce lien expire dans 24h. Ignorer ce message pour annuler.</small></p>
        `,
        });
      },
      beforeDelete: async (user) => {
        await prisma.$transaction(async (tx) => {
          // Suppression des paniers et dépendances
          const paniers = await tx.panier.findMany({ where: { user_id: user.id }, select: { panier_id: true } });
          const panierIds = paniers.map(p => p.panier_id);

          await tx.panier_item.deleteMany({ where: { panier_id: { in: panierIds } } });
          await tx.passager.deleteMany({ where: { panier_id: { in: panierIds } } });
          await tx.panier.deleteMany({ where: { panier_id: { in: panierIds } } });

          // Suppression des tables Better Auth
          await tx.account.deleteMany({ where: { userId: user.id } });
          await tx.session.deleteMany({ where: { userId: user.id } });
          await tx.verification.deleteMany({ where: { identifier: user.email } });

          // Supprimer l'utilisateur lui-même dans Neon
          await tx.user.delete({ where: { id: user.id } });
        });

        console.log(`${user.email} supprimé définitivement dans Neon`);
      }
    },
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
    },
  },

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

    useSecureCookies: isProd,

    defaultCookieAttributes: {
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      // partitioned: isProd, // optionnel, mais recommandé pour le futur
    },

    cookies: {
      session_token: {
        name: "better-auth.session_token",
        attributes: {
          sameSite: isProd ? "none" : "lax",
          secure: isProd,
          httpOnly: true,
        },
      },
    },


  },


  emailAndPassword: {
    enabled: true,
    afterCreateUser: async ({
      user,
      metadata,
    }: {
      user: { id: string }; // minimal type
      metadata?: { phone?: string };
    }) => {
      if (metadata?.phone) {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone: metadata.phone },
        });
      }
    },
    resetPasswordTokenExpiresIn: 3600,
    async sendResetPassword({ url, user }) {
      await sendMail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe",
        html: `<p>Bonjour${user.name ? " " + user.name : ""}, cliquez ici pour réinitialiser : <a href="${url}">${url}</a></p>`,
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