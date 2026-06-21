jest.mock("../../../src/services/llm/groqClient.js", () => ({
  extractTravelQuery: jest.fn(),
}));

jest.mock("../../../src/services/llm/resolvePlaces.js", () => ({
  resolvePlaceByName: jest.fn(),
  resolvePlaceByCoords: jest.fn(),
}));

jest.mock("express-rate-limit", () => () => (req, res, next) => next());

import request from "supertest";
import express from "express";
import router from "../../../src/routes/aiSearch.js";
import { extractTravelQuery } from "../../../src/services/llm/groqClient.js";
import { resolvePlaceByName, resolvePlaceByCoords } from "../../../src/services/llm/resolvePlaces.js";

// --- app de test ---
const app = express();
app.use(express.json());
app.use("/", router);

// --- fixtures ---
const fakeDestPlace = {
  id: "stop_area:SNCF:87722025",
  name: "Marseille Saint-Charles",
  lat: 43.3026,
  lon: 5.3809,
  source: "sncf",
};

const fakeOriginPlace = {
  id: "stop_area:SNCF:87271007",
  name: "Paris Gare de Lyon",
  lat: 48.8448,
  lon: 2.3735,
  source: "sncf",
};

const fakeExtracted = {
  type: "aller_simple",
  origin: "Paris",
  destination: "Marseille",
  date: "2027-01-15",
  criteria: "pas_cher",
  max_price: null,
  flexible_days: 0,
};

