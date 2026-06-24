jest.mock("../../../src/services/panierService.js", () => ({
  __esModule: true,
  default: {
    getPanierForUser: jest.fn(),
    addBilletToPanier: jest.fn(),
    deleteBilletFromPanier: jest.fn(),
    clearPanierForUser: jest.fn(),
  },
}));

jest.mock("../../../src/middlewares/attachUserOrGuest.js", () => ({
  attachUserOrGuest: (req, res, next) => {
    req.userId = req.headers["x-user-id"] || null;
    req.sessionId = req.headers["x-session-id"] || null;
    req.session = req.headers["x-user-id"]
      ? { user: { name: "Alice", email: "alice@test.com" } }
      : null;
    next();
  },
}));

import request from "supertest";
import express from "express";
import router from "../../../src/routes/panier.js";
import panierService from "../../../src/services/panierService.js";

const app = express();
app.use(express.json());
app.use("/", router);

// --- helpers ---
const asUser = { "x-user-id": "user-123" };
const asGuest = { "x-session-id": "guest-abc" };

const fakeJourneyBody = {
  journey: { from: "Paris", to: "Lyon" },
  classe: "2",
  siegeRestant: 50,
  dateVoyage: "2027-01-15",
  transportType: "train",
};

describe("Panier routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------------------------------------------------ GET /
  describe("GET /", () => {
    it("retourne le panier d'un utilisateur connecté", async () => {
      const fakePanier = [{ id: 1, billet: "Paris-Lyon" }];
      panierService.getPanierForUser.mockResolvedValue(fakePanier);

      const res = await request(app).get("/").set(asUser);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakePanier);
      expect(panierService.getPanierForUser).toHaveBeenCalledWith({
        userId: "user-123",
        sessionId: null,
      });
    });

    it("retourne le panier d'un invité", async () => {
      const fakePanier = [{ id: 2, billet: "Lyon-Marseille" }];
      panierService.getPanierForUser.mockResolvedValue(fakePanier);

      const res = await request(app).get("/").set(asGuest);

      expect(res.status).toBe(200);
      expect(panierService.getPanierForUser).toHaveBeenCalledWith({
        userId: null,
        sessionId: "guest-abc",
      });
    });

    it("retourne 500 si le service lève une erreur", async () => {
      panierService.getPanierForUser.mockRejectedValue(new Error("DB down"));
      jest.spyOn(console, "error").mockImplementation(() => {});

      const res = await request(app).get("/").set(asUser);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DB down");
    });
  });

  // --------------------------------------------------------------- POST /add
  describe("POST /add", () => {
    it("ajoute un billet pour un utilisateur connecté avec ses infos", async () => {
      const fakeResult = { id: 10, ...fakeJourneyBody };
      panierService.addBilletToPanier.mockResolvedValue(fakeResult);

      const res = await request(app)
        .post("/add")
        .set(asUser)
        .send(fakeJourneyBody);

      expect(res.status).toBe(200);
      expect(panierService.addBilletToPanier).toHaveBeenCalledWith(
        "user-123",
        null,
        expect.objectContaining({ classe: "2", transportType: "train" }),
        { name: "Alice", email: "alice@test.com" }
      );
    });

    it("ajoute un billet pour un invité avec userData Invité", async () => {
      panierService.addBilletToPanier.mockResolvedValue({ id: 11 });

      const res = await request(app)
        .post("/add")
        .set(asGuest)
        .send(fakeJourneyBody);

      expect(res.status).toBe(200);
      expect(panierService.addBilletToPanier).toHaveBeenCalledWith(
        null,
        "guest-abc",
        expect.any(Object),
        { name: "Invité", email: null }
      );
    });

    it("retourne 409 si le billet est déjà dans le panier (code 23505)", async () => {
      const dupError = new Error("duplicate");
      dupError.code = "23505";
      panierService.addBilletToPanier.mockRejectedValue(dupError);
      jest.spyOn(console, "error").mockImplementation(() => {});

      const res = await request(app)
        .post("/add")
        .set(asUser)
        .send(fakeJourneyBody);

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Ce billet est déjà dans votre panier.");
    });

    it("retourne 500 pour toute autre erreur", async () => {
      panierService.addBilletToPanier.mockRejectedValue(new Error("Crash"));
      jest.spyOn(console, "error").mockImplementation(() => {});

      const res = await request(app)
        .post("/add")
        .set(asUser)
        .send(fakeJourneyBody);

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/erreur interne/i);
    });
  });

  // ------------------------------------------------------------ DELETE /delete
  describe("DELETE /delete", () => {
    it("supprime un billet et retourne l'item supprimé", async () => {
      const deleted = { id: 5, billet: "Paris-Lyon" };
      panierService.deleteBilletFromPanier.mockResolvedValue(deleted);

      const res = await request(app)
        .delete("/delete")
        .set(asUser)
        .send({ itemId: 5 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, deletedItem: deleted });
      expect(panierService.deleteBilletFromPanier).toHaveBeenCalledWith(
        "user-123",
        null,
        5
      );
    });

    it("retourne 400 si itemId est absent", async () => {
      const res = await request(app)
        .delete("/delete")
        .set(asUser)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Missing itemId");
      expect(panierService.deleteBilletFromPanier).not.toHaveBeenCalled();
    });

    it("retourne 500 si le service lève une erreur", async () => {
      panierService.deleteBilletFromPanier.mockRejectedValue(new Error("DB error"));
      jest.spyOn(console, "error").mockImplementation(() => {});

      const res = await request(app)
        .delete("/delete")
        .set(asUser)
        .send({ itemId: 5 });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DB error");
    });
  });

  // ------------------------------------------------------------- POST /clear
  describe("POST /clear", () => {
    it("vide le panier et retourne success", async () => {
      panierService.clearPanierForUser.mockResolvedValue({ deletedCount: 3 });

      const res = await request(app).post("/clear").set(asUser);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, deletedCount: 3 });
      expect(panierService.clearPanierForUser).toHaveBeenCalledWith(
        "user-123",
        null
      );
    });

    it("vide le panier d'un invité", async () => {
      panierService.clearPanierForUser.mockResolvedValue({ deletedCount: 1 });

      const res = await request(app).post("/clear").set(asGuest);

      expect(res.status).toBe(200);
      expect(panierService.clearPanierForUser).toHaveBeenCalledWith(
        null,
        "guest-abc"
      );
    });

    it("retourne 500 si le service lève une erreur", async () => {
      panierService.clearPanierForUser.mockRejectedValue(new Error("Crash"));
      jest.spyOn(console, "error").mockImplementation(() => {});

      const res = await request(app).post("/clear").set(asUser);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Crash");
    });
  });
});