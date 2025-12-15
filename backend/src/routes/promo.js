import express from 'express';
import sql from '../../db.js';

const router = express.Router();

// Route pour récupérer toutes les promotions
router.post('/validate', async (req, res) => { 
    const { code } = req.body;

    try {
        const promo = await sql`
            SELECT promo_code_id, actif, reduction_type, reduction_value, cible
            FROM promo_code
            WHERE promo_code_id = ${code}
            `;

        if (promo.length == 0) {
            return res.status(404).json({ 
                valid: false,
                message: "Promotion not found"
            });
        }

        const p = promo[0];

        return res.status(200).json({
            valid: p.actif,
            type: p.reduction_type,
            value: p.reduction_value,
            cible: p.cible
        });
    } catch (error) {
        console.error("Error fetching promotion:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;