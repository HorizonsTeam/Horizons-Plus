jest.mock("../../../src/utils/time.js", () => ({
  formatDuration: jest.fn(() => "2h30"),
}));

jest.mock("../../../src/utils/price.js", () => ({
  calculerPrixFictif: jest.fn(() => "42.00"),
}));

jest.mock("../../../src/services/journey/journey.analyzer.js", () => ({
  analyzeJourney: jest.fn(() => 0),
  computeJourneyDistanceMeters: jest.fn(() => 500000),
}));

jest.mock("../../../src/services/journey/journey.factory.js", () => ({
  generationJourneysFictif: jest.fn(() => [{ simulated: true, departureTime: "09:00" }]),
}));

jest.mock("../../../src/services/journey/journey.parser.js", () => ({
  parseJourneySections: jest.fn(() => ({ stops: [], legs: [] })),
}));

jest.mock("../../../src/utils/config.js", () => ({
  shouldGenerateFlightAlternative: jest.fn(() => false),
}));

import request from "supertest";
import express from "express";
import router from "../../../src/routes/searchJourneys.js";
import { generationJourneysFictif } from "../../../src/services/journey/journey.factory.js";
import { shouldGenerateFlightAlternative } from "../../../src/utils/config.js";
import { calculerPrixFictif } from "../../../src/utils/price.js";
import { formatDuration } from "../../../src/utils/time.js";
import { parseJourneySections } from "../../../src/services/journey/journey.parser.js";
import { analyzeJourney, computeJourneyDistanceMeters } from "../../../src/services/journey/journey.analyzer.js";

const app = express();
app.use(express.json());
app.use("/", router);

// --- fixtures ---
const baseQuery = {
  fromId: "stop_area:SNCF:87271007",
  fromName: "Paris",
  toId: "stop_area:SNCF:87722025",
  toName: "Marseille",
  datetime: "20270115T100000",
  fromLat: "48.8448",
  fromLon: "2.3735",
  toLat: "43.3026",
  toLon: "5.3809",
  fromSource: "sncf",
  toSource: "sncf",
};

const makeSncfJourney = (overrides = {}) => ({
  departure_date_time: "20270115T100000",
  arrival_date_time: "20270115T123000",
  duration: 9000,
  fare: { total: { value: 4990 } },
  sections: [
    {
      type: "public_transport",
      from: { stop_area: { name: "Paris Gare de Lyon" } },
      to: { stop_area: { name: "Marseille Saint-Charles" } },
      display_informations: { physical_mode: "TGV" },
    },
  ],
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  shouldGenerateFlightAlternative.mockReturnValue(false);
  generationJourneysFictif.mockReturnValue([{ simulated: true, departureTime: "09:00" }]);
  formatDuration.mockReturnValue("2h30");
  calculerPrixFictif.mockReturnValue("42.00");
  analyzeJourney.mockReturnValue(0);
  computeJourneyDistanceMeters.mockReturnValue(500000);
  parseJourneySections.mockReturnValue({ stops: [], legs: [] });
});

afterEach(() => {
  jest.restoreAllMocks();
  global.fetch = undefined;
});

// ------------------------------------------------ validation
describe("GET /journeys - validation", () => {
  it("retourne 400 si un paramètre est manquant", async () => {
    const { fromId, ...incomplete } = baseQuery;

    const res = await request(app).get("/journeys").query(incomplete);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required parameters");
  });

  it("retourne 400 si tous les paramètres sont absents", async () => {
    const res = await request(app).get("/journeys");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required parameters");
  });
});

// ------------------------------------------------ CAS 1A : erreur API SNCF réelle
describe("GET /journeys - CAS 1A : erreur API SNCF", () => {
  it("retourne les journeys fictifs si l'API SNCF retourne une erreur non-no_solution", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ error: { id: "internal_error" } }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.status).toBe(200);
    expect(generationJourneysFictif).toHaveBeenCalledWith({
      from: { name: "Paris", lat: 48.8448, lon: 2.3735, source: "sncf" },
      to: { name: "Marseille", lat: 43.3026, lon: 5.3809, source: "sncf" },
    });
    expect(res.body[0].simulated).toBe(true);
  });
});

