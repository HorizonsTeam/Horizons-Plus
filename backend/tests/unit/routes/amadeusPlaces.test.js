jest.mock("../../../src/amadeusClient.js", () => ({
  searchAirportsAndCities: jest.fn(),
}));

import request from "supertest";
import express from "express";
import router from "../../../src/routes/amadeusPlaces.js";
import { searchAirportsAndCities } from "../../../src/amadeusClient.js";

const app = express();
app.use(express.json());
app.use("/", router);

// --- fixtures ---
const fakeAmadeusResult = [
  {
    id: "CDG",
    name: "CHARLES DE GAULLE",
    subType: "AIRPORT",
    address: { countryCode: "FR" },
    geoCode: { latitude: 49.0097, longitude: 2.5479 },
  },
  {
    id: "PAR",
    name: "PARIS",
    subType: "CITY",
    address: { countryCode: "FR" },
    geoCode: { latitude: 48.8566, longitude: 2.3522 },
  },
];

describe("GET /airports", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validation de la requête", () => {
    it("retourne [] si q est absent", async () => {
      const res = await request(app).get("/airports");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(searchAirportsAndCities).not.toHaveBeenCalled();
    });
  });

  describe("cas nominal", () => {
    it("retourne la liste mappée avec les bons champs", async () => {
      searchAirportsAndCities.mockResolvedValue(fakeAmadeusResult);

      const res = await request(app).get("/airports?q=paris");

      expect(res.status).toBe(200);
      expect(searchAirportsAndCities).toHaveBeenCalledWith({
        keyword: "paris",
        subType: "AIRPORT,CITY",
      });
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        id: "CDG",
        name: "Charles De Gaulle",
        type: "airport",
        source: "amadeus",
        lat: 49.0097,
        lon: 2.5479,
      });
      expect(res.body[1]).toMatchObject({
        id: "PAR",
        name: "Paris",
        type: "city",
        source: "amadeus",
        lat: 48.8566,
        lon: 2.3522,
      });
    });

    it("capitalise correctement les noms avec tirets", async () => {
      searchAirportsAndCities.mockResolvedValue([
        {
          id: "LYS",
          name: "LYON-SAINT EXUPERY",
          subType: "AIRPORT",
          address: { countryCode: "FR" },
          geoCode: { latitude: 45.7256, longitude: 5.0811 },
        },
      ]);

      const res = await request(app).get("/airports?q=lyon");

      expect(res.status).toBe(200);
      expect(res.body[0].name).toBe("Lyon-Saint Exupery");
    });

    it("retourne [] si Amadeus retourne une liste vide", async () => {
      searchAirportsAndCities.mockResolvedValue([]);

      const res = await request(app).get("/airports?q=xyz");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("résout correctement le nom du pays depuis le countryCode", async () => {
      searchAirportsAndCities.mockResolvedValue([
        {
          id: "LHR",
          name: "HEATHROW",
          subType: "AIRPORT",
          address: { countryCode: "GB" },
          geoCode: { latitude: 51.477, longitude: -0.4543 },
        },
      ]);

      const res = await request(app).get("/airports?q=london");

      expect(res.status).toBe(200);
      expect(res.body[0].region).toBe("Royaume-Uni");
    });
  });

  describe("erreur serveur", () => {
    it("retourne 500 avec [] si searchAirportsAndCities lève une erreur", async () => {
      searchAirportsAndCities.mockRejectedValue(new Error("Amadeus down"));
      jest.spyOn(console, "error").mockImplementation(() => {});

      const res = await request(app).get("/airports?q=paris");

      expect(res.status).toBe(500);
      expect(res.body).toEqual([]);
    });
  });
});