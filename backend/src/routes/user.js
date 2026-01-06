// src/routes/user.js
import express from "express";
import auth from "../../dist/auth.js";

const router = express.Router();

router.post("/phone", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return res.status(401).json({ error: "Unauthenticated" });

        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: "Phone is required" });

        // Mise à jour l'utilisateur dans Better Auth
        const updatedUser = await auth.database.updateUser(session.user.id, {
            phone,
        });

        res.json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