// ------------------------------------------------ CAS 1B : no_solution
describe("GET /journeys - CAS 1B : no_solution", () => {
  it("retourne [] si l'API SNCF retourne no_solution", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ error: { id: "no_solution" } }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(generationJourneysFictif).not.toHaveBeenCalled();
  });
});

// ------------------------------------------------ CAS 1C : journeys vide
describe("GET /journeys - CAS 1C : journeys vide", () => {
  it("retourne [] si journeys est absent", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("retourne [] si journeys est un tableau vide", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ journeys: [] }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ------------------------------------------------ CAS 2 : mapping SNCF
describe("GET /journeys - CAS 2 : mapping des journeys SNCF", () => {
  it("mappe correctement un journey avec prix réel", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ journeys: [makeSncfJourney()] }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      departureName: "Paris Gare de Lyon",
      arrivalName: "Marseille Saint-Charles",
      price: "49.90",
      departureTime: "10:00",
      arrivalTime: "12:30",
      duration: "2h30",
      numberOfTransfers: 0,
      simulated: false,
    });
  });

  it("utilise calculerPrixFictif si fare.total.value est 0", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          journeys: [makeSncfJourney({ fare: { total: { value: 0 } } })],
        }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(calculerPrixFictif).toHaveBeenCalled();
    expect(res.body[0].price).toBe("42.00");
  });

  it("utilise calculerPrixFictif si fare est absent", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          journeys: [makeSncfJourney({ fare: undefined })],
        }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(calculerPrixFictif).toHaveBeenCalled();
  });

  it("utilise 'TER' comme trainType si display_informations est absent", async () => {
    const journey = makeSncfJourney({ fare: undefined }); // ← force prix fictif
    delete journey.sections[0].display_informations;

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ journeys: [journey] }),
    });

    await request(app).get("/journeys").query(baseQuery);

    expect(calculerPrixFictif).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      "TER"
    );
  });

  it("résout departureName depuis administrative_region si stop_area absent", async () => {
    const journey = makeSncfJourney();
    journey.sections[0].from = { administrative_region: { name: "Île-de-France" } };

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ journeys: [journey] }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.body[0].departureName).toBe("Île-de-France");
  });

  it("mappe plusieurs journeys", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ journeys: [makeSncfJourney(), makeSncfJourney()] }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.body).toHaveLength(2);
  });
});

// ------------------------------------------------ CAS 3 : vols fictifs
describe("GET /journeys - CAS 3 : ajout vols fictifs", () => {
  it("ajoute les vols fictifs et trie par heure si shouldGenerateFlightAlternative est true", async () => {
    shouldGenerateFlightAlternative.mockReturnValue(true);
    generationJourneysFictif.mockReturnValue([
      { simulated: true, departureTime: "08:00" },
    ]);

    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          journeys: [
            makeSncfJourney({ departure_date_time: "20270115T100000" }),
          ],
        }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    // vol 08:00 avant train 10:00
    expect(res.body[0].departureTime).toBe("08:00");
    expect(res.body[1].departureTime).toBe("10:00");
  });

  it("appelle generationJourneysFictif avec source amadeus pour les vols", async () => {
    shouldGenerateFlightAlternative.mockReturnValue(true);

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ journeys: [makeSncfJourney()] }),
    });

    await request(app).get("/journeys").query(baseQuery);

    expect(generationJourneysFictif).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.objectContaining({ source: "amadeus" }),
        to: expect.objectContaining({ source: "amadeus" }),
      })
    );
  });

  it("ne génère pas de vols si shouldGenerateFlightAlternative est false", async () => {
    shouldGenerateFlightAlternative.mockReturnValue(false);

    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ journeys: [makeSncfJourney()] }),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.body).toHaveLength(1);
    expect(generationJourneysFictif).not.toHaveBeenCalled();
  });
});

// ------------------------------------------------ erreur inattendue
describe("GET /journeys - erreur inattendue", () => {
  it("retourne 500 si fetch lève une erreur", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("API SNCF error");
  });

  it("retourne 500 si response.json() lève une erreur", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.reject(new Error("Invalid JSON")),
    });

    const res = await request(app).get("/journeys").query(baseQuery);

    expect(res.status).toBe(500);
  });
});