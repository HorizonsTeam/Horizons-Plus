jest.mock("../../../dist/auth.js", () => ({
  __esModule: true,
  default: {
    api: {
      getSession: jest.fn(),
      deleteUser: jest.fn(),
    },
    database: {
      updateUser: jest.fn(),
    },
  },
}));

import request from "supertest";
import express from "express";
import router from "../../../src/routes/user.js";
import auth from "../../../dist/auth.js";

const app = express();
app.use(express.json());
app.use("/", router);

// --- fixtures ---
const fakeSession = {
  user: { id: "user-123", email: "alice@test.com" },
};

const fakeUpdatedUser = {
  id: "user-123",
  email: "alice@test.com",
  phone: "+33612345678",
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ------------------------------------------------ POST /phone
describe("POST /phone", () => {
  describe("authentification", () => {
    it("retourne 401 si la session est absente", async () => {
      auth.api.getSession.mockResolvedValue(null);

      const res = await request(app)
        .post("/phone")
        .send({ phone: "+33612345678" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Unauthenticated");
      expect(auth.database.updateUser).not.toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    it("retourne 400 si phone est absent", async () => {
      auth.api.getSession.mockResolvedValue(fakeSession);

      const res = await request(app).post("/phone").send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Phone is required");
      expect(auth.database.updateUser).not.toHaveBeenCalled();
    });

    it("retourne 400 si phone est une chaîne vide", async () => {
      auth.api.getSession.mockResolvedValue(fakeSession);

      const res = await request(app).post("/phone").send({ phone: "" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Phone is required");
    });
  });

  describe("cas nominal", () => {
    it("met à jour le téléphone et retourne l'utilisateur mis à jour", async () => {
      auth.api.getSession.mockResolvedValue(fakeSession);
      auth.database.updateUser.mockResolvedValue(fakeUpdatedUser);

      const res = await request(app)
        .post("/phone")
        .send({ phone: "+33612345678" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ user: fakeUpdatedUser });
    });

    it("appelle updateUser avec le bon userId et le bon numéro", async () => {
      auth.api.getSession.mockResolvedValue(fakeSession);
      auth.database.updateUser.mockResolvedValue(fakeUpdatedUser);

      await request(app).post("/phone").send({ phone: "+33612345678" });

      expect(auth.database.updateUser).toHaveBeenCalledWith("user-123", {
        phone: "+33612345678",
      });
    });
  });

  describe("erreur serveur", () => {
    it("retourne 500 si getSession lève une erreur", async () => {
      auth.api.getSession.mockRejectedValue(new Error("Auth crash"));

      const res = await request(app)
        .post("/phone")
        .send({ phone: "+33612345678" });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Auth crash");
    });

    it("retourne 500 si updateUser lève une erreur", async () => {
      auth.api.getSession.mockResolvedValue(fakeSession);
      auth.database.updateUser.mockRejectedValue(new Error("DB crash"));

      const res = await request(app)
        .post("/phone")
        .send({ phone: "+33612345678" });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DB crash");
    });
  });
});

// ------------------------------------------------ DELETE /delete
describe("DELETE /delete", () => {
  describe("authentification", () => {
    it("retourne 401 si la session est absente", async () => {
      auth.api.getSession.mockResolvedValue(null);

      const res = await request(app).delete("/delete");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Unauthenticated");
      expect(auth.api.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe("cas nominal", () => {
    it("envoie l'email de confirmation et retourne le bon message", async () => {
      auth.api.getSession.mockResolvedValue(fakeSession);
      auth.api.deleteUser.mockResolvedValue(undefined);

      const res = await request(app).delete("/delete");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        "Un email de confirmation a été envoyé pour supprimer votre compte"
      );
    });

    it("appelle deleteUser avec les headers de la requête", async () => {
      auth.api.getSession.mockResolvedValue(fakeSession);
      auth.api.deleteUser.mockResolvedValue(undefined);

      await request(app)
        .delete("/delete")
        .set("authorization", "Bearer token-abc");

      expect(auth.api.deleteUser).toHaveBeenCalledWith({
        headers: expect.objectContaining({
          authorization: "Bearer token-abc",
        }),
      });
    });
  });

  describe("erreur serveur", () => {
    it("retourne 500 si getSession lève une erreur", async () => {
      auth.api.getSession.mockRejectedValue(new Error("Auth crash"));

      const res = await request(app).delete("/delete");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Auth crash");
    });

    it("retourne 500 si deleteUser lève une erreur", async () => {
      auth.api.getSession.mockResolvedValue(fakeSession);
      auth.api.deleteUser.mockRejectedValue(new Error("Delete failed"));

      const res = await request(app).delete("/delete");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Delete failed");
    });
  });
});