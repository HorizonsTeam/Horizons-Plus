import panierService from '../services/panierService.js';
import auth from '../../dist/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export async function getPanierForUser(req, res) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            return res.status(401).json({ error: "Unauthenticated" });
        }

        const userId = session.user.id;

        const result = await panierService.getPanierForUser(userId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Erreur getPanierForUser:", error);
        res.status(500).json({ error: error.message });
    }
}

export async function addBilletToPanier(req, res) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            return res.status(401).json({ error: "Unauthenticated" });
        }

        const userId = session.user.id;

        const {
            departHeure,
            departLieu,
            arriveeHeure,
            arriveeLieu,
            classe,
            siegeLabel,
            prix,
            dateVoyage,
            transportType,
        } = req.body;

        const result = await panierService.addBilletToPanier(userId, {
            departHeure,
            departLieu,
            arriveeHeure,
            arriveeLieu,
            classe,
            siegeLabel,
            prix,
            dateVoyage,
            transportType,
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Erreur addBilletToPanier:", error);
        res.status(500).json({ error: error.message });
    }
}