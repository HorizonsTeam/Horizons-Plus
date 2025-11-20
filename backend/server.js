// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./dist/auth.js";
import searchRoutes from "./src/routes/search.js";
import { loadGeoData } from "./src/utils/geoData.js";

const app = express();
const PORT = Number(process.env.PORT || 3005);

await loadGeoData();

/* --------------------------------------------------------
   🚨 CORS DOIT ÊTRE AVANT TOUT, AVANT HELMET, AVANT AUTH
--------------------------------------------------------- */

app.set("trust proxy", 1); // important en production

app.use(cors({
  origin: [
    "https://horizons-plus.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

/* ------------------------------------------------------
   Middlewares
------------------------------------------------------- */

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, _res, next) => {
  console.log(req.method, req.path);
  next();
});

/* ------------------------------------------------------
   🚨 PAS DE RATE LIMIT SUR /api/auth → CASSERA OPTIONS
------------------------------------------------------- */

/* ------------------------------------------------------
   MOUNT BETTER AUTH
------------------------------------------------------- */
app.all("/api/auth/*", toNodeHandler(auth));

/* ------------------------------------------------------
   Test des routes Better Auth
------------------------------------------------------- */
app.get("/api/auth/_routes", (_req, res) => {
  const api = auth?.api ?? {};
  const list = Object.entries(api).map(([k, v]) => [
    k,
    !!v?.handleRequest,
  ]);
  res.json({ topLevel: list });
});

app.get("/api/me", async (req, res) => {
  try {
    console.log("/api/me - Vérification session");

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      console.log("Pas de session valide");
      return res.status(401).json({ error: "Unauthenticated" });
    }

    console.log("Session valide:", session.user.email);
    res.json({ user: session.user });
  } catch (error) {
    console.error("Erreur /api/me:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ------------------------------------------------------ */

app.use("/api/search", searchRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () =>
  console.log(`API ready → http://localhost:${PORT}`)
);
