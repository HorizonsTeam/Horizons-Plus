jest.mock("../../../src/db.js", () => {
  const sql = jest.fn();
  return { default: sql };
});

jest.mock("../../../src/utils/promoRules.js", () => ({
  validatePromoConditions: jest.fn(),
}));

import request from "supertest";
import express from "express";
import router from "../../../src/routes/promo.js";
import sql from "../../../src/db.js";
import { validatePromoConditions } from "../../../src/utils/promoRules.js";

const app = express();
app.use(express.json());
app.use("/", router);

const fakePromo = {
  promo_code_id: "SUMMER20",
  actif: true,
  reduction_type: "percent",
  reduction_value: 20,
  conditions: { transport: "train", min_price: 50 },
};

const validBody = {
  code: "SUMMER20",
  transport: "train",
  price: 100,
  class: "2",
};

beforeEach(() => {
  jest.clearAllMocks();
  sql.mockResolvedValue([fakePromo]);
  validatePromoConditions.mockReturnValue(true);
});

describe("POST /validate", () => {
  describe("code introuvable", () => {
    it("retourne 404 si aucune promo ne correspond au code", async () => {
      sql.mockResolvedValue([]);

      const res = await request(app).post("/validate").send(validBody);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ valid: false, message: "Promotion not found" });
    });
  });

  describe("promo inactive", () => {
    it("retourne valid:false si la promo est inactive", async () => {
      sql.mockResolvedValue([{ ...fakePromo, actif: false }]);

      const res = await request(app).post("/validate").send(validBody);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ valid: false, message: "Promotion is inactive" });
    });
  });

  describe("conditions non remplies", () => {
    it("retourne valid:false si validatePromoConditions retourne false", async () => {
      validatePromoConditions.mockReturnValue(false);

      const res = await request(app).post("/validate").send(validBody);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ valid: false, message: "Promotion conditions not met" });
    });

    it("appelle validatePromoConditions avec les bonnes conditions et le bon contexte", async () => {
      const res = await request(app).post("/validate").send(validBody);

      expect(validatePromoConditions).toHaveBeenCalledWith(
        fakePromo.conditions,
        { transport: "train", price: 100, class: "2" }
      );
    });
  });

  describe("cas nominal", () => {
    it("retourne valid:true avec type et value si tout est OK", async () => {
      const res = await request(app).post("/validate").send(validBody);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        valid: true,
        type: "percent",
        value: 20,
      });
    });

    it("fonctionne si conditions est null (pas de conditions)", async () => {
      sql.mockResolvedValue([{ ...fakePromo, conditions: null }]);

      const res = await request(app).post("/validate").send(validBody);

      expect(res.status).toBe(200);
      expect(validatePromoConditions).toHaveBeenCalledWith(
        {},
        expect.any(Object)
      );
    });
  });

  describe("erreur serveur", () => {
    it("retourne 500 si sql lève une erreur", async () => {
      sql.mockRejectedValue(new Error("DB crash"));
      jest.spyOn(console, "error").mockImplementation(() => {});

      const res = await request(app).post("/validate").send(validBody);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error" });
    });
  });
});