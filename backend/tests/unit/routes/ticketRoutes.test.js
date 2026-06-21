jest.mock("../../../src/db.js", () => ({
  pool: { query: jest.fn() },
}));

jest.mock("../../../src/services/ticketService.js", () => ({
  generateTicketPDF: jest.fn(),
}));

jest.mock("../../../src/middlewares/authMiddleware.js", () => ({
  authMiddleware: (req, res, next) => {
    req.userId = req.headers["x-user-id"] || null;
    next();
  },
}));

import request from "supertest";
import express from "express";
import router from "../../../src/routes/ticketRoutes.js";
import { pool } from "../../../src/db.js";
import { generateTicketPDF } from "../../../src/services/ticketService.js";

const app = express();
app.use(express.json());
app.use("/", router);

// --- fixtures ---
const asUser = { "x-user-id": "user-123" };

const fakeReservation = {
  ticket_id: "TICKET-123",
  user_id: "user-123",
  customer_name: "Alice",
  journey: "Paris → Lyon",
  date: "2027-01-15",
  time: "10:00",
  passengers: 1,
  price: 49.9,
  status: "confirmed",
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ------------------------------------------------ GET /reservations
describe("GET /reservations", () => {
  describe("validation", () => {
    it("retourne 401 si userId est absent", async () => {
      const res = await request(app).get("/reservations"); // pas de header

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Non authentifié");
      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe("cas nominal", () => {
    it("retourne les réservations de l'utilisateur", async () => {
      pool.query.mockResolvedValue({ rows: [fakeReservation] });

      const res = await request(app).get("/reservations").set(asUser);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ reservations: [fakeReservation] });
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE user_id = $1"),
        ["user-123"]
      );
    });

    it("retourne un tableau vide si aucune réservation", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const res = await request(app).get("/reservations").set(asUser);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ reservations: [] });
    });

    it("retourne plusieurs réservations triées par date DESC", async () => {
      const reservations = [
        { ...fakeReservation, ticket_id: "TICKET-2", date: "2027-02-01" },
        { ...fakeReservation, ticket_id: "TICKET-1", date: "2027-01-15" },
      ];
      pool.query.mockResolvedValue({ rows: reservations });

      const res = await request(app).get("/reservations").set(asUser);

      expect(res.status).toBe(200);
      expect(res.body.reservations).toHaveLength(2);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY date DESC"),
        expect.any(Array)
      );
    });
  });

  describe("erreur serveur", () => {
    it("retourne 500 si pool.query lève une erreur", async () => {
      pool.query.mockRejectedValue(new Error("DB crash"));

      const res = await request(app).get("/reservations").set(asUser);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DB crash");
    });
  });
});

// ------------------------------------------------ GET /ticket/download/:ticketId
describe("GET /ticket/download/:ticketId", () => {
  describe("validation", () => {
    it("retourne 401 si userId est absent", async () => {
      const res = await request(app).get("/ticket/download/TICKET-123");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Non authentifié");
      expect(pool.query).not.toHaveBeenCalled();
    });

    it("retourne 404 si la réservation n'existe pas", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const res = await request(app)
        .get("/ticket/download/TICKET-INCONNU")
        .set(asUser);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Réservation non trouvée");
      expect(generateTicketPDF).not.toHaveBeenCalled();
    });
  });

  describe("cas nominal", () => {
    it("retourne un PDF avec les bons headers", async () => {
      pool.query.mockResolvedValue({ rows: [fakeReservation] });
      generateTicketPDF.mockResolvedValue(Buffer.from("pdf-content"));

      const res = await request(app)
        .get("/ticket/download/TICKET-123")
        .set(asUser);

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/application\/pdf/);
      expect(res.headers["content-disposition"]).toBe(
        'attachment; filename="billet_TICKET-123.pdf"'
      );
    });

    it("appelle pool.query avec ticketId et userId", async () => {
      pool.query.mockResolvedValue({ rows: [fakeReservation] });
      generateTicketPDF.mockResolvedValue(Buffer.from("pdf"));

      await request(app)
        .get("/ticket/download/TICKET-123")
        .set(asUser);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE ticket_id = $1 AND user_id = $2"),
        ["TICKET-123", "user-123"]
      );
    });

    it("appelle generateTicketPDF avec les bonnes infos du ticket", async () => {
      pool.query.mockResolvedValue({ rows: [fakeReservation] });
      generateTicketPDF.mockResolvedValue(Buffer.from("pdf"));

      await request(app)
        .get("/ticket/download/TICKET-123")
        .set(asUser);

      expect(generateTicketPDF).toHaveBeenCalledWith({
        ticketId: "TICKET-123",
        customerName: "Alice",
        journey: "Paris → Lyon",
        date: "2027-01-15",
        time: "10:00",
        passengers: 1,
        price: 49.9,
      });
    });
  });

  describe("erreur serveur", () => {
    it("retourne 500 si pool.query lève une erreur", async () => {
      pool.query.mockRejectedValue(new Error("DB crash"));

      const res = await request(app)
        .get("/ticket/download/TICKET-123")
        .set(asUser);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DB crash");
    });

    it("retourne 500 si generateTicketPDF lève une erreur", async () => {
      pool.query.mockResolvedValue({ rows: [fakeReservation] });
      generateTicketPDF.mockRejectedValue(new Error("PDF crash"));

      const res = await request(app)
        .get("/ticket/download/TICKET-123")
        .set(asUser);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("PDF crash");
    });
  });
});