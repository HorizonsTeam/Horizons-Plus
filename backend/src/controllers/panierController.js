import panierService from '../services/panierService.js';

export async function getPanierForUser(req, res) {
    try {
        const { userId, sessionId } = req;

        const result = await panierService.getPanierForUser({
            userId, 
            sessionId
        });
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur getPanierForUser:", error);
        res.status(500).json({ error: error.message });
    }
}

export async function addBilletToPanier(req, res) {
    try {
        const { userId, sessionId, session } = req;

        let userData;

        if (session) {
            userData = {
                name: session.user.name,
                email: session.user.email,
            };
        } else {
            userData = {
                name: "Invité",
                email: null,
            };
        }
        
        const {
            departHeure,
            departLieu,
            arriveeHeure,
            arriveeLieu,
            classe,
            siegeRestant,
            prix,
            dateVoyage,
            transportType,
        } = req.body;

        const result = await panierService.addBilletToPanier(userId, sessionId, {
            departHeure,
            departLieu,
            arriveeHeure,
            arriveeLieu,
            classe,
            siegeRestant,
            prix,
            dateVoyage,
            transportType,
        }, userData);
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur addBilletToPanier:", error);
        res.status(500).json({ error: error.message });
    }
}

export async function deleteBilletFromPanier(req, res) {
    try {
        const { userId, sessionId } = req;
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({ error: "Missing itemId" });
        }

        const deletedItem = await panierService.deleteBilletFromPanier(userId, sessionId, itemId);

        res.status(200).json({ success: true, deletedItem });
    } catch (error) {
        console.error("Erreur deleteBilletFromPanier:", error);
        res.status(500).json({ error: error.message });
    }
}