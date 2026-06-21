jest.mock("../../../src/utils/geoData.js", () => ({
  getRegionByInsee: jest.fn(),
}));

import request from "supertest";
import express from "express";
import router from "../../../src/routes/searchPlaces.js";
import { getRegionByInsee } from "../../../src/utils/geoData.js";

const app = express();
app.use(express.json());
app.use("/", router);

// --- fixtures ---
const makeStopArea = (overrides = {}) => ({
  id: "stop_area:SNCF:87271007",
  name: "Paris Gare de Lyon (Paris)",
  embedded_type: "stop_area",
  stop_area: {
    coord: { lat: 48.8448, lon: 2.3735 },
    administrative_regions: [{ insee: "75056" }],
  },
  ...overrides,
});

const makeAdminRegion = (overrides = {}) => ({
  id: "admin:fr:75056",
  name: "Paris",
  embedded_type: "administrative_region",
  administrative_region: {
    coord: { lat: 48.8566, lon: 2.3522 },
    insee: "75056",
  },
  ...overrides,
});

const makeOther = () => ({
  id: "poi:abc",
  name: "Hôtel de Ville",
  embedded_type: "poi",
});

let fetchSpy;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  getRegionByInsee.mockReturnValue("Île-de-France");
  fetchSpy = jest.spyOn(global, "fetch");
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("GET /stations", () => {
  // --- validation ---
  describe("validation", () => {
    it("retourne [] si q est absent", async () => {
      const res = await request(app).get("/stations");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(fetchSpy).not.toHaveBeenCalled(); // ✅ spy au lieu de toBeUndefined
    });
  });

  // --- stop_area ---
  describe("type stop_area", () => {
    it("mappe correctement un stop_area", async () => {
      fetchSpy.mockResolvedValue({
        json: () => Promise.resolve({ places: [makeStopArea()] }),
      });

      const res = await request(app).get("/stations").query({ q: "paris" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({
        id: "stop_area:SNCF:87271007",
        name: "Paris Gare de Lyon",
        type: "stop_area",
        region: "Île-de-France",
        source: "sncf",
        lat: 48.8448,
        lon: 2.3735,
      });
    });

    it("appelle getRegionByInsee avec le bon code insee", async () => {
      fetchSpy.mockResolvedValue({
        json: () => Promise.resolve({ places: [makeStopArea()] }),
      });

      await request(app).get("/stations").query({ q: "paris" });

      expect(getRegionByInsee).toHaveBeenCalledWith("75056");
    });

    it("retourne 'Hors France' si administrative_regions est absent", async () => {
      const place = makeStopArea();
      place.stop_area.administrative_regions = [];

      fetchSpy.mockResolvedValue({
        json: () => Promise.resolve({ places: [place] }),
      });

      const res = await request(app).get("/stations").query({ q: "paris" });

      expect(res.body[0].region).toBe("Hors France");
      expect(getRegionByInsee).not.toHaveBeenCalled();
    });
  });

  // --- administrative_region ---
  describe("type administrative_region", () => {
    it("mappe correctement une administrative_region", async () => {
      fetchSpy.mockResolvedValue({
        json: () => Promise.resolve({ places: [makeAdminRegion()] }),
      });

      const res = await request(app).get("/stations").query({ q: "paris" });

      expect(res.status).toBe(200);
      expect(res.body[0]).toMatchObject({
        id: "admin:fr:75056",
        name: "Paris",
        type: "city",
        region: "Île-de-France",
        source: "sncf",
        lat: 48.8566,
        lon: 2.3522,
      });
    });

    it("retourne 'Hors France' si insee est absent", async () => {
      const place = makeAdminRegion();
      delete place.administrative_region.insee;

      fetchSpy.mockResolvedValue({
        json: () => Promise.resolve({ places: [place] }),
      });

      const res = await request(app).get("/stations").query({ q: "paris" });

      expect(res.body[0].region).toBe("Hors France");
    });
  });

  // --- type inconnu ---
  describe("type inconnu (other)", () => {
    it("mappe avec type 'other' et lat/lon à 0", async () => {
      fetchSpy.mockResolvedValue({
        json: () => Promise.resolve({ places: [makeOther()] }),
      });

      const res = await request(app).get("/stations").query({ q: "hotel" });

      expect(res.body[0]).toMatchObject({
        id: "poi:abc",
        name: "Hôtel de Ville",
        type: "other",
        region: null,
        source: "sncf",
        lat: 0,
        lon: 0,
      });
    });
  });

  // --- nettoyage du nom ---
  describe("nettoyage du nom", () => {
    it("supprime les parenthèses du nom", async () => {
      fetchSpy.mockResolvedValue({
        json: () =>
          Promise.resolve({ places: [makeStopArea({ name: "Lyon (Rhône)" })] }),
      });

      const res = await request(app).get("/stations").query({ q: "lyon" });

      expect(res.body[0].name).toBe("Lyon");
    });

    it("ne modifie pas un nom sans parenthèses", async () => {
      fetchSpy.mockResolvedValue({
        json: () =>
          Promise.resolve({ places: [makeStopArea({ name: "Marseille" })] }),
      });

      const res = await request(app).get("/stations").query({ q: "marseille" });

      expect(res.body[0].name).toBe("Marseille");
    });
  });

  // --- cas limites ---
  describe("cas limites", () => {
    it("retourne [] si data.places est absent", async () => {
      fetchSpy.mockResolvedValue({
        json: () => Promise.resolve({}),
      });

      const res = await request(app).get("/stations").query({ q: "xyz" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("retourne [] si data.places est un tableau vide", async () => {
      fetchSpy.mockResolvedValue({
        json: () => Promise.resolve({ places: [] }),
      });

      const res = await request(app).get("/stations").query({ q: "xyz" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("mappe plusieurs places en une seule réponse", async () => {
      fetchSpy.mockResolvedValue({
        json: () =>
          Promise.resolve({
            places: [makeStopArea(), makeAdminRegion(), makeOther()],
          }),
      });

      const res = await request(app).get("/stations").query({ q: "paris" });

      expect(res.body).toHaveLength(3);
      expect(res.body.map((p) => p.type)).toEqual(["stop_area", "city", "other"]);
    });
  });

  // --- erreur ---
  describe("erreur serveur", () => {
    it("retourne 500 avec [] si fetch lève une erreur", async () => {
      fetchSpy.mockRejectedValue(new Error("Network error"));

      const res = await request(app).get("/stations").query({ q: "paris" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual([]);
    });

    it("retourne 500 avec [] si response.json() lève une erreur", async () => {
      fetchSpy.mockResolvedValue({
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      const res = await request(app).get("/stations").query({ q: "paris" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual([]);
    });
  });
});