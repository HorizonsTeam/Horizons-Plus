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
    if (!origin) return cb(null, true);            // Postman/cURL
    if (ALLOWED.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};

// Ordre des middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

//  logger dev
app.use((req, _res, next) => { console.log(req.method, req.path); next(); });

// rate limit sur l'auth
app.use("/api/auth", rateLimit({ windowMs: 60_000, limit: 60 }));

app.get("/api/auth/_routes", (_req, res) => {
  const api = auth.api || {};
  const list = Object.entries(api).map(([k, v]) => [k, typeof v?.handleRequest === "function"]);
  // on tente aussi d'inspecter les sous-espaces (ex: api.password?.forgot?.emailLink)
  const deep = {};
  if (api.password) {
    deep.password = Object.fromEntries(
      Object.entries(api.password).map(([k, v]) => [k, typeof v?.handleRequest === "function"])
    );
  }
  res.json({ topLevel: list, deep });
});

// ✅ route compat: envoi du lien de reset, quelle que soit la version du handler
app.post("/api/auth/forgot-password/email-link", async (req, res) => {
  try {
    // redirectTo défaut → page front /reset-password
    req.body.redirectTo ??= `${process.env.FRONT_URL || "http://localhost:5173"}/reset-password`;

    // On essaie les différentes signatures de versions
    const h =
      auth.api?.forgotPasswordEmailLink                 // vX
      ?? auth.api?.password?.forgotPasswordEmailLink    // vY
      ?? auth.api?.password?.forgot?.emailLink;         // vZ (plus “moderne”)

    if (!h?.handleRequest) {
      console.error("[forgot] aucun handler trouvé dans auth.api.*");
      return res.status(500).json({ error: "Forgot-password handler missing in this Better Auth version." });
    }
    await h.handleRequest(req, res);
  } catch (err) {
    console.error("forgot-password error:", err);
    // Réponse neutre (anti-énumération)
    res.status(200).json({
      message: "Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.",
    });
  }
});

// ✅ route compat: finaliser le reset, quelle que soit la version du handler
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const h =
      auth.api?.resetPassword                // vX
      ?? auth.api?.password?.reset;          // vZ

    if (!h?.handleRequest) {
      console.error("[reset] aucun handler trouvé dans auth.api.*");
      return res.status(500).json({ error: "Reset-password handler missing in this Better Auth version." });
    }
    await h.handleRequest(req, res);
  } catch (err) {
    console.error("reset-password error:", err);
    res.status(400).json({ error: "Lien invalide ou expiré." });
  }
});

app.get("/api/auth/_routes", (_req, res) => {
  const api = (auth && auth.api) ? auth.api : {};
  const safeEntry = (obj) => {
    try {
      if (!obj || typeof obj !== "object") return [];
      return Object.entries(obj).map(([k, v]) => [k, !!(v && typeof v.handleRequest === "function")]);
    } catch {
      return [];
    }
  };

  const topLevel = safeEntry(api);
  const deep = {};

  // inspection prudente des sous-espaces possibles
  for (const k of Object.keys(api || {})) {
    try {
      const sub = api[k];
      if (sub && typeof sub === "object") {
        deep[k] = safeEntry(sub);
      }
    } catch { /* ignore */ }
  }

  res.json({ topLevel, deep });
});

// ✅ Compat: envoi du lien reset (teste plusieurs emplacements de handler)
app.post("/api/auth/forgot-password/email-link", async (req, res) => {
  try {
    req.body.redirectTo ??=
      `${process.env.FRONT_URL || "http://localhost:5173"}/reset-password`;

    const candidates = [
      auth?.api?.forgotPasswordEmailLink,              // ex. v1
      auth?.api?.password?.forgotPasswordEmailLink,    // ex. v2
      auth?.api?.password?.forgot?.emailLink,          // ex. v3 (plus récent)
      auth?.api?.forgotPassword?.emailLink,            // variante
    ].filter(Boolean);

    const h = candidates.find((x) => typeof x?.handleRequest === "function");
    if (!h) {
      console.error("[forgot] aucun handler trouvé dans auth.api.*");
      return res.status(500).json({ error: "Forgot-password handler missing in this Better Auth version." });
    }
    await h.handleRequest(req, res);
  } catch (err) {
    console.error("forgot-password error:", err);
    // Réponse neutre (anti-énumération)
    res.status(200).json({
      message: "Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.",
    });
  }
});

// ✅ Compat: finaliser le reset (teste plusieurs emplacements de handler)
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const candidates = [
      auth?.api?.resetPassword,               // ex. v1
      auth?.api?.password?.reset,            // ex. v3
      auth?.api?.reset?.password,            // autre variante
    ].filter(Boolean);

    const h = candidates.find((x) => typeof x?.handleRequest === "function");
    if (!h) {
      console.error("[reset] aucun handler trouvé dans auth.api.*");
      return res.status(500).json({ error: "Reset-password handler missing in this Better Auth version." });
    }
    await h.handleRequest(req, res);
  } catch (err) {
    console.error("reset-password error:", err);
    res.status(400).json({ error: "Lien invalide ou expiré." });
  }
});

// Monte tous les autres endpoints Better Auth sous /api/auth
app.use("/api/auth", toNodeHandler(auth));


// Exemple de route protégée
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return res.status(401).json({ error: "Unauthenticated" });
  res.json({ user: session.user });
});

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`));
