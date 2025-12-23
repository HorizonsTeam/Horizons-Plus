import panierService from '../services/panierService.js';
import auth from '../../dist/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export async function ensurePrimaryPassager(req, res) {
    try {
        const session = auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        })
        
        if (!session) {
            return res.status(401).json({ error: "Unauthenticated" })
        }

        const userId = session.user.id;

        const userData = {
            name: session.user.name,
            email: session.user.email,
            is_primary: true,
        }

        const result = await panierService.ensurePrimaryPassager(userId, userData)

        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur ensurePrimaryPassager:", error);
        res.status(500).json({ error: error.message });
    }
}

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
    } catch (error) {
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

        const userData = {
            name: session.user.name,
            email: session.user.email,
            is_primary: true
        };

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
        }, userData);
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur addBilletToPanier:", error);
        res.status(500).json({ error: error.message });
    }
}

export async function deleteBilletFromPanier(req, res) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            return res.status(401).json({ error: "Unauthenticated" });
        }

        const userId = session.user.id;
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({ error: "Missing itemId" });
        }

        const deletedItem = await panierService.deleteBilletFromPanier(userId, itemId);

        res.status(200).json({ success: true, deletedItem });
    } catch (error) {
        console.error("Erreur deleteBilletFromPanier:", error);
        res.status(500).json({ error: error.message });
    }
}