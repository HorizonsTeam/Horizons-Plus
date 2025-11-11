// import { Router } from "express";
// import { auth } from "../auth";
// export const router = Router();

// // 1) Envoi du lien de reset (email -> lien ?token=...)
// router.post("/auth/forgot-password", async (req, res) => {
//   try {
//     req.body.redirectTo ??= `${process.env.FRONT_URL}/reset-password`;
//     await auth.api.forgotPasswordEmailLink.handleRequest(req, res);
//   } catch {
//     // réponse neutre (anti-énumération)
//     res.status(200).json({
//       message: "Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.",
//     });
//   }
// });

// // // 2) Finaliser le reset (token + newPassword)
// router.post("/auth/reset-password", async (req, res) => {
//   try {
//     await auth.api.resetPassword.handleRequest(req, res);
//   } catch {
//     res.status(400).json({ error: "Lien invalide ou expiré." });
//   }
// });