describe("POST /ai-search", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- validation input ---
  describe("validation de la requête", () => {
    it("retourne 400 si query n'est pas une string", async () => {
      const res = await request(app)
        .post("/ai-search")
        .send({ query: 123 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("query must be a string");
    });

    it("retourne 400 si query est trop courte (< 5 chars)", async () => {
      const res = await request(app)
        .post("/ai-search")
        .send({ query: "hi" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/length must be between/);
    });

    it("retourne 400 si query est trop longue (> 200 chars)", async () => {
      const res = await request(app)
        .post("/ai-search")
        .send({ query: "a".repeat(201) });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/length must be between/);
    });
  });

  // --- erreurs Groq ---
  describe("erreurs Groq", () => {
    it("retourne 503 si extractTravelQuery lève une erreur", async () => {
      extractTravelQuery.mockRejectedValue(new Error("API down"));

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux aller à Marseille" });

      expect(res.status).toBe(503);
      expect(res.body.error).toMatch(/indisponible/);
    });
  });

  // --- destination manquante / inconnue ---
  describe("résolution de destination", () => {
    it("retourne 422 si destination absente dans l'extraction", async () => {
      extractTravelQuery.mockResolvedValue({ ...fakeExtracted, destination: null });

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux voyager quelque part" });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/Destination manquante/);
    });

    it("retourne 422 si resolvePlaceByName retourne null pour la destination", async () => {
      extractTravelQuery.mockResolvedValue(fakeExtracted);
      resolvePlaceByName.mockResolvedValue(null);

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux aller à Marseille" });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/Destination inconnue/);
    });
  });

  // --- résolution d'origine ---
  describe("résolution d'origine", () => {
    it("retourne 422 si origin extraite est inconnue", async () => {
      extractTravelQuery.mockResolvedValue(fakeExtracted);
      resolvePlaceByName
        .mockResolvedValueOnce(fakeDestPlace) // destination OK
        .mockResolvedValueOnce(null);          // origin KO

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux aller à Marseille depuis Paris" });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/Origine inconnue/);
    });

    it("retourne 422 ORIGIN_REQUIRED si ni origin ni userLocation", async () => {
      extractTravelQuery.mockResolvedValue({ ...fakeExtracted, origin: null });
      resolvePlaceByName.mockResolvedValue(fakeDestPlace);

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux aller à Marseille" });

      expect(res.status).toBe(422);
      expect(res.body.error).toBe("ORIGIN_REQUIRED");
      expect(res.body.interpreted).toBeDefined();
    });

    it("utilise userLocation si pas d'origin extraite", async () => {
      extractTravelQuery.mockResolvedValue({ ...fakeExtracted, origin: null });
      resolvePlaceByName.mockResolvedValue(fakeDestPlace);
      resolvePlaceByCoords.mockResolvedValue(fakeOriginPlace);

      const res = await request(app)
        .post("/ai-search")
        .send({
          query: "Je veux aller à Marseille",
          userLocation: { lat: 48.8566, lon: 2.3522 },
        });

      expect(res.status).toBe(200);
      expect(resolvePlaceByCoords).toHaveBeenCalledWith(48.8566, 2.3522);
      expect(res.body.searchParams.fromName).toBe("Paris Gare de Lyon");
    });

    it("utilise originOverride si fourni et valide", async () => {
      extractTravelQuery.mockResolvedValue({ ...fakeExtracted, origin: null });
      resolvePlaceByName.mockResolvedValue(fakeDestPlace);

      const res = await request(app)
        .post("/ai-search")
        .send({
          query: "Je veux aller à Marseille",
          originOverride: {
            id: "stop_area:SNCF:87271007",
            name: "Paris Gare de Lyon",
            lat: 48.8448,
            lon: 2.3735,
            source: "sncf",
          },
        });

      expect(res.status).toBe(200);
      expect(resolvePlaceByCoords).not.toHaveBeenCalled();
      expect(res.body.searchParams.fromName).toBe("Paris Gare de Lyon");
    });
  });

  // --- cas nominal ---
  describe("cas nominal", () => {
    it("retourne 200 avec searchParams et interpreted corrects", async () => {
      extractTravelQuery.mockResolvedValue(fakeExtracted);
      resolvePlaceByName
        .mockResolvedValueOnce(fakeDestPlace)
        .mockResolvedValueOnce(fakeOriginPlace);

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux aller à Marseille depuis Paris le 15 janvier" });

      expect(res.status).toBe(200);
      expect(res.body.searchParams).toMatchObject({
        fromId: fakeOriginPlace.id,
        fromName: fakeOriginPlace.name,
        toId: fakeDestPlace.id,
        toName: fakeDestPlace.name,
        departureDate: "2027-01-15",
        passagers: 1,
      });
      expect(res.body.interpreted).toMatchObject({
        origin: fakeOriginPlace.name,
        destination: fakeDestPlace.name,
        date: "2027-01-15",
      });
    });

    it("remplace une date passée par aujourd'hui", async () => {
      extractTravelQuery.mockResolvedValue({ ...fakeExtracted, date: "2000-01-01" });
      resolvePlaceByName
        .mockResolvedValueOnce(fakeDestPlace)
        .mockResolvedValueOnce(fakeOriginPlace);

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux aller à Marseille depuis Paris" });

      const today = new Date().toISOString().split("T")[0];
      expect(res.status).toBe(200);
      expect(res.body.searchParams.departureDate).toBe(today);
    });

    it("utilise aujourd'hui si date absente", async () => {
      extractTravelQuery.mockResolvedValue({ ...fakeExtracted, date: null });
      resolvePlaceByName
        .mockResolvedValueOnce(fakeDestPlace)
        .mockResolvedValueOnce(fakeOriginPlace);

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux aller à Marseille depuis Paris" });

      const today = new Date().toISOString().split("T")[0];
      expect(res.status).toBe(200);
      expect(res.body.searchParams.departureDate).toBe(today);
    });
  });

  // --- erreur inattendue ---
  describe("erreur serveur", () => {
    it("retourne 500 si une erreur inattendue survient", async () => {
      extractTravelQuery.mockResolvedValue(fakeExtracted);
      resolvePlaceByName.mockRejectedValue(new Error("Unexpected crash"));

      const res = await request(app)
        .post("/ai-search")
        .send({ query: "Je veux aller à Marseille depuis Paris" });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erreur serveur");
    });
  });
});