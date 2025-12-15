import express from 'express';
import sql from '../../db.js';
import { validatePromoConditions } from '../utils/promoRules.js';

const router = express.Router();

function promoError(res, message, status = 200) {
    return res.status(status).json({ valid: false, message });
}

// Route pour récupérer toutes les promotions
router.post('/validate', async (req, res) => { 
    const { code, transport, price, class: ticketClass } = req.body;
    
    try {
        const promos = await sql`
            SELECT promo_code_id, actif, reduction_type, reduction_value, conditions
            FROM promo_code
            WHERE promo_code_id = ${code}
            `;

        if (promos.length === 0) {
            return promoError(res, "Promotion not found", 404);
        }

        const promo = promos[0];

        if (!promo.actif) {
            return promoError(res, "Promotion is inactive");
        }

        const conditions = promo.conditions || {};
        const context = { transport, price, class: ticketClass };

        if (!validatePromoConditions(conditions, context)) {
            return promoError(res, "Promotion conditions not met");
        }

        return res.status(200).json({
            valid: true,
            type: promo.reduction_type,
            value: promo.reduction_value,
        });
    } catch (error) {
        console.error("Error fetching promotion:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;