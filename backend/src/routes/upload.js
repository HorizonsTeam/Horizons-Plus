import express from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { prisma } from "../../dist/auth.js";

const router = express.Router();

// Configuration Cloudinary - Identifiants
cloudinary.config({
    cloud_name: 'dty7z8rxt',
    api_key: '752413822317222',
    api_secret: process.env.CLOUDINARY_SECRET
});

// Stockage 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars',
        allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
        transformation: [{ width: 400, height: 400, crop: 'limit' }]
    },
});

const upload = multer({ storage: storage });

// Route Upload
router.post('/upload-avatar', upload.single('file'), async (req, res) => {

    try {
        // console.log("ID utilisateur extrait de la session :", req.userId);
        
        if (!req.file) return res.status(400).json({ error: "Fichier non reçu par Multer" });
        // console.log("URL Cloudinary générée :", req.file.path);

        const userBefore = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!userBefore) {
            // console.error("Erreur : Aucun utilisateur trouvé en bdd avec l'ID :", req.userId);
            return res.status(404).json({ error: "Utilisateur introuvable dans la base de données" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { image: req.file.path }
        });

        // console.log("Succès : Utilisateur mis à jour dans Neon :", updatedUser.image);
        
        res.json({
            success: true,
            url: updatedUser.image
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;