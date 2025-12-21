import panierService from '../services/panierService.js';

export async function getOrCreatePanier(req, res) {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId est requis" });
        }

        const result = await panierService.getOrCreatePanier(userId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Erreur getOrCreatePanier:", error);
        res.status(500).json({ error: error.message });
    }
}

export async function getPanier(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "userId est requis" });
        }

        const result = await panierService.getPanier(userId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Erreur getPanier:", error);
        res.status(500).json({ error: error.message });
    }
}