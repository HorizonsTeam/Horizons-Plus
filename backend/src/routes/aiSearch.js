import express from "express";
import rateLimit from "express-rate-limit";
import { extractTravelQuery } from "../services/llm/groqClient.js";
import { resolvePlaceByName, resolvePlaceByCoords } from "../services/llm/resolvePlaces.js";

const router = express.Router();

const aiSearchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, réessayez dans 1 minute" },
});

router.post("/ai-search", aiSearchLimiter, async (req, res) => {
  try {
    const { query, userLocation, originOverride } = req.body || {};

    // 1. Validate input
    if (typeof query !== "string") {
      return res.status(400).json({ error: "query must be a string" });
    }
    const cleanedQuery = query.trim();
    if (cleanedQuery.length < 5 || cleanedQuery.length > 200) {
      return res.status(400).json({ error: "query length must be between 5 and 200" });
    }

    // 2. Call Groq
    let extracted;
    try {
      extracted = await extractTravelQuery(cleanedQuery);
    } catch (err) {
      console.error("Groq error:", err.message);
      return res.status(503).json({ error: "Service IA indisponible, réessayez plus tard" });
    }

    // 3. Resolve destination (required)
    if (!extracted.destination) {
      return res.status(422).json({ error: "Destination manquante dans votre phrase" });
    }
    const destPlace = await resolvePlaceByName(extracted.destination);
    if (!destPlace) {
      return res.status(422).json({ error: `Destination inconnue : ${extracted.destination}` });
    }

    // 4. Resolve origin (override > extracted > geoloc fallback)
    let originPlace = null;
    const overrideLat = Number(originOverride?.lat);
    const overrideLon = Number(originOverride?.lon);
    if (originOverride && originOverride.id && Number.isFinite(overrideLat) && Number.isFinite(overrideLon)) {
      // User picked an explicit origin via the inline fallback UI: skip resolution.
      originPlace = {
        id: originOverride.id,
        name: originOverride.name,
        lat: overrideLat,
        lon: overrideLon,
        source: originOverride.source || "sncf",
      };
    } else if (extracted.origin) {
      originPlace = await resolvePlaceByName(extracted.origin);
      if (!originPlace) {
        return res.status(422).json({ error: `Origine inconnue : ${extracted.origin}` });
      }
    } else if (userLocation && typeof userLocation.lat === "number" && typeof userLocation.lon === "number") {
      originPlace = await resolvePlaceByCoords(userLocation.lat, userLocation.lon);
    }

    if (!originPlace) {
      // Caller must prompt the user for an origin (frontend will show inline input).
      return res.status(422).json({
        error: "ORIGIN_REQUIRED",
        message: "Précisez votre ville de départ",
        interpreted: extracted,
      });
    }

    // 5. Force date to today if missing or in the past
    const today = new Date().toISOString().split("T")[0];
    let departureDate = extracted.date || today;
    if (departureDate < today) departureDate = today;

    // 6. Build final response
    return res.json({
      searchParams: {
        fromId: originPlace.id,
        fromName: originPlace.name,
        fromLat: originPlace.lat,
        fromLon: originPlace.lon,
        fromSource: originPlace.source,
        toId: destPlace.id,
        toName: destPlace.name,
        toLat: destPlace.lat,
        toLon: destPlace.lon,
        toSource: destPlace.source,
        departureDate,
        arrivalDate: "",
        passagers: 1,
        criteria: extracted.criteria || "",
      },
      interpreted: {
        type: extracted.type,
        origin: originPlace.name,
        destination: destPlace.name,
        date: departureDate,
        criteria: extracted.criteria,
        max_price: extracted.max_price,
        flexible_days: extracted.flexible_days,
      },
    });
  } catch (err) {
    console.error("Unexpected /ai-search error:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
