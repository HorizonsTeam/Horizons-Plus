import { z } from "zod";
import { isPossiblePhoneNumber } from "react-phone-number-input";

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "Le prénom est requis."),
    lastName: z.string().trim().min(1, "Le nom est requis."),
    email: z.string().min(1, "L'email est requis.").email("Email invalide."),
    phone: z
      .string()
      .min(1, "Le numéro de téléphone est requis.")
      .refine((v) => isPossiblePhoneNumber(v), "Numéro de téléphone invalide."),
    password: z
      .string()
      .min(8, "Au moins 8 caractères.")
      .regex(/[A-Z]/, "Au moins une majuscule.")
      .regex(/[0-9]/, "Au moins un chiffre."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Les mots de passe ne correspondent pas.",
  });

export type SignupValues = z.infer<typeof signupSchema>;
