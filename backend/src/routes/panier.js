import express from 'express';
import { getPanierForUser, addBilletToPanier, deleteBilletFromPanier } from '../controllers/panierController.js';

const router = express.Router();

router.get("/", getPanierForUser);
router.post("/add", addBilletToPanier);
router.delete("/delete", deleteBilletFromPanier);

export default router;