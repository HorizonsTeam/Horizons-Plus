// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./dist/auth.js";
import searchRoutes from "./src/routes/search.js";
import { loadGeoData } from "./src/utils/geoData.js";

const app = express();
const PORT = Number(process.env.PORT || 3005);

await loadGeoData();

// CORS strict avec cookies
const ALLOWED = [
  process.env.FRONT_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://horizons-plus.vercel.app",
];

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

// Trust proxy pour production (Vercel/Railway)
app.set('trust proxy', true);

app.use(helmet());
app.use(cors(corsOptions));

// Parsers JSON AVANT Better Auth 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// logger dev
app.use((req, _res, next) => { console.log(req.method, req.path); next(); });

// rate limit sur l'auth
app.use("/api/auth", rateLimit({ windowMs: 60_000, limit: 60 }));

// Pattern correct pour Better Auth
app.use("/api/auth/*", toNodeHandler(auth));

// introspection simple
app.get("/api/auth/_routes", (_req, res) => {
  const api = auth?.api ?? {};
  const list = Object.entries(api).map(([k, v]) => [k, !!v?.handleRequest]);
  res.json({ topLevel: list });
});


// Route protégée
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return res.status(401).json({ error: "Unauthenticated" });
  res.json({ user: session.user });
});

app.use("/api/search", searchRoutes);

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`));