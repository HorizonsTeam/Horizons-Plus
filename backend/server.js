// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "./dist/auth.js";

const app = express();
const PORT = Number(process.env.PORT || 3005);

// CORS strict avec cookies
const ALLOWED = [
  process.env.FRONT_ORIGIN || "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",     
  "http://127.0.0.1:5173",
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);          // Postman/cURL
    if (ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};

// Ordre des middlewares (important)
app.use(helmet());
app.use(cors(corsOptions));

// rate limit sur l'auth
app.use("/api/auth", rateLimit({ windowMs: 60_000, limit: 60 }));

// Monte Better Auth → expose /api/auth/*
app.use("/api/auth", toNodeHandler(auth));

app.use(cookieParser());
app.use(express.json());



// Exemple de route protégée
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return res.status(401).json({ error: "Unauthenticated" });
  res.json({ user: session.user });
});

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`));
