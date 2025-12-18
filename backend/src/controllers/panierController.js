import panierService from '../services/panierService.js';

export async function getOrCreatePanier(req, res) {
    try {
        const result = await panierService.getOrCreatePanier(req.body.sessionId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Erreur getOrCreatePanier:", error);
        res.status(500).json({ error: error.message });
    }
}

export async function getPanier(req, res) {
    try {
        const result = await panierService.getPanier(req.params.sessionId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Erreur getPanier:", error);
        res.status(500).json({ error: error.message });
    }
}