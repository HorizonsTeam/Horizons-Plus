import express from 'express';
import { getPanier, getOrCreatePanier } from '../controllers/panierController.js';

const router = express.Router();

router.post("/", getOrCreatePanier);
router.get("/:userId", getPanier);

export default router;