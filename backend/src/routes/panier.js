import express from 'express';
import { 
    getPanierForUser, 
    addBilletToPanier, 
    deleteBilletFromPanier 
} from '../controllers/panierController.js';
import { attachUserOrGuest } from '../middlewares/attachUserOrGuest.js';

const router = express.Router();

router.get(
    "/", 
    attachUserOrGuest, 
    getPanierForUser
);

router.post(
    "/add", 
    attachUserOrGuest, 
    addBilletToPanier
);

router.delete(
    "/delete", 
    attachUserOrGuest, 
    deleteBilletFromPanier
);

export default router;