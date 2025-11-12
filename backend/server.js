// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./dist/auth.js"; // export default depuis ton build

const app = express();
const PORT = Number(process.env.PORT || 3005);

// CORS strict avec cookies
const ALLOWED = [
  process.env.FRONT_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // Postman/cURL
    if (ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Ordre des middlewares
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());

// logger dev
app.use((req, _res, next) => { console.log(req.method, req.path); next(); });

// rate limit sur l'auth
app.use("/api/auth", rateLimit({ windowMs: 60_000, limit: 60 }));

// Monte Better Auth ici (base path) — IMPORTANT: avant express.json()
app.use("/api/auth", toNodeHandler(auth));

// introspection simple
app.get("/api/auth/_routes", (_req, res) => {
  const api = auth?.api ?? {};
  const list = Object.entries(api).map(([k, v]) => [k, !!v?.handleRequest]);
  res.json({ topLevel: list });
});

app.use(express.json());

// Exemple de route protégée
app.get("/api/me", async (req, res) => {
  try {
    // 🔹 Étape 1 : si un header Authorization existe, on teste le token JWT
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
      try {
        const session = await auth.api.verifyJWT({ token });
        if (session?.user) {
          return res.json({ user: session.user });
        }
      } catch (err) {
        console.warn("⚠️ JWT invalide ou expiré:", err?.message);
        // on continue pour tester le cookie ensuite
      }
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });


    if (!session) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    res.json({ user: session.user });
  } catch (err) {
    console.error("Erreur /api/me:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`));
