// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./dist/auth.js"; // export default depuis ton build
import searchPlaces from "./src/routes/searchPlaces.js";
import searchJourneys from "./src/routes/searchJourneys.js";
import amadeusPlaces from "./src/routes/amadeusPlaces.js";
import { loadGeoData } from "./src/utils/geoData.js";
import paymentRoutes from "./src/routes/payment.js"
import promoRoutes from "./src/routes/promo.js"
import panierRoutes from "./src/routes/panier.js";
import userRoutes from "./src/routes/user.js";
import uploadRoutes from "./src/routes/upload.js";
import { authMiddleware } from "./src/middlewares/authMiddleware.js";

// Resevations
import ticketRoutes from "./src/routes/ticketRoutes.js";

const app = express();
const PORT = Number(process.env.PORT || 3005);

await loadGeoData();

// CORS strict avec cookies
const ALLOWED = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://horizons-plus.vercel.app",
  process.env.FRONT_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"], // Permet au navigateur de lire les cookies dans la réponse
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // Railway / Vercel
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cors(corsOptions));

// Parsers JSON AVANT Better Auth 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// logger dev
app.use((req, _res, next) => { console.log(req.method, req.path); next(); });


// rate limit SEULEMENT en production
if (process.env.NODE_ENV === "production") {
  app.use("/api/auth", rateLimit({ windowMs: 60_000, limit: 60 }));
}

// Pattern correct pour Better Auth
app.use("/api/auth", toNodeHandler(auth));

// introspection simple
app.get("/api/auth/_routes", (_req, res) => {
  const api = auth?.api ?? {};
  const list = Object.entries(api).map(([k, v]) => [k, !!v?.handleRequest]);
  res.json({ topLevel: list });
});


// Route protégée
app.get("/api/me", async (req, res) => {
  try {
    console.log("/api/me - Vérification session");
    
    const session = await auth.api.getSession({ 
      headers: fromNodeHeaders(req.headers) 
    });
    
    if (!session) {
      console.log("Pas de session valide");
      return res.status(401).json({ 
        error: "Unauthenticated",
        debug: process.env.NODE_ENV !== "production" ? {
          hasCookies: Object.keys(req.cookies || {}).length > 0,
          cookieNames: Object.keys(req.cookies || {}),
        } : undefined
      });
    }
    
    console.log("Session valide:", session.user.email);
    res.json({ user: session.user });
  } catch (error) {
    console.error("Erreur /api/me:", error);
    res.status(500).json({ error: error.message });
  }
});

// Feat : Autocomplétion
app.use("/api/search", amadeusPlaces);
app.use("/api/search", searchJourneys);
app.use("/api/search", searchPlaces);

app.use("/api/promo", promoRoutes);

app.use("/api/panier", panierRoutes);

// Feat : Payement  
app.use("/api/payments", paymentRoutes);

// Enregistrer numéro de téléphone de l'utilisateur
app.use("/api/users", userRoutes);

// Cloudinary - Changement de photo de profil
app.use('/api/upload', authMiddleware, uploadRoutes);

// Resevations
app.use("/api", ticketRoutes);

// Fichiers 
app.use('/public', express.static('public'));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Débug cookie mobile et desktop
app.get("/api/debug-cookies", (req, res) => {
  res.json({
    cookieHeader: req.headers.cookie || null,
    cookies: req.cookies || {},
  });
});

app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`));