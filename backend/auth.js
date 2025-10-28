import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({

  // Base de données 
  database: prismaAdapter(prisma, { provider: "mysql" }),

  // Auth email + mot de passe activée
  emailAndPassword: {
    enabled: true,
    
  },

  // Autoriser le frontend
  trustedOrigins: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],


  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_ID,
  //     clientSecret: process.env.GOOGLE_SECRET,
  //   },
  // },
});

export default auth;
