import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../dist/auth.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    // Stockage de l'ID utilisateur pour Prisma
    req.userId = session.user.id;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};