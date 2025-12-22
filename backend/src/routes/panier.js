import express from 'express';
import { getPanierForUser, addBilletToPanier } from '../controllers/panierController.js';

const router = express.Router();

router.get("/", getPanierForUser);
router.post("/add", addBilletToPanier);

export default router;